const express = require('express');
const router = express.Router();
const authorize = require('../../middlewares/authorize');

const VehiclesController = require('./vehicles.controller');

router.get('/get/:id', authorize(), VehiclesController.get);
router.get('/search', authorize(), VehiclesController.search);
router.get('/', authorize(), VehiclesController.load);
router.get('/garage', authorize(), VehiclesController.garage);
router.post('/arrival/:id', authorize(), VehiclesController.arrival);
router.put('/departure/:id', authorize(), VehiclesController.departure);
router.post('/add', authorize('manager', 'admin'), VehiclesController.add);
router.patch('/change', authorize('manager', 'admin'), VehiclesController.change);
router.delete('/remove/:id', authorize('manager', 'admin'), VehiclesController.remove);

module.exports = router;