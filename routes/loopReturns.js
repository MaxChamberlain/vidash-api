const express = require('express');
const router = express.Router();
const { getReturns, insertReturns } = require('../controllers/returnsController');


router.post('/:id/insert', insertReturns)
router.post('/:id/get', getReturns)

module.exports = router;