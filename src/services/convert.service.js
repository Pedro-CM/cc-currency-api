import { Rate } from '../models/Rate.js';
import { Conversions } from '../models/Conversion.js';
import { conversionSchema } from '../schemas/schemas.js';
import { BadRequest } from '@feathersjs/errors';
export class ConvertService {
    /* 
        metodod POST /convert para realizar la conversion de monedas y guardar los logs de las conversiones
        body {
            from: USD
            to: EUR
            amount: 100
        }
        response {
            from: USD
            to: EUR
            amount: 100
            result: 100
            rate: 0.95
            rateUsed: OXR
        }
    
    */

    async create(data, params) {
        const { error, value } = conversionSchema.validate(data);
        if (error) throw new BadRequest(error.details[0].message);
        const { from, to, amount } = value;

        try {

            const fromRate = await Rate.findOne({ symbol: from });
            const toRate = await Rate.findOne({ symbol: to });

            if (!fromRate || !toRate) throw new BadRequest('No se encontraron tasas para las monedas indicadas.');
            const convertValue = (amount / fromRate.value) * toRate.value;
            const formattedValue = Number(convertValue.toFixed(10));

            const log = await Conversions.create({

                from: from,
                to: to,
                amount: amount,
                result: formattedValue,
                rateUsed: fromRate.symbol,
                rate: fromRate.value,
                success: params.success,
                meta: params
            });

            return {
                from: from,
                to: to,
                amount: amount,
                convertedValue: formattedValue
            };
        } catch (e) {
            throw new BadRequest(e.message);
        }

    }


}