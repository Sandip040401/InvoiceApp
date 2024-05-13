import React, { useState, useEffect } from "react";
import './AddBill.css';

function AddBill() {
    const [formData, setFormData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [partyNames, setPartyNames] = useState([]);

    useEffect(() => {
        fetchPartyNames();
    }, []);

    const fetchPartyNames = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/party`);
            if (!response.ok) {
                throw new Error('Error fetching party names');
            }
            const partyNamesData = await response.json();
            setPartyNames(partyNamesData);
            // Initialize form data for each party name
            const initialFormData = partyNamesData.map(party => ({
                partyName: party,
                payment: '',
                PWT: '',
                CASH: '',
                BANK: '',
                DUE: '',
                N_P: '',
                TCS: '',
                TDS: '',
                S_TDS: '',
                ATD: ''
            }));
            setFormData(initialFormData);
        } catch (error) {
            console.error('Error fetching party names: ', error);
        }
    };

    const handleChange = (index, name, value) => {
        const updatedFormData = [...formData];
        updatedFormData[index][name] = value || '0'; // Set default value to '0' if empty
        setFormData(updatedFormData);
    };

    const getTotal = (data) => {
        const numbers = Object.entries(data)
            .filter(([key, value]) => key !== 'payment' && !isNaN(value))
            .map(([key, value]) => parseFloat(value || 0));
        return numbers.reduce((acc, curr) => acc + curr, 0).toFixed(2);
    };
    

    const backendUrl = 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Date) {
            window.alert('Date is required.');
            return;
        }
        try {
            const bills = formData.map(data => ({
                startDate,
                endDate,
                partyName: data.partyName,
                payment: data.payment,
                PWT: data.PWT,
                CASH: data.CASH,
                BANK: data.BANK,
                DUE: data.DUE,
                N_P: data.N_P,
                TCS: data.TCS,
                TDS: data.TDS,
                S_TDS: data.S_TDS,
                ATD: data.ATD,
            }));

            const response = await fetch(`${backendUrl}/api/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bills)
            });

            if (!response.ok) {
                throw new Error('Error adding bills');
            }

            window.alert('Bills added successfully');
        } catch (error) {
            window.alert('Error adding bills: ' + error.message);
        }
    };

    const handleKeyDown = (e) => {
        const inputs = document.getElementsByTagName('input');
        const currentIndex = Array.from(inputs).findIndex(input => document.activeElement === input);
        let nextIndex;
    
        if (e.key === "a" || e.key === "A") { // A key - Left
            e.preventDefault();
            nextIndex = currentIndex === 0 ? inputs.length - 1 : currentIndex - 1;
        } else if (e.key === "d" || e.key === "D") { // D key - Right
            e.preventDefault();
            nextIndex = currentIndex === inputs.length - 1 ? 0 : currentIndex + 1;
        } else if (e.key === "w" || e.key === "W") { // W key - Up
            e.preventDefault();
            nextIndex = currentIndex === 0 ? inputs.length - 1 : currentIndex - 1;
        } else if (e.key === "s" || e.key === "S") { // S key - Down
            e.preventDefault();
            nextIndex = currentIndex === inputs.length - 1 ? 0 : currentIndex + 1;
        }
    
        inputs[nextIndex].focus();
    }
    
    

    return (
        <div className="add-bill-container" onKeyDown={handleKeyDown} tabIndex={0}>
            <div className="heading">
                <b>Add Weekly Bill</b>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="date-range">
                    <label>Enter Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    <label>Enter End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    <p style={{marginLeft:"40px"}}>Press <b>A</b> / <b>D</b> to move <b>LEFT</b> / <b>RIGHT</b></p>
                </div>
                <div className="form-row">
                    <div className="data-columns">
                        <div className="data-row">
                            <div className="label-column">Party Name</div>
                            <div className="label-column">Payment</div>
                            <div className="label-column">PWT</div>
                            <div className="label-column">CASH</div>
                            <div className="label-column">BANK</div>
                            <div className="label-column">DUE</div>
                            <div className="label-column">N_P</div>
                            <div className="label-column">TCS</div>
                            <div className="label-column">TDS</div>
                            <div className="label-column">S_TDS</div>
                            <div className="label-column">ATD</div>
                            <div className="label-column">Total</div>
                        </div>
                        {formData.map((data, index) => (
                            <div key={index} className="data-row">
                                <div className="label-column">{partyNames[index]}</div>
                                <input
                                    type="number"
                                    name="payment"
                                    style={{color:"red",fontWeight:'bold',fontSize:'16px'}}
                                
                                    value={data.payment}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="PWT"
                                    value={data.PWT}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="CASH"
                                    value={data.CASH}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="BANK"
                                    value={data.BANK}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="DUE"
                                    value={data.DUE}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="N_P"
                                    value={data.N_P}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="TCS"
                                    value={data.TCS}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="TDS"
                                    value={data.TDS}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="S_TDS"
                                    value={data.S_TDS}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="number"
                                    name="ATD"
                                    value={data.ATD}
                                    onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                                    placeholder="0"
                                />
                                <input
                                    type="text"
                                    value={getTotal(data)}
                                    disabled
                                    className="total-input"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="add-row-button">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default AddBill;
