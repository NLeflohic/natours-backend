const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const reviewRoutes = require('./routes/reviewRoutes');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();

//GLOBALS MIDDLEWARES
//Set security HTTP Headers
app.use('/api', helmet());

//morgan logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request from same ip
const limiter = rateLimit({
  max: 100,
  windowMilliseconds: 60 * 60 * 1000, //100 requests for 1 hour
  message: 'Too many requests from the IP, please try again un an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'name', 'price'],
  })
);

//serving local file
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  //console.log(req.headers);
  next();
});

//ROUTES
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error handler
app.use(globalErrorHandler);

module.exports = app;
