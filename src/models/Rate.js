import mongoose from "mongoose";

const RateSchema = new mongoose.Schema({
    base: { type: String, default: 'USD', required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, index: true },
    value: { type: Number, required: true },
},
    {
        timestamps: true
    });

RateSchema.index({ base: 1, symbol: 1 }, { unique: true });
export const Rate = mongoose.model('Rate', RateSchema);