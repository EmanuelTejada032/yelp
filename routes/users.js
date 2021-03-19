const express = require('express');
const multer = require('multer');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn } = require('../middleware');
const { userPhoto } = require('../cloudinary');
const upload = multer({ storage: userPhoto });

router.route('/register')
    .get(users.renderRegister)
    .post(upload.single('photo'), catchAsync(users.register));
    
router.route('/user/edit')
      .get(isLoggedIn, users.renderEditProfile)

router.route('/user/:id')
      .get(isLoggedIn, users.profile)
      .put(isLoggedIn, upload.single('photo'), catchAsync(users.updateProfile))



router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;