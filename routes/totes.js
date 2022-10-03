const express = require('express');
const router = express.Router();
const { getTotes, insertTotes } = require('../controllers/toteDataController');

router.post('/:id/insert', insertTotes)
router.post('/get', getTotes)

module.exports = router;