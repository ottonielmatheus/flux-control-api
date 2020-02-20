const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const imageUpload = require('../middlewares/imageConfig');

const CompaniesController = require('../controllers/companies.controller');

router.get('/get/', authorize(), CompaniesController.search);
router.get('/:id', authorize(), CompaniesController.get);
router.post('/add', authorize('manager', 'admin'), imageUpload.single('thumbnail'), CompaniesController.add);
router.patch('/change/', authorize('manager', 'admin'), CompaniesController.change);
router.delete('/remove/:id', authorize('manager', 'admin'),CompaniesController.remove);

module.exports = router;