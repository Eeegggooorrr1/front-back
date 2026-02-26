const express = require('express');
const router = express.Router();
const controller = require('./controllers');

router.get('/products', controller.getAll);
router.get('/products/:id', controller.getById);
router.post('/products', controller.create);
router.put('/products/:id', controller.update);
router.delete('/products/:id', controller.remove);

module.exports = router;