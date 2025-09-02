import feathers from '@feathersjs/feathers';
import { ConvertService } from './convert.service.js';
import { Conversions } from '../models/Conversion.js';
import { Rate } from '../models/Rate.js';
import { BadRequest } from '@feathersjs/errors';

jest.mock('../models/Conversion.js', () => ({
    Conversions: { create: jest.fn() },
}));
jest.mock('../models/Rate.js', () => ({
    Rate: { findOne: jest.fn() },
}));
jest.mock('../queue/rabbit.js', () => ({
    sendToQueue: jest.fn().mockResolvedValue(undefined),
}));

describe('ConvertService', () => {
    let app;
    let service;

    beforeEach(() => {
        app = feathers();

        app.use('/convert', new ConvertService(), { methods: ['create'] });
        service = app.service('convert');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should successfully convert a valid amount and log it to the database', async () => {
            const from = 'USD';
            const to = 'EUR';
            const amount = 100;

            Rate.findOne
                .mockResolvedValueOnce({ symbol: 'USD', value: 1 })
                .mockResolvedValueOnce({ symbol: 'EUR', value: 0.9 });

            Conversions.create.mockResolvedValueOnce({ _id: 'mock-id' });

            const result = await service.create({ from, to, amount });

            expect(Rate.findOne).toHaveBeenNthCalledWith(1, { symbol: from });
            expect(Rate.findOne).toHaveBeenNthCalledWith(2, { symbol: to });

            const expectedConverted = Number(((amount / 1) * 0.9).toFixed(10));
            expect(Conversions.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    from,
                    to,
                    amount,
                    result: expectedConverted,
                    rateUsed: 'USD',
                    rate: 1,
                })
            );

            expect(result).toEqual({
                from,
                to,
                amount,
                convertedValue: expectedConverted,
            });
        });

        it('should throw an error if the conversion rate is not found', async () => {
            const from = 'USD';
            const to = 'BRL';
            const amount = 50;

            Rate.findOne
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ symbol: 'BRL', value: 5 });

            await expect(service.create({ from, to, amount })).rejects.toThrow(BadRequest);
            await expect(service.create({ from, to, amount })).rejects.toThrow(
                'No se encontraron tasas para las monedas indicadas.'
            );

            expect(Conversions.create).not.toHaveBeenCalled();
        });

        it('should throw an error for invalid input due to Joi validation', async () => {
            const invalidData = { from: 'USD', to: 'EUR' };

            await expect(service.create(invalidData)).rejects.toThrow(BadRequest);
            await expect(service.create(invalidData)).rejects.toThrow(/amount/i);

            expect(Conversions.create).not.toHaveBeenCalled();
            expect(Rate.findOne).not.toHaveBeenCalled();
        });
    });
});
