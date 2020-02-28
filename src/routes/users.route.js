const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');

const UsersController = require('../controllers/users.controller');

router.post('/login', UsersController.login);
router.get('/', authorize(), UsersController.load);
router.get('/get/:id', authorize(), UsersController.get);
router.post('/add', authorize('manager', 'admin'), UsersController.add);
router.post('/request-password', authorize('manager', 'admin'), UsersController.requestPassword);
router.put('/set-password', UsersController.setPassword);
router.patch('/change', authorize('manager', 'admin'), UsersController.change);
router.delete('/remove/:id', authorize('manager', 'admin'), UsersController.remove);

module.exports = router;