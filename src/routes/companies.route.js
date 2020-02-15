const express = require('express');
const router = express.Router();
const imageUpload = require('../config/imageConfig').upload;

const CompaniesController = require('../controllers/companies.controller');


router.get('/', CompaniesController.search);
router.get('/:id', CompaniesController.get);
router.post('/add', imageUpload.single('thumbnail'), CompaniesController.add);
router.patch('/change/:id', CompaniesController.change);
router.delete('/remove/:id', CompaniesController.remove);

module.exports = router;