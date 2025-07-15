const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');

router.get('/', getAbout);
router.put('/', updateAbout);

module.exports = router;