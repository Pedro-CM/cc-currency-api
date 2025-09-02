import { Conversion } from '../models/Conversion.js';
import { Rate } from '../models/Rate.js';
import { ConversionLog } from '../models/conversion-log.model.js';

import { fetchFiatRates } from '../providers/openExchange.js';
import { fetchCrypto } from '../providers/coingecko.js';

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
        const { from, to, amount } = data;
        if (!from || !to || !amount) throw new BadRequest('Faltan datos requeridos para la conversion.');
        const fromRate = await Rate.findOne({ symbol: from });
        const toRate = await Rate.findOne({ symbol: to });

        if (!fromRate || !toRate) throw new BadRequest('No se encontraron tasas para las monedas indicadas.');
        const convertValue = (amount / fromRate.value) * toRate.value;
        const formattedValue = Number(convertValue.toFixed(10));

        const log = await ConversionLog.create({

            from: from,
            to: to,
            amount: amount,
            result: formattedValue,
            rateUsed: fromRate.symbol,
            rate: fromRate.value,
            
            success: params.success,
            error: params.error,
            meta: params
        });

        return {
            from: from,
            to: to,
            amount: amount,
            convertedValue: formattedValue
        };
    }


}