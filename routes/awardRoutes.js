const express = require('express');
const router = express.Router();
const { getAwards, createAward, updateAward, deleteAward } = require('../controllers/awardController');

router.get('/', getAwards);
router.post('/', createAward);
router.put('/:id', updateAward);
router.delete('/:id', deleteAward);

module.exports = router;