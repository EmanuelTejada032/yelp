const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
   
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id) && req.user.role !== 'admin') {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//Allow access to routes to an specific roles
exports.authorize = (...roles) => {
    return (req, res ,next) => {
        if(req.originalUrl.includes('/reviews') && !roles.includes(req.user.role)){
            const url = req.originalUrl.split('/').slice(0,3).join('/')
            req.flash('error', 'Only users are allowed to leave or modify reviews');
            return res.redirect(`${url}`);
        }

        if(req.originalUrl.includes('/campgrounds') && req.method === 'POST' && !roles.includes(req.user.role)){
            req.flash('error', 'Only publisher or admin are allowed to publish a campground');
            return res.redirect(`/campgrounds/new`);
        }

        if(!roles.includes(req.user.role)){
            req.flash('error', 'not authorized to do that action');
            return res.redirect(`/campgrounds`);
        }

        next();
    }
}