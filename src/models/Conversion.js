import moose from "mongoose";

const ConversionSchema = new moose.Schema({
    from: { type: String, required: true, uppercase: true },
    to: { type: String, required: true, uppercase: true },
    amount: { type: Number, required: true },
    sesult: { type: Number, required: true },
    rateUsed: { type: String, required: true },
    meta: { type: Object },
},
    {
        timestamps: true
    }
);

ConversionSchema.index({ base: 1, symbol: 1 }, { unique: true });
export const Conversion = moose.model('Conversion', ConversionSchema);