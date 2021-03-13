const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor, authorize } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, authorize('user'), validateReview, catchAsync(reviews.createReview))
router.delete('/:reviewId', isLoggedIn, authorize('user', 'admin'), isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;