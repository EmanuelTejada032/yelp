const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.campground = req.params.id;

    campground.reviews.push(review);
    try{
        await review.save();
    }catch(e){
        req.flash('error', 'Can\'t create new review');
        return res.redirect(`/campgrounds/${campground._id}`);
    }

    await campground.save();

    

    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findById(reviewId);
    
    await review.remove()
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}

