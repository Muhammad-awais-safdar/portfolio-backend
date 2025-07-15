const express = require('express');
const router = express.Router();
const { getEducations, createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');

router.get('/', getEducations);
router.post('/', createEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

module.exports = router;