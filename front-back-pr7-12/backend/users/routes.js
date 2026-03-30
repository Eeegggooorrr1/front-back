const express = require('express');
const controller = require('./controllers');
const { authMiddleware, roleMiddleware } = require('../middleware.js');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 *       403:
 *         description: Доступ запрещен
 */
router.get('/', authMiddleware, roleMiddleware(['admin']), controller.getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:id', authMiddleware, roleMiddleware(['admin']), controller.getById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Обновить информацию пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               blocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 *       400:
 *         description: Ошибка в данных
 *       404:
 *         description: Пользователь не найден
 */
router.put('/:id', authMiddleware, roleMiddleware(['admin']), controller.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Заблокировать пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Пользователь заблокирован
 *       404:
 *         description: Пользователь не найден
 */
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), controller.blockUser);

module.exports = router;