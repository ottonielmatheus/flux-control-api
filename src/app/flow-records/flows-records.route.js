const express = require('express');
const router = express.Router();
const authorize = require('../../middlewares/authorize');

const FlowRecordsController = require('./flow-records.controller');

router.get('/get/:id', authorize(), FlowRecordsController.get);
router.get('/', authorize(), FlowRecordsController.load);
router.delete('/remove/:id', authorize('manager', 'admin'), FlowRecordsController.remove);

module.exports = router;