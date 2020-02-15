const express = require('express');
const router = express.Router();
const multer = require('multer');

const CompaniesController = require('../controllers/companies.controller');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'temp/uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, `${new Date().toISOString()}_${file.originalname}`);
    }
});

const imageFilter = (req, file, callback) => {
    callback(null, ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype));
};

const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: imageFilter
});

router.get('/get/:id', CompaniesController.get);
router.get('/search', CompaniesController.search);
router.post('/add', upload.single('thumbnail'), CompaniesController.add);
router.patch('/change/:id', CompaniesController.change);
router.delete('/remove/:id', CompaniesController.remove);

module.exports = router;