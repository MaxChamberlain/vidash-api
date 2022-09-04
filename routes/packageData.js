var express = require('express');
var router = express.Router();
const { getPackages } = require('../controllers/packageDataController');

router.post('/getall', getPackages);

module.exports = router;
