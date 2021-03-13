const express = require('express');
const router = express.Router();
const { isLoggedIn, authorize } = require('../middleware');
const { getAdminPannel } = require('../controllers/adminPannel');
const catchAsync = require('../utils/catchAsync');

router.route('/')
      .get(isLoggedIn, authorize('admin'), catchAsync(getAdminPannel));

module.exports = router;