const multer = require('multer');

// Configure storage options for multer
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    },
});

module.exports = upload;
