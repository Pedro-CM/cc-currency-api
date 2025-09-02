import axios from "axios";

export async function fetchCrypto(base, symbol) {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets`
        const headers = {}
        if (process.env.COINGECKO_API_KEY) {
            headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
        }
        const { data } = await axios.get(url, {
            headers,
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                page: 1,
                sparkline: false,
            }
        })
        const result = {}
        data.forEach(c => {
            if (c.current_price && c.current_price > 0) {
                result[c.symbol.toUpperCase()] = 1 / c.current_price
            }
        });
        return result
    } catch (e) {
        console.error(e);
    }
}
