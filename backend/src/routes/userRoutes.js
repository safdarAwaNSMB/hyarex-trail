const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/send-verification-Email', userController.sendVerificationEmail);
router.post('/send-reset-Email', userController.sendVerificationEmail);
router.post('/buyer-sign-up', userController.createBuyer);
router.post('/create-user', userController.createUser);
router.post('/sign-in-user', userController.signInUser);
router.post('/user-existence', userController.userExist);
router.post('/assign-plan', userController.assignPlan);
router.post('/update-user', userController.updateUser);
router.post('/reset-password', userController.resetPassword);
router.post('/delete-user', userController.deleteUser);
router.post('/edit-user', userController.editUser);
router.get('/get-all-users', userController.getAllUsers);
router.get('/get-all-admins', userController.getAllAdmins);


module.exports = router;


