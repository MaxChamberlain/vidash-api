var express = require('express');
var router = express.Router();
const { getPicks } = require('../controllers/pickDataController');  

router.post('/getall', getPicks);

module.exports = router;
