var express = require('express');
var router = express.Router();
const { registerUser, authUser, getUsersInCompany, getUserById, sendInvite, updateUser, deleteUser, requestChangePassword, resetPassword } = require('../controllers/userController');

router.post('/register', registerUser)
router.post('/login', authUser)
router.post('/getall', getUsersInCompany)
router.post('/getone', getUserById)
router.post('/invite', sendInvite)
router.post('/update', updateUser)
router.post('/delete', deleteUser)
router.post('/requestpasswordchange', requestChangePassword)
router.post('/resetpassword', resetPassword)

module.exports = router;
