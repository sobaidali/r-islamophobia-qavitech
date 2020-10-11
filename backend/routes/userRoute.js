const bcrypt = require('bcrypt');
const express = require('express');

const user_controller = require('../controllers/userController');

const router = new express.Router();
const validateToken=require('../verification/tokenVerify')

// Sign up a user
router.post('/signup', user_controller.users_sign_up);

// Log in a user
router.post('/login', user_controller.users_login);
router.get('/me',validateToken,user_controller.users_get_contact)
router.post('/edit',validateToken,user_controller.users_edit_contact)
router.post('/upload',user_controller.users_image_upload)
router.post('/donate',validateToken,user_controller.users_donate)
router.post('/forgotpassword', user_controller.forgot_password)
router.post('/resetpassword/:token', user_controller.reset_password)
router.post('/donateasnonuser', user_controller.users_donate_not_user)

// Report an incident
// router.post('/incident',validateToken ,user_controller.users_add_incident)

module.exports = router;
