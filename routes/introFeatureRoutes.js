const express = require('express');
const router = express.Router();
const { getIntroFeatures, createIntroFeature, updateIntroFeature, deleteIntroFeature } = require('../controllers/introFeatureController');

router.get('/', getIntroFeatures);
router.post('/', createIntroFeature);
router.put('/:id', updateIntroFeature);
router.delete('/:id', deleteIntroFeature);

module.exports = router;