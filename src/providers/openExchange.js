import axios from "axios";

export async function fetchFiatRates(base, symbols) {
    try {
        const apikey = process.env.OXR_APP_ID
        if (!apikey) return console.error('No API key provided');
        if (base === undefined && symbols === undefined) {
            const urlCompuesta = `https://api.fastforex.io/fetch-all?api_key=${apikey}`
            const { data } = await axios.get(urlCompuesta);
            return data.results || {};
        } else {
            const urlSimple = `  https://api.fastforex.io/fetch-multi?from=${base}&to=${symbols}&api_key=${apikey}`
            const { data } = await axios.get(urlSimple);
            return data.results || {};
        }

    } catch (e) {
        return { code: 500 };
    }
}