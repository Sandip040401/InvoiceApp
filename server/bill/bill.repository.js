import mongoose from 'mongoose'





export default class BillRepository{
    async addBill(data){
        try {
            const { startDate, endDate, partyName, payment, PWT, CASH, BANK, DUE, N_P, TCS, TDS, S_TDS, ATD } = data;
        } catch (err) {
            console.log(err);
        }
    }
}