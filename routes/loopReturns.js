const express = require('express');
const router = express.Router();
const { getReturns, insertReturns, updateReturns } = require('../controllers/returnsController');


router.post('/:id/insert', insertReturns)
router.post('/:id/get', getReturns)
router.post('/:id/update', updateReturns)

module.exports = router;