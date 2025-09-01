import { Rate } from '../models/Rate.js';
import { fetchFiatRates } from '../providers/openExchange.js';
import { fetchCrypto } from '../providers/coingecko.js';
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
        const base = (data.base || 'USD').toUpperCase();
        const symbol = String(data.symbol || '').toUpperCase();
        const value = Number(data.value);

        if (!symbol) throw new Error('symbol requerido');
        if (!(value > 0)) throw new Error('value debe ser > 0');

        const doc = await Rate.findOneAndUpdate(
            { base, symbol },
            { $set: { value } },
            { new: true, upsert: true }
        );
        return doc.toObject();
    }
}