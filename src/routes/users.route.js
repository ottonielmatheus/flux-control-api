const express = require('express');
const router = express.Router();
const imageUpload = require('../config/imageConfig').upload;

const UsersController = require('../controllers/users.controller');

router.get('/', UsersController.search);
router.get('get/:id', UsersController.get);
router.post('/add', imageUpload.single('thumbnail'), UsersController.add);
router.get('/generate/token', UsersController.setToken);
router.put('/setPassword', UsersController.setPassword);
router.patch('/change', UsersController.change);
router.delete('/remove/:id', UsersController.remove);

module.exports = router;