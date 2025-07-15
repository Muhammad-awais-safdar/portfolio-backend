const express = require('express');
const router = express.Router();
const { getFunFacts, createFunFact, updateFunFact, deleteFunFact } = require('../controllers/funFactController');

router.get('/', getFunFacts);
router.post('/', createFunFact);
router.put('/:id', updateFunFact);
router.delete('/:id', deleteFunFact);

module.exports = router;