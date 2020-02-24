const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/file-upload').image;

const CompaniesController = require('../controllers/companies.controller');

router.get('/', authorize(), CompaniesController.load);
router.get('/get/:id', authorize(), CompaniesController.get);
router.get('/fleet/:id', authorize(), CompaniesController.fleet);
router.post('/add', authorize('manager', 'admin'), upload.single('thumbnail'), CompaniesController.add);
router.patch('/change/', authorize('manager', 'admin'), CompaniesController.change);
router.delete('/remove/:id', authorize('manager', 'admin'),CompaniesController.remove);

module.exports = router;