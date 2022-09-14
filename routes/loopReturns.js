const express = require('express');
const router = express.Router();
const { getReturns, insertReturns } = require('../controllers/returnsController');


router.post('/insert', insertReturns)
router.post('/get', getReturns)

module.exports = router;