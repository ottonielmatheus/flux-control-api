const express = require('express');
const router = express.Router();

const CompaniesController = require('../controllers/companies.controller');

router.get('/get/:id', CompaniesController.get);
router.get('/search', CompaniesController.search);
router.post('/add', CompaniesController.add);
router.patch('/change/:id', CompaniesController.change);
router.delete('/remove/:id', CompaniesController.remove);

module.exports = router;