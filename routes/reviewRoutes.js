const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

//POST /tour/324j43/reviews
//POST /reviews
//GET /tour/324j43/reviews

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );
router.route('/:id').get(reviewController.getReview);

module.exports = router;
