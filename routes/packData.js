var express = require('express');
var router = express.Router();
const { getPacks } = require('../controllers/packDataController');  

router.post('/getall', getPacks);

module.exports = router;
