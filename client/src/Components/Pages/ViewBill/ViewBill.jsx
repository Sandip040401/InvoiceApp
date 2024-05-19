import React, { useState } from "react";
import ExcelJS from 'exceljs';

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

    
    const handleDownloadExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bills');

        // Add headers
        worksheet.addRow(['Serial No', 'P_Name', 'Payment', 'PWT', 'CASH', 'BANK', 'DUE', 'N_P', 'TCS', 'TDS', 'S_TDS', 'ATD', 'Total']);

        // Add data rows
        bills.forEach((bill, index) => {
            worksheet.addRow([
                index + 1,
                bill.partyName,
                bill.payment,
                bill.PWT,
                bill.CASH,
                bill.BANK,
                bill.DUE,
                bill.N_P,
                bill.TCS,
                bill.TDS,
                bill.S_TDS,
                bill.ATD,
                bill.total
            ]);
        });

        // Add total row
        worksheet.addRow([
            'Total',
            '',
            totalPayment,
            totalPWT,
            totalCASH,
            totalBANK,
            totalDUE,
            totalN_P,
            totalTCS,
            totalTDS,
            totalS_TDS,
            totalATD,
            totalAllTotals
        ]);

        // Add date range row
        worksheet.addRow(['Date:', `${startDate} to ${endDate}`]);

        // Write to file
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bills.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
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
                    <button onClick={handleDownloadExcel}>Download EXCEL</button>
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
