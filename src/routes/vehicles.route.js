const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize')

const VehiclesController = require('../controllers/vehicles.controller');

router.get('/get/:id', authorize(), VehiclesController.get);
router.get('/', authorize(), VehiclesController.search);
router.get('/garage', authorize(), VehiclesController.garage);
router.get('/arrival/:id', authorize(), VehiclesController.arrival);
router.put('/departure/:id', authorize(), VehiclesController.departure);
router.post('/add', authorize('manager', 'admin'), VehiclesController.add);
router.patch('/change', authorize('manager', 'admin'), VehiclesController.change);
router.delete('/remove/:id', authorize('manager', 'admin'), VehiclesController.remove);

module.exports = router;