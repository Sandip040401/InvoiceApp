
export default class BillModel{
    constructor(startDate, endDate, partyName, payment, PWT, CASH, BANK, DUE, N_P, TCS, TDS, S_TDS, ATD, total, id){
        this.startDate = startDate;
        this.endDate = endDate;
        this.partyName = partyName;
        this.payment = payment;
        this.PWT = PWT;
        this.CASH = CASH;
        this.BANK = BANK;
        this.DUE = DUE;
        this.N_P = N_P;
        this.TCS = TCS;
        this.TDS = TDS;
        this.S_TDS = S_TDS;
        this.ATD = ATD;
        this.total = total;
        this._id = id;
    }
}