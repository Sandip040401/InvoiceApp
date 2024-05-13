import React, { useState } from "react";
import './ViewBill.css';

function ViewBill(){
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [bills, setBills] = useState([]);
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
    const [showDateRange, setShowDateRange] = useState(false);
    const backendUrl = 'http://localhost:5000';

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    }

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${backendUrl}/api/bills?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setBills(data);
            setShowDateRange(true);
            
            // Calculate total payment and total of all totals
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
            console.error('Error fetching data:', error);
            // Handle error as needed
        }
    }

    const handleDownloadCSV = () => {
        const csvContent = convertToCSV(bills, startDate, endDate);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bills.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
    

    const convertToCSV = (data, startDate, endDate) => {
        const headers = 'Serial No,P_Name,Payment,PWT,CASH,BANK,DUE,N_P,TCS,TDS,S_TDS,ATD,Total';
        const rows = data.map((obj, index) => {
            return `${index + 1},"${obj.partyName}",${obj.payment},${obj.PWT},${obj.CASH},${obj.BANK},${obj.DUE},${obj.N_P},${obj.TCS},${obj.TDS},${obj.S_TDS},${obj.ATD},${obj.total}`;
        });
    
        // Calculate total
        let totalRow = 'Total,';
        const totalColumns = Object.keys(data[0]).length - 1; // Excluding the first column (date) for the total row
        for (let i = 3; i < totalColumns; i++) {
            if (i === 3) {
                totalRow += ','; // Leave blank for dates and party names
            } else {
                const columnTotal = data.reduce((acc, curr) => acc + curr[Object.keys(curr)[i]], 0);
                totalRow += `${columnTotal},`;
            }
        }
        totalRow += data.reduce((acc, curr) => acc + curr.total, 0);
    
        const dateRow = `Date:,${startDate} to ${endDate}`;
    
        return `${headers}\n${rows.join('\n')}\n${totalRow}\n${dateRow}`;
    }
    
    
    
    
    

    return(
        <>
            <div className="view-bill-container">
                <form onSubmit={handleSubmit} className="view-bill-form">
                    <h2>Enter Weekly Date</h2>
                    <label htmlFor="start-date">Start Date:</label>
                    <input 
                        type="date" 
                        id="start-date" 
                        value={startDate} 
                        onChange={handleStartDateChange} 
                        placeholder="Start Date"
                    />
                    <label htmlFor="end-date">End Date:</label>
                    <input 
                        type="date" 
                        id="end-date" 
                        value={endDate} 
                        onChange={handleEndDateChange} 
                        placeholder="End Date"
                    />
                    <button type="submit">View Bill</button>
                </form>
            </div>
            {bills.length > 0 && (
                <div className="download-csv-container">
                    <button onClick={handleDownloadCSV}>Download CSV</button>
                </div>
            )}
            {showDateRange && (
                <div className="date-range-heading"> 
                    <h3 style={{marginLeft:"40px",fontWeight:'500'}}>Date Range: {startDate} to {endDate}</h3>
                </div>
            )}
            <div className="bills-container">
                <table>
                    <thead>
                        <tr>
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
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill, index) => (
                            <tr key={index}>
                                <td>{bill.partyName}</td>
                                <td>{bill.payment}</td>
                                <td>{bill.PWT}</td>
                                <td>{bill.CASH}</td>
                                <td>{bill.BANK}</td>
                                <td>{bill.DUE}</td>
                                <td>{bill.N_P}</td>
                                <td>{bill.TCS}</td>
                                <td>{bill.TDS}</td>
                                <td>{bill.S_TDS}</td>
                                <td>{bill.ATD}</td>
                                <td>{bill.total}</td>
                            </tr>
                        ))}
                        <tr>
                            <td>Total Payment</td>
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
                            </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ViewBill;
