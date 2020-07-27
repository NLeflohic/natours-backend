const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //get tour data from collection
  const tours = await Tour.find();

  //build the template

  //render the template using the tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTourDetail = catchAsync(async (req, res, next) => {
  //get the tour detail info
  const tour = await Tour.findOne({ slug: req.params.tourName }).populate({
    path: 'reviews',
    fields: 'review, rating, user',
  });
  // Build the template

  //render te,plate using tour detail
  if (!tour) {
    next(new AppError('Tour detail cannot be found', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});
