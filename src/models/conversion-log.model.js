import mongoose from 'mongoose';

const ConversionLogSchema = new mongoose.Schema({
    from: { type: String, required: true, uppercase: true },
    to: { type: String, required: true, uppercase: true },
    amount: { type: Number, required: true },
    result: { type: Number, required: true },
    rateUsed: { type: String, required: true },
    rate: { type: Number, required: true },

    success: { type: Boolean, default: true },
    error: { type: String },
    meta: { type: Object },
}, { timestamps: true });

export const ConversionLog = mongoose.model('ConversionLog', ConversionLogSchema);
