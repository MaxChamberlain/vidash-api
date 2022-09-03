var express = require('express');
var router = express.Router();
const { getPacks, insertPacks } = require('../controllers/packDataController');  

router.post('/getall', getPacks);
router.post('/insert', insertPacks);

module.exports = router;
