const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different types of uploads
const createSubDir = (subDir) => {
    const fullPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
    return fullPath;
};

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subDir = 'general';
        
        // Determine subdirectory based on fieldname or route
        if (file.fieldname === 'signature' || file.fieldname === 'image' || file.fieldname === 'BannerImage') {
            subDir = 'about';
        } else if (file.fieldname === 'largeImage' || req.baseUrl.includes('portfolio')) {
            subDir = 'portfolio';
        } else if (req.baseUrl.includes('testimonials')) {
            subDir = 'testimonials';
        } else if (req.baseUrl.includes('awards')) {
            subDir = 'awards';
        } else if (req.baseUrl.includes('brands')) {
            subDir = 'brands';
        } else if (req.baseUrl.includes('services')) {
            subDir = 'services';
        }
        
        const destPath = createSubDir(subDir);
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, name);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    }
});

// Middleware for single file upload
const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    };
};

// Middleware for multiple file upload
const uploadMultiple = (fieldName, maxCount = 5) => {
    return (req, res, next) => {
        upload.array(fieldName, maxCount)(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    };
};

// Middleware for multiple fields
const uploadFields = (fields) => {
    return (req, res, next) => {
        upload.fields(fields)(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            next();
        });
    };
};

// Utility function to delete file
const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Utility function to get file URL
const getFileUrl = (req, filename, subDir = 'general') => {
    return `${req.protocol}://${req.get('host')}/uploads/${subDir}/${filename}`;
};

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadFields,
    deleteFile,
    getFileUrl
};