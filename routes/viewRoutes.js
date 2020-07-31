const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewsController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get(
  '/tour/:tourName',
  authController.isLoggedIn,
  viewsController.getTourDetail
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get(
  '/my-tours',
  authController.protect,
  authController.isLoggedIn,
  viewsController.getMyTours
);

router.get(
  '/me',
  authController.protect,
  authController.isLoggedIn,
  viewsController.getAccount
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
