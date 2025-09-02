import { Rate } from '../models/Rate.js';
import { fetchFiatRates } from '../providers/openExchange.js';
import { fetchCrypto } from '../providers/coingecko.js';
import { BadRequest } from '@feathersjs/errors';
import { rateSchema } from '../schemas/schemas.js';
export class RatesService {
    async find(data) {
        const q = (data && data.query) || {};
        const refresh = q.refresh === 'true';
        if (refresh) {
            const [fiat, crypto] = await Promise.all([
                fetchFiatRates(),
                fetchCrypto()
            ]);
            const merged = { ...fiat, ...crypto };
            const symbols = Object.keys(merged);

            if (symbols.length) {
                await Rate.bulkWrite(symbols.map(sym => ({
                    updateOne: {
                        filter: { base: 'USD', symbol: sym.toUpperCase() },
                        update: { $set: { value: Number(merged[sym]) } },
                        upsert: true
                    }
                })));
            }

        }

        const docs = await Rate.find({ base: 'USD' }).sort({ symbol: 1 }).lean();
        return { data: docs, total: docs.length };
    }

    async create(data) {
        const { error, value } = rateSchema.validate(data);
        if (error) {
            throw new BadRequest(error.details[0].message);
        }

        const { base, symbol } = value;

        let rateValue;

        try {
            const cryptoData = await fetchCrypto();

            rateValue = Number(cryptoData[symbol]);

        } catch (cryptoError) {
            try {
                const fiatData = await fetchFiatRates(base, symbol);
                rateValue = Number(fiatData[symbol]);
            } catch (fiatError) {
                throw new BadRequest(`No se pudo obtener el valor para ${base} a ${symbol}.`);
            }
        }
        if (!(rateValue >= 0)) {
            throw new BadRequest('El valor de la tasa debe ser un número positivo.');
        }

        const doc = await Rate.findOneAndUpdate(
            { base, symbol },
            { $set: { value: rateValue } },
            { new: true, upsert: true }
        );

        return doc.toObject();
    }
}