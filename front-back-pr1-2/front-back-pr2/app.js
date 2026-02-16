const express = require('express');
const ProductService = require('./products/service');
const controller = require('./products/controllers');
const routes = require('./products/routes');

const port = 3000;

const service = new ProductService();
controller.setService(service);

service.create({ name: 'Ноутбук', price: 50000 });
service.create({ name: 'Мышь', price: 1500 });
service.create({ name: 'Картина', price: 500000 });
service.create({ name: 'Морковь', price: 100 });

const app = express();
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
});