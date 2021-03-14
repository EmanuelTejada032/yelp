const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campground: {
        type: Schema.Types.ObjectId,
        ref: 'Campground',
        required: true
      }
});


// Prevent user from submitting more than one review per campground
reviewSchema.index({ campground: 1, author: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);

