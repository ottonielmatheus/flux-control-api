const express = require('express');
const router = express.Router();

const VehiclesController = require('../controllers/vehicles.controller');

router.get('/get/:id', VehiclesController.get);
router.get('/search', VehiclesController.search);
router.post('/add', VehiclesController.add);
router.patch('/change/:id', VehiclesController.change);
router.delete('/remove/:id', VehiclesController.remove);

module.exports = router;