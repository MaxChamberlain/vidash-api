var express = require('express');
var router = express.Router();
const { changeRefreshToken, getCompany, changeDHLSetting } = require('../controllers/companyController');

router.post('/changetoken', changeRefreshToken);
router.post('/getone', getCompany);
router.post('/changedhlsetting', changeDHLSetting);

module.exports = router;
