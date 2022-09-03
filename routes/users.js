var express = require('express');
var router = express.Router();
const { registerUser, authUser, getUsersInCompany, getUserById, sendInvite } = require('../controllers/userController');

router.post('/register', registerUser)
router.post('/login', authUser)
router.post('/getall', getUsersInCompany)
router.post('/getone', getUserById)
router.post('/invite', sendInvite)

module.exports = router;
