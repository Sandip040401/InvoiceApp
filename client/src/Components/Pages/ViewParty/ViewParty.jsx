import React, { useState, useEffect } from "react";
import './ViewParty.css'

function ViewParty() {
    const [selectedParty, setSelectedParty] = useState('');
    const [partyList, setPartyList] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [editedBill, setEditedBill] = useState(null); // State for edited bill
    const [totalPayment, setTotalPayment] = useState(0);
    const [totalPWT, setTotalPWT] = useState(0);
    const [totalCASH, setTotalCASH] = useState(0);
    const [totalBANK, setTotalBANK] = useState(0);
    const [totalDUE, setTotalDUE] = useState(0);
    const [totalN_P, setTotalN_P] = useState(0);
    const [totalTCS, setTotalTCS] = useState(0);
    const [totalTDS, setTotalTDS] = useState(0);
    const [totalS_TDS, setTotalS_TDS] = useState(0);
    const [totalATD, setTotalATD] = useState(0);
    const [totalAllTotals, setTotalAllTotals] = useState(0);
    const [selectedYear, setSelectedYear] = useState('');
    const backendUrl = 'http://localhost:5000';

    // Fetch party list from backend on component mount
    useEffect(() => {
        fetchPartyList();
    }, []);

    // Function to fetch party list from backend
    const fetchPartyList = async () => {
        try {
            setLoading(true); // Set loading to true when fetching data
            const response = await fetch(`${backendUrl}/api/party`);
            if (!response.ok) {
                throw new Error('Failed to fetch party list');
            }
            const data = await response.json();
            setPartyList(data);
        } catch (error) {
            console.error('Error fetching party list:', error);
        } finally {
            setLoading(false); // Set loading to false when data fetching is completed
        }
    };

    // Function to fetch bills associated with the selected party
    const fetchBills = async () => {
        try {
            setLoading(true); // Set loading to true when fetching data
            const response = await fetch(`${backendUrl}/api/bill?partyName=${selectedParty}&year=${selectedYear}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bills');
            }
            const data = await response.json();
            setBills(data);
            let totalPayment = 0;
            let totalPWT = 0;
            let totalCASH = 0;
            let totalBANK = 0;
            let totalDUE = 0;
            let totalN_P = 0;
            let totalTCS = 0;
            let totalTDS = 0;
            let totalS_TDS = 0;
            let totalATD = 0;
            let totalAllTotals = 0;
            data.forEach(bill => {
                totalPayment += (bill.payment);
                totalPWT += (bill.PWT);
                totalCASH += (bill.CASH);
                totalBANK += (bill.BANK);
                totalDUE += (bill.DUE);
                totalN_P += (bill.N_P);
                totalTCS += (bill.TCS);
                totalTDS += (bill.TDS);
                totalS_TDS += (bill.S_TDS);
                totalATD += (bill.ATD);
                totalAllTotals += (bill.total);
            });
            setTotalPayment(totalPayment);
            setTotalPWT(totalPWT);
            setTotalCASH(totalCASH);
            setTotalBANK(totalBANK);
            setTotalDUE(totalDUE);
            setTotalN_P(totalN_P);
            setTotalTCS(totalTCS);
            setTotalTDS(totalTDS);
            setTotalS_TDS(totalS_TDS);
            setTotalATD(totalATD);
            setTotalAllTotals(totalAllTotals);

        } catch (error) {
            console.error('Error fetching bills:', error);
        } finally {
            setLoading(false); // Set loading to false when data fetching is completed
        }
    };

    // Handle party selection change
    const handlePartyChange = (e) => {
        setSelectedParty(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    // Fetch bills when a party is selected
    useEffect(() => {
        if (selectedParty && selectedYear) {
            fetchBills();
        } else {
            // Clear bills when no party is selected
            setBills([]);
        }
    }, [selectedParty, selectedYear]);

    
    
   const downloadCSV = () => {
    // Extract column names excluding '_id'
    const columnNames = Object.keys(bills[0]).filter(key => key !== '_id' && key !== 'startDate' && key != 'endDate');

    // Construct CSV content with column names followed by data (excluding '_id' column)
    let csvContent = "data:text/csv;charset=utf-8," 
        + [columnNames.join(','), ...bills.map(bill => {
            // Exclude '_id' value from each bill
            return columnNames.map(column => bill[column]).join(',');
        })].join('\n');
    
    // Add a row for total payment
    const totalPaymentRow = `Total:,${totalPayment},${totalPWT},${totalCASH},${totalBANK},${totalDUE},${totalN_P},${totalTCS},${totalTDS},${totalS_TDS},${totalATD},${totalAllTotals}`;
    csvContent += `\n\n${totalPaymentRow}`;

    // Encode the CSV content URI
    const encodedUri = encodeURI(csvContent);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bills.csv");

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();
};

    
    

    // Function to handle editing a bill
    const handleEditBill = (billId) => {
        console.log("Editing bill with ID:", billId);
        const billToEdit = bills.find(bill => bill.id === billId);
        console.log("Bill to edit:", billToEdit);
        setEditedBill({ ...billToEdit }); // Copy the bill to be edited into state
    };
    

// Function to save the edited bill
    const saveEditedBill = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/bill/${editedBill.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedBill)
            });
            if (!response.ok) {
                throw new Error('Failed to save edited bill');
            }
            // Update the bills state with the edited bill
            setBills(prevBills => prevBills.map(bill => (bill.id === editedBill.id ? editedBill : bill)));
            setEditedBill(null); // Reset editedBill state after saving
            alert('Bill updated successfully'); // Show success alert
        } catch (error) {
            console.error('Error saving edited bill:', error);
            alert('Failed to save edited bill'); // Show error alert
        }
    };


    // Function to handle changes in the edited bill fields
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditedBill(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    return (
        <div className="view-party-container">
            <div className="select-container" style={{display:'flex',justifyContent:'space-evenly'}}>
                <div className="select-party">
                 <h2>Select Party</h2>
                    <select value={selectedParty} onChange={handlePartyChange}>
                        <option value="">Select Party</option>
                        {partyList.map((party, index) => (
                            <option key={index} value={party}>{party}</option>
                        ))}
                    </select>
                </div>
                <div className="select-year">
                    <h2>Enter Year</h2>
                        <select className="input-year" value={selectedYear} onChange={handleYearChange}>
                            {Array.from({ length: 7 }, (_, index) => (
                                <option key={index} value={2024 + index}>
                                {2024 + index}
                                </option>
                            ))}
                        </select>

                </div>
            </div>
            {loading ? ( // Show loading indicator if loading is true
                <div>Loading...</div>
            ) : (
                <div className="view-party-bill-container">
                <>
                    {bills.length > 0 && (
                        <div className="bills-container">
                            <h2>Bills for {selectedParty}</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Party Name</th>
                                        <th>Payment</th>
                                        <th>PWT</th>
                                        <th>CASH</th>
                                        <th>BANK</th>
                                        <th>DUE</th>
                                        <th>N_P</th>
                                        <th>TCS</th>
                                        <th>TDS</th>
                                        <th>S_TDS</th>
                                        <th>ATD</th>
                                        <th>Total</th>
                                        <th>Actions</th> {/* Add Actions column */}
                                    </tr>
                                </thead>
                                <tbody>
                                {bills.map((bill, index) => (
                                    <tr key={index}>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="Date"
                                                    value={editedBill.Date}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.Date}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="partyName"
                                                    value={editedBill.partyName}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.partyName}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="payment"
                                                    value={editedBill.payment}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.payment}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="PWT"
                                                    value={editedBill.PWT}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.PWT}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="CASH"
                                                    value={editedBill.CASH}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.CASH}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="BANK"
                                                    value={editedBill.BANK}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.BANK}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="DUE"
                                                    value={editedBill.DUE}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.DUE}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="N_P"
                                                    value={editedBill.N_P}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.N_P}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="TCS"
                                                    value={editedBill.TCS}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.TCS}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="TDS"
                                                    value={editedBill.TDS}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.TDS}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="S_TDS"
                                                    value={editedBill.S_TDS}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.S_TDS}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="ATD"
                                                    value={editedBill.ATD}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.ATD}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <input
                                                    type="text"
                                                    name="total"
                                                    value={editedBill.total}
                                                    onChange={handleEditInputChange}
                                                />
                                            ) : bill.total}
                                        </td>
                                        <td>
                                            {editedBill && editedBill.id === bill.id ? (
                                                <button onClick={saveEditedBill}>Save</button>
                                            ) : (
                                                <button onClick={() => handleEditBill(bill.id)}>Edit</button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                                    <tr>
                                        <td colSpan="2">Total Payment</td>
                                        <td>{totalPayment}</td>
                                        <td>{totalPWT}</td>
                                        <td>{totalCASH}</td>
                                        <td>{totalBANK}</td>
                                        <td>{totalDUE}</td>
                                        <td>{totalN_P}</td>
                                        <td>{totalTCS}</td>
                                        <td>{totalTDS}</td>
                                        <td>{totalS_TDS}</td>
                                        <td>{totalATD}</td>
                                        <td>{totalAllTotals}</td>
                                        <td></td>
                                    </tr>
                            </tbody>

                            </table>
                            <button className='view-bill-button' onClick={downloadCSV}>Download CSV</button>
                        </div>
                    )}
                </>
                </div>
            )}
        </div>
    );
}

export default ViewParty;




