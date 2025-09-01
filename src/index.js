import 'dotenv/config';
import { app } from './server.js';
import { connectDB } from './config/db.js';
import { startRatesCron } from './jobs/ratesCron.js';
const PORT = process.env.PORT || 3030;

async function start() {
    await connectDB();
    const server = app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });

    startRatesCron(PORT);
}

start().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
});