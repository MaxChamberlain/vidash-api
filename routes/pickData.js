var express = require('express');
var router = express.Router();
const { getPicks, insertPicks } = require('../controllers/pickDataController');  

router.post('/getall', getPicks);
router.post('/insert', insertPicks);

module.exports = router;
