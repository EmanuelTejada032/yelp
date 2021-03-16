const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    campground: {
        type: Schema.ObjectId,
        ref: 'Campground',
        required: true
      }
});


// Prevent user from submitting more than one review per campground
reviewSchema.index({ campground: 1, author: 1 }, { unique: true });


// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function(campground) {
    const obj = await this.aggregate([
      {
        $match: { campground }
      },
      {
        $group: {
          _id: '$campground',
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
    try {
      if (obj[0]) {
        await this.model('Campground').findByIdAndUpdate(campground, {
          averageRating: obj[0].averageRating
         
        });
         } else {
           await this.model("Campground").findByIdAndUpdate(campground, {
             averageRating: undefined,
           });
         }
       } catch (err) {
         console.error(err);
       }
   
  };
  
  // Call getAverageRating after save
  reviewSchema.post('save', async function() {
    await this.constructor.getAverageRating(this.campground);
  });
  
  // Call getAverageRating before remove
  reviewSchema.post('remove', async function() {
    await this.constructor.getAverageRating(this.campground);
  });

module.exports = mongoose.model("Review", reviewSchema);

