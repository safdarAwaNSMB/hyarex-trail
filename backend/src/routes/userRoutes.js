const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/send-verification-Email', userController.sendVerificationEmail);
router.post('/buyer-sign-up', userController.createBuyer);
router.post('/sign-in-user', userController.signInUser);
router.post('/user-existence', userController.userExist);
router.post('/assign-plan', userController.assignPlan);
router.post('/update-user', userController.updateUser);


module.exports = router;


