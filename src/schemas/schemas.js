import joi from 'joi';
export const convertSchema = joi.object().keys({
    base: joi.string().length(3).required(),
    symbol: joi.string().length(3).required(),
})

export const conversionLogSchema = joi.object().keys({
    from: joi.string().length(3).required(),
    to: joi.string().length(3).required(),
    amount: joi.number().min(0).required(),
});