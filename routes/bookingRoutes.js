const express = require('express');
const viewController = require('../controller/viewsController');
const authController = require('../controller/authController');
const bookingController = require('../controller/bookingController');
const router = express.Router();
router.use(authController.protect);
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
router.use(authController.restrictTo('admin', 'lead-guides'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
