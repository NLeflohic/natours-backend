const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "A review can't be empty"],
    },
    rating: {
      type: Number,
      min: [1, 'A review must have a rating of 1 or above'],
      max: [5, 'A review must have a rating below 5'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to an author'],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nbRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);

  let rating = 0;
  let nbRating = 0;
  if (stats.length > 0) {
    rating = stats[0].avgRatings;
    nbRating = stats[0].nbRatings;
  }
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: rating,
    ratingsQuantity: nbRating,
  });
};

reviewSchema.post('save', function () {
  //this point to current review
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  //find the current review
  this.rev = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  //find the current review with await find doesn't work here because it's a post middleware
  await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
