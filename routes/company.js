var express = require('express');
var router = express.Router();
const { changeRefreshToken, getCompany, changeDHLSetting, changeLoopReturnsSetting } = require('../controllers/companyController');

router.post('/changetoken', changeRefreshToken);
router.post('/getone', getCompany);
router.post('/changedhlsetting', changeDHLSetting);
router.post('/changeloopreturnssetting', changeLoopReturnsSetting);

module.exports = router;
