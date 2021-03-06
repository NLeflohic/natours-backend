const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'Success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.getReviews = factory.getAll(Review);
// exports.getReviews = catchAsync(async (req, res, next) => {
//   let filter;
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'Success',
//     results: reviews.length,
//     data: reviews,
//   });
// });

exports.getReview = factory.getOne(Review);
// exports.getReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) {
//     return next(AppError('This review cannot be found', 404));
//   }
//   res.status(200).json({
//     status: 'Success',
//     data: {
//       review,
//     },
//   });
// });

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
