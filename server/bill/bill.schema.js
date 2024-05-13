import mongoose from 'mongoose';

export const billSchema = new mongoose.Schema({
    startDate: Date,
    endDate: Date,
    partyName: String,
    payment: Number,
    PWT: Number,
    CASH: Number,
    BANK: Number,
    DUE: Number,
    N_P: Number,
    TCS: Number,
    TDS: Number,
    S_TDS: Number,
    ATD: Number,
    total: Number,
    _id: String
});
