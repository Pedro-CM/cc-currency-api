# 💱 API de Conversión de Moneda

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)  
![FeathersJS](https://img.shields.io/badge/FeathersJS-v5-blue?logo=feathersjs)  
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)  
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Message--Queue-orange?logo=rabbitmq)  
![Jest](https://img.shields.io/badge/Tests-Jest-red?logo=jest)

---

## 📖 Descripción del Proyecto

Esta es una **API robusta y escalable** construida con **FeathersJS**, diseñada para la **conversión de divisas**.  

La API utiliza:  
- 🐇 **RabbitMQ** para el procesamiento asíncrono de registros  
- 🍃 **MongoDB** para almacenar las conversiones realizadas  
- ✅ **Joi** para validación de datos  
- 🧪 **Jest + Supertest** para pruebas unitarias e integración  


## 🛠️ Prerrequisitos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) **v18 o superior**  
- [npm](https://www.npmjs.com/) (incluido con Node.js)  
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)  

---

## ⚙️ Instalación

Clona este repositorio:

```
git clone https://github.com/Pedro-CM/cc-currency-api.git
cd cc-currency-api
npm install
```
Crea un archivo .env en la raíz del proyecto:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/currency
RABBIT_URL=amqp://localhost
RABBIT_QUEUE=conversions
OXR_APP_ID=<REEMPLAZA_CON_TU_API_KEY>
COINGECKO_API_KEY=<REEMPLAZA_CON_TU_API_KEY>

```
## ⚠️ Necesitas registrar una cuenta gratuita en OpenExchangeRates y CoinGecko
 para obtener tus API keys y colocarlas en el archivo .env.
 ## 🐇 RabbitMQ con Docker
```
El proyecto incluye scripts para manejar RabbitMQ con **Docker Compose**.
```
Iniciar RabbitMQ:
```
npm run start-rabbitmq
```
Detener RabbitMQ:
```
npm run stop-rabbitmq
```
🔑 RabbitMQ: credenciales por defecto → usuario: guest | contraseña: guest

Accede al panel de RabbitMQ en:
👉 http://localhost:15672
```
Usuario: guest | Contraseña: guest
```
## ▶️ Ejecución del Proyecto

### 🔧 Modo Desarrollo
```
npm run dev
```
## 🏭 Modo Producción
```
npm start
```
## 🧰 Tecnologías Utilizadas

- ⚡ **FeathersJS** – Framework para construir APIs REST y en tiempo real  
- 🟢 **Node.js** – Entorno de ejecución de JavaScript  
- 🍃 **Mongoose** – ODM para MongoDB  
- ✅ **Joi** – Validación de datos  
- 🧪 **Jest + Supertest** – Frameworks de pruebas  
- 🐇 **RabbitMQ** – Sistema de colas de mensajes  
- 🐳 **Docker** – Gestión de contenedores  

---
##  Ejecución de las Pruebas
El proyecto utiliza Jest para las pruebas unitarias y Supertest para las pruebas de integración.

Ejecuta todas las pruebas con el siguiente comando:
```
npm test
```
## Endpoints de la API
```
POST /convert
Realiza una conversión de moneda y registra la transacción.
{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}
GET /rates
Obtiene las tasas de conversión actuales (FIAT + Cripto).
  {
            "_id": "68b639c7743ecdcc1e97d769",
            "symbol": "AAVE",
            "base": "USD",
            "__v": 0,
            "createdAt": "2025-09-02T00:26:47.478Z",
            "updatedAt": "2025-09-02T19:26:43.365Z",
            "value": 0.003209860692045965
        },
        {
            "_id": "68b639c7743ecdcc1e97d74c",
            "base": "USD",
            "symbol": "ADA",
            "__v": 0,
            "createdAt": "2025-09-02T00:26:47.478Z",
            "updatedAt": "2025-09-02T19:26:43.365Z",
            "value": 1.221818750519273
        },
GET /report
Genera y devuelve un informe detallado de las conversiones diarias.
```


