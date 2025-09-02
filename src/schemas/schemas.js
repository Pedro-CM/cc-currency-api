import joi from 'joi';
export const rateSchema = joi.object().keys({
    base: joi.string().length(3).required(),
    symbol: joi.string().length(3).required(),
})

export const conversionSchema = joi.object().keys({
    from: joi.string().length(3).required(),
    to: joi.string().length(3).required(),
    amount: joi.number().min(0).required(),
});