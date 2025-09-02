import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import { RatesService } from './services/rates.service.js';
import { ConvertService } from './services/convert.service.js';
const app = express(feathers());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());
app.configure(socketio());
app.use('/rates', new RatesService(), {
    methods: ['find', 'create']
});

app.use('/convert', new ConvertService(), {
    methods: ['create']
});
app.use(express.errorHandler());
export { app };