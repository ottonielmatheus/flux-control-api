const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');

const UsersController = require('../controllers/users.controller');

router.post('/login', UsersController.login);
router.get('/', authorize(), UsersController.load);
router.get('/get/:id', authorize(), UsersController.get);
router.post('/add', authorize('manager', 'admin'), UsersController.add);
router.get('/generate/token', authorize('admin', 'manager'), UsersController.setToken);
router.put('/setPassword', authorize('admin', 'manager'), UsersController.setPassword);
router.patch('/change', authorize('admin', 'manager'), UsersController.change);
router.delete('/remove/:id', authorize('admin', 'manager'), UsersController.remove);

module.exports = router;