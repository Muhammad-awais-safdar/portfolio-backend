const express = require('express');
const router = express.Router();
const { getPricings, createPricing, updatePricing, deletePricing } = require('../controllers/pricingController');

router.get('/', getPricings);
router.post('/', createPricing);
router.put('/:id', updatePricing);
router.delete('/:id', deletePricing);

module.exports = router;