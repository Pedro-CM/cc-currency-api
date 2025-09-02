import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import { RatesService } from './services/rates.service.js';
import { ConvertService } from './services/convert.service.js';
import { ReportService } from './services/report.service.js';
const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());
app.configure(socketio());
app.use('/rates', new RatesService(), {
    methods: ['find', 'create']
});
const passRes = (req, res, next) => {
    req.feathers = req.feathers || {};
    req.feathers.res = res;
    next();
};
app.use('/convert', new ConvertService(), {
    methods: ['create']
});
app.use('/report', passRes, new ReportService(), { methods: ['find'] });
app.service('/report').hooks({
    after: {
        find: [
            async (context) => {
                const { result, params } = context;
                const res = params.res;

                if (Buffer.isBuffer(result) && res && !res.headersSent) {
                    const filename = `reporte-${new Date().toISOString().slice(0, 10)}.pdf`;
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
                    res.setHeader('Content-Length', String(result.length));
                    res.send(result);  

                    context.result = undefined;
                }
                return context;
            }
        ]
    }
});
app.use(express.errorHandler());
export { app };