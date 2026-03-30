const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const ProductService = require('./products/service');
const productController = require('./products/controllers');
const authRoutes = require('./auth/routes');
const usersRoutes = require('./users/routes');
const productsRoutes = require('./products/routes');

const port = 3000;

const service = new ProductService();
productController.setService(service);

service.create({ name: 'Ноутбук', category: 'Электроника', description: 'Игровой ноутбук', price: 50000, stock: 5 });
service.create({ name: 'Мышь', category: 'Электроника', description: 'Беспроводная мышь', price: 1500, stock: 20 });
service.create({ name: 'Картина', category: 'Декор', description: 'Оригинальная картина маслом', price: 500000, stock: 1 });
service.create({ name: 'Морковь', category: 'Продукты', description: 'Свежая морковь', price: 100, stock: 200 });
service.create({ name: 'Стул', category: 'Мебель', description: 'Деревянный стул', price: 3500, stock: 12 });
service.create({ name: 'Кофеварка', category: 'Бытовая техника', description: 'Капельная кофеварка', price: 8000, stock: 7 });
service.create({ name: 'Книга', category: 'Книги', description: 'Роман в мягкой обложке', price: 700, stock: 50 });
service.create({ name: 'Телефон', category: 'Электроника', description: 'Смартфон среднего класса', price: 25000, stock: 10 });
service.create({ name: 'Футболка', category: 'Одежда', description: 'Хлопковая футболка', price: 1200, stock: 80 });
service.create({ name: 'Наушники', category: 'Аксессуары', description: 'Проводные наушники', price: 2500, stock: 25 });

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Products Auth API',
      version: '1.0.0',
      description: 'API для товаров и пользователей с ролями',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./auth/routes.js', './users/routes.js', './products/routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});