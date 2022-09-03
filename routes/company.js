var express = require('express');
var router = express.Router();
const { changeRefreshToken } = require('../controllers/companyController');

router.post('/changetoken', changeRefreshToken);

module.exports = router;
