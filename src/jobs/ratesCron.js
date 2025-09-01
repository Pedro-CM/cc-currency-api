import axios from 'axios';

export function startRatesCron(port) {
    const TEN_MIN = 10 * 60 * 1000;
    let running = false;

    const refreshRates = async () => {
        if (running) return;
        running = true;
        try {
            const url = `http://localhost:${port}/rates?refresh=true`;
            const res = await axios.get(url, { timeout: 30000 });
            console.log(`[CRON] Refrescadas tasas -> status=${res.status}, total=${res.data?.total}`);
        } catch (e) {
            console.error('[CRON] Error al refrescar tasas:', e.message);
        } finally {
            running = false;
        }
    };

    refreshRates();

    setInterval(refreshRates, TEN_MIN);
}
