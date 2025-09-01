import axios from "axios";

export async function fetchFiatRates() {
    try {
        const apikey = process.env.OXR_APP_ID
        if (!apikey) return console.error('No API key provided');
        const urlCompuesta = `https://api.fastforex.io/fetch-all?api_key=${apikey}`
        const { data } = await axios.get(urlCompuesta);
        return data.results || {};

    } catch (e) {
        console.error(e);
    }
}