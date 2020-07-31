const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const swapToLocalhost = require('../utils/swapToLocalHost');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const { checkout } = require('../app');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  //get current booked tour
  const tour = await Tour.findById(req.params.tourID);
  if (!tour) return next(new AppError('The tour cannot be found', 404));
  // create checkout session
  const urlLocal = swapToLocalhost(req.get('host'));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${urlLocal}/?tour=${req.params.tourID}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${urlLocal}/my-tours`,
    cancel_url: `${req.protocol}://${urlLocal}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: [`${req.protocol}://${urlLocal}/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  //create session response
  res.status(200).json({
    result: 'Success',
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   //TEMPORARY because unsecure
//   const { tour, user, price } = req.query;

//   if (!tour || !user || !price) return next();
//   await Booking.create({ tour, user, price });
//   const url = swapToLocalhost(req.originalUrl);
//   res.redirect(url.split('?')[0]);
// });

const createBookingCheckout = async (session) => {
  console.log(session);
  const tour = session.client_reference_id;
  const user = await User.findOne({ email: session.customer_email });
  const price = session.display_items[0].amount / 100;
  await Booking.create({ tour, user, price });
};

exports.webHookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  console.log(event.type);
  if (event.type === 'checkout.session.completed')
    await createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking, { path: 'user tour' });
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
