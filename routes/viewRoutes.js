const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get(
  '/tour/:tourName',
  authController.isLoggedIn,
  viewsController.getTourDetail
);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get(
  '/me',
  authController.protect,
  viewsController.getAccount,
  authController.isLoggedIn
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
