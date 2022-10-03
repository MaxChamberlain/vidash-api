const express = require('express');
const router = express.Router();
const { getTotes, insertTotes } = require('../controllers/toteDataController');

router.post('/:id/insert', insertTotes)
router.get('/:id/insert', async function(req, res){
    res.status(20).send({ message: 'Success' });
})
router.post('/get', getTotes)

module.exports = router;