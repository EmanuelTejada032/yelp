const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Prevent user from submitting more than one review per bootcamp
reviewSchema.index({ campground: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);

