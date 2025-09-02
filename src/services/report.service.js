// services/report.service.js
import PdfPrinter from 'pdfmake';
import path from 'path';
import { fileURLToPath } from 'url';
import { Conversions } from '../models/Conversion.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontsPath = path.join(__dirname, '..', 'fonts');
const fonts = {
    Roboto: {
        normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
        bold: path.join(fontsPath, 'Roboto-Bold.ttf'),
        italics: path.join(fontsPath, 'Roboto-Italic.ttf'),
        bolditalics: path.join(fontsPath, 'Roboto-BoldItalic.ttf'),
    },
};
const toNum = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
};

export class ReportService {
    async find() {

        const printer = new PdfPrinter(fonts);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const conversions = await Conversions.find({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        }).lean();
        const rows = conversions.length
            ? conversions.map(conv => ([
                conv.from ?? '',
                conv.to ?? '',
                String(conv.amount ?? ''),
                toNum(conv.result, 0).toFixed(15),
            ]))
            : [['—', '—', '—', 'Sin registros']];
        const docDefinition = {
            content: [
                { text: 'Reporte Diario de Conversiones', style: 'header' },
                { text: `Fecha: ${new Date().toLocaleDateString()}`, style: 'subheader' },
                { text: ' ', margin: [0, 10] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: [
                            ['De', 'A', 'Cantidad', 'Resultado'],
                            ...rows
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center'
                },
                subheader: {
                    fontSize: 12,
                    italics: true,
                    alignment: 'center'
                }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        const chunks = [];
        const buffer = await new Promise((resolve, reject) => {
            pdfDoc.on('data', c => chunks.push(c));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
        });

        return buffer;
    }
}
