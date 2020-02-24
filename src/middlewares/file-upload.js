const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, `${new Date().toISOString()}_${file.originalname}`);
    }
});

const imageFilter = (req, file, callback) => {
    callback(null, ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype));
};

const image = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: imageFilter
});

module.exports = {
    image: image
};