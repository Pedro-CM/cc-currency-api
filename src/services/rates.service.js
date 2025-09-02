import { Rate } from '../models/Rate.js';
import { fetchFiatRates } from '../providers/openExchange.js';
import { fetchCrypto } from '../providers/coingecko.js';
import { BadRequest } from '@feathersjs/errors';
export class RatesService {
    async find(params) {
        const q = (params && params.query) || {};
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
        const base = (data.base || '').toUpperCase();
        const symbol = String(data.symbol || '').toUpperCase();

        if (!symbol) throw new BadRequest('symbol es requerido');
        if (!base) throw new BadRequest('base es requerido');
        let value;

        try {
            const cryptoData = await fetchCrypto(base, symbol);
            value = Number(cryptoData[symbol]);
        } catch (cryptoError) {
            try {
                const fiatData = await fetchFiatRates(base, symbol);
                console.log(fiatData);
                value = Number(fiatData[symbol]);
                console.log(value);
            } catch (fiatError) {
                throw new BadRequest(`No se pudo obtener el valor para ${base} a ${symbol}.`);
            }
        }
        if (!(value >= 0)) {
            throw new BadRequest('El valor de la tasa debe ser un número positivo.');
        }

        const doc = await Rate.findOneAndUpdate(
            { base, symbol },
            { $set: { value } },
            { new: true, upsert: true }
        );

        return doc.toObject();
    }
}