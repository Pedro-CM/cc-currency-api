import amqp from 'amqplib';

let channel;

async function connectRabbitMQ() {
    try {
        const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
        channel = await conn.createChannel();
        console.log('Conectado a RabbitMQ');
    } catch (error) {
        console.error('Error al conectar a RabbitMQ:', error);
    }
}

async function sendToQueue(queueName, message) {
    if (!channel) {
        await connectRabbitMQ();
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Mensaje enviado a la cola ${queueName}`);
}

export { connectRabbitMQ, sendToQueue };