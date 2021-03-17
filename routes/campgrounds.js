const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground, authorize } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, authorize('publisher', 'admin') , upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.get('/favorites', isLoggedIn, authorize('user'), catchAsync(campgrounds.getFavorites));

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,authorize('publisher'), isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,authorize('publisher', 'admin'),  isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.get('/:id/favorites', isLoggedIn, authorize('user'), catchAsync(campgrounds.addFavorite));



module.exports = router;