const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

//router.param('id', tourController.checkID);

router
  .route('/top-3-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.monthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);
//tours-within?distance=233&center=-40,45&uit=mi
//tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/units/:unit').get(tourController.getDistances);

router
  .route('/')
  //protect the route with middleware for the example
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

//POST /tour/324j43/reviews
//GET /tour/324j43/reviews
//GET /tour/324j43/reviews/33jl4

//nested route
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );
router.use('/:tourId/reviews', reviewRouter);

module.exports = router;
