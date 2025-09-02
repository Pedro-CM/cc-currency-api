API de Conversión de Moneda
Descripción del Proyecto
Esta es una API robusta y escalable construida con FeathersJS, diseñada para la conversión de divisas. La API utiliza un sistema de colas de mensajes (RabbitMQ) para el procesamiento asíncrono de registros, y una base de datos MongoDB para almacenar las conversiones realizadas.

Prerrequisitos
Asegúrate de tener instalado lo siguiente en tu sistema:

Node.js (versión 18 o superior)

npm (incluido con Node.js)

Docker y Docker Compose (para ejecutar RabbitMQ )

Instalación
Clona este repositorio:

git clone [URL-DEL-REPOSITORIO]

Navega al directorio del proyecto e instala las dependencias:

cd cc-currency-api
npm install

Crea un archivo .env en la raíz del proyecto y configura tus variables de entorno con las siguientes claves:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/currency
RABBIT_URL=amqp://localhost
RABBIT_QUEUE=conversions
OXR_APP_ID=
COINGECKO_API_KEY=

Para RabbitMQ, las credenciales de inicio de sesión predeterminadas son guest para el usuario y guest para la contraseña.

Ejecución del Proyecto
Modo Desarrollo
Para iniciar la aplicación en modo desarrollo (con reinicio automático al guardar los cambios):

npm run dev

Modo Producción
Para iniciar la aplicación en modo de producción:

npm start

Ejecutar RabbitMQ
El proyecto utiliza Docker Compose para gestionar el servicio de RabbitMQ.

Para iniciar RabbitMQ en segundo plano:

npm run start-rabbitmq

Para detener RabbitMQ:

npm run stop-rabbitmq

Ejecución de las Pruebas
El proyecto utiliza Jest para las pruebas unitarias y Supertest para las pruebas de integración.

Ejecuta todas las pruebas con el siguiente comando:

npm test

Endpoints de la API
La API principal está en /convert.

Método

Endpoint

Descripción

POST

/convert

Realiza una conversión de moneda y registra la transacción.

GET

/rates

Obtiene las tasas de conversión actuales (FIAT + Cripto).

GET

/report

Genera y devuelve un informe detallado de las conversiones diarias.

Ejemplo de solicitud
POST /convert

{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}

Tecnologías Utilizadas
FeathersJS: Framework para construir APIs REST y en tiempo real.

Node.js: Entorno de ejecución de JavaScript.

Mongoose: Librería para modelar objetos de MongoDB.

Joi: Para la validación de esquemas de datos.

Jest: Framework de pruebas para JavaScript.

RabbitMQ: Sistema de colas de mensajes para el procesamiento asíncrono.

Docker: Para la gestión de contenedores de RabbitMQ.
