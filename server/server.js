// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/billDB').then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});




// Route to update a bill
app.put('/api/bill/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBillData = req.body;

        // Find the collection containing the bill
        const collections = await mongoose.connection.db.listCollections().toArray();
        let collectionName = null;
        for (const collection of collections) {
            if (await mongoose.connection.db.collection(collection.name).findOne({ id: parseInt(id) })) {
                collectionName = collection.name;
                break;
            }
        }

        // If collection not found
        if (!collectionName) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        // Update the bill
        const result = await mongoose.connection.db.collection(collectionName)
            .updateOne({ id: parseInt(id) }, { $set: updatedBillData });

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }

        res.json({ message: 'Bill updated successfully' });
    } catch (error) {
        console.error('Error updating bill:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to get bills within a specified date range
app.get('/api/bills', async (req, res) => {
    try {
        // Validate input parameters
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }

        // Parse start and end dates into Date objects
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid startDate or endDate' });
        }

        // Array to store bills from all collections
        let allBills = [];

        // Fetch all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        // Iterate over each collection
        for (const collection of collections) {
            const collectionName = collection.name;
            
            // Find bills within the specified date range for each collection
            const bills = await mongoose.connection.db.collection(collectionName).find({
                $expr: {
                    $and: [
                        { $gte: [{ $toDate: "$startDate" }, start] },
                        { $lte: [{ $toDate: "$endDate" }, end] }
                    ]
                }
            }).toArray();
            
            // Add bills to the array if found
            if (bills.length > 0) {
                allBills = allBills.concat(bills);
            }
        }
        res.json(allBills);
        
        
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Route to get bills for a specific party name
app.get('/api/bill', async (req, res) => {
    try {
        const { partyName, year } = req.query;
        // Validate input parameters
        if (!partyName || !year) {
            return res.status(400).json({ error: 'partyName and year are required' });
        }

        const parsedYear = parseInt(year);
        // Assuming 'partyName' is the collection name and 'startYear' is a field in documents
        const bills = await mongoose.connection.db.collection(partyName)
            .find({
                startYear: parsedYear // Use parsedYear instead of year
            })
            .toArray();
        res.json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Server error' });
    }
});














// Route to get all party names
app.get('/api/party', async (req, res) => {
    try {
        // Fetch all collections in the database
        const collections = await mongoose.connection.db.listCollections().toArray();
        const partyNames = collections.map(collection => collection.name);
        res.json(partyNames);
    } catch (error) {
        console.error('Error fetching party names:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



// Route to add a party
app.post('/api/party', async (req, res) => {
    try {
        const { partyName } = req.body;

        // Check if party collection already exists
        const collectionExists = await mongoose.connection.db.listCollections({ name: partyName }).hasNext();
        if (collectionExists) {
            return res.status(400).json({ error: 'Party already exists' });
        }
        // Create party collection
        await mongoose.connection.createCollection(partyName);

        res.status(201).json({ message: 'Party added successfully' });
    } catch (error) {
        console.error('Error adding party:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Route to add a bill
app.post('/api/bills', async (req, res) => {
    try {
        let bills = req.body; // Array of bills, each bill is an object
        // Function to convert empty strings to zero
        const convertToZero = (value) => (value === '' ? 0 : parseFloat(value));

        // Modify bills array to replace empty strings with zero and add startYear
        bills = bills.map(bill => {
            const { startDate, endDate, partyName, payment, PWT, CASH, BANK, DUE, N_P, TCS, TDS, S_TDS, ATD } = bill;
            return {
                startDate,
                endDate,
                partyName,
                payment: convertToZero(payment),
                PWT: convertToZero(PWT),
                CASH: convertToZero(CASH),
                BANK: convertToZero(BANK),
                DUE: convertToZero(DUE),
                N_P: convertToZero(N_P),
                TCS: convertToZero(TCS),
                TDS: convertToZero(TDS),
                S_TDS: convertToZero(S_TDS),
                ATD: convertToZero(ATD),
                total: PWT + CASH + BANK + DUE + N_P + TCS + TDS + S_TDS + ATD,
                startYear: new Date(startDate).getFullYear() // Extracting the year from startDate
            };
        });

        for (const bill of bills) {
            const { startDate, endDate, partyName, payment, PWT, CASH, BANK, DUE, N_P, TCS, TDS, S_TDS, ATD } = bill;
        
            // Find the existing collection with the partyName
            const existingCollection = await mongoose.connection.db.collection(partyName);
        
            if (!existingCollection) {
                return res.status(400).json({ error: `Party '${partyName}' does not exist` });
            }
        
            // Create a new document with the bill details
            const newBill = {
                startDate,
                endDate,
                partyName,
                payment,
                PWT,
                CASH,
                BANK,
                DUE,
                N_P,
                TCS,
                TDS,
                S_TDS,
                ATD,
                total: PWT + CASH + BANK + DUE + N_P + TCS + TDS + S_TDS + ATD,
                startYear: new Date(startDate).getFullYear() // Extracting the year from startDate
            };
        
            // Insert the new document into the existing collection
            await existingCollection.insertOne(newBill);
        }
        
        res.status(201).json({ message: 'Bills added successfully' });
        

    } catch (error) {
        console.error('Error saving bills:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
