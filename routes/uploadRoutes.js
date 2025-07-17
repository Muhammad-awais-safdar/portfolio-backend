const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, uploadFields, getFileUrl } = require('../middleware/upload');

// Upload single image
router.post('/single', uploadSingle('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileUrl = getFileUrl(req, req.file.filename, req.file.destination.split('/').pop());
        
        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
                url: fileUrl,
                path: req.file.path
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during file upload',
            error: error.message
        });
    }
});

// Upload multiple images
router.post('/multiple', uploadMultiple('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map(file => {
            const fileUrl = getFileUrl(req, file.filename, file.destination.split('/').pop());
            return {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                url: fileUrl,
                path: file.path
            };
        });

        res.json({
            success: true,
            message: 'Files uploaded successfully',
            data: uploadedFiles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during file upload',
            error: error.message
        });
    }
});

// Upload portfolio images (thumbnail + large image)
router.post('/portfolio', uploadFields([
    { name: 'image', maxCount: 1 },
    { name: 'largeImage', maxCount: 1 }
]), (req, res) => {
    try {
        if (!req.files || (!req.files.image && !req.files.largeImage)) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const result = {};

        if (req.files.image) {
            const file = req.files.image[0];
            result.image = {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                url: getFileUrl(req, file.filename, 'portfolio'),
                path: file.path
            };
        }

        if (req.files.largeImage) {
            const file = req.files.largeImage[0];
            result.largeImage = {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
                url: getFileUrl(req, file.filename, 'portfolio'),
                path: file.path
            };
        }

        res.json({
            success: true,
            message: 'Portfolio images uploaded successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during file upload',
            error: error.message
        });
    }
});

// Upload about images (profile, signature, banner)
router.post('/about', uploadFields([
    { name: 'image', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'BannerImage', maxCount: 1 }
]), (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const result = {};

        // Process each type of image
        ['image', 'signature', 'BannerImage'].forEach(fieldName => {
            if (req.files[fieldName]) {
                const file = req.files[fieldName][0];
                result[fieldName] = {
                    filename: file.filename,
                    originalName: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype,
                    url: getFileUrl(req, file.filename, 'about'),
                    path: file.path
                };
            }
        });

        res.json({
            success: true,
            message: 'About images uploaded successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during file upload',
            error: error.message
        });
    }
});

module.exports = router;