const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

//MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
//serving local file
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  //console.log(req.headers);
  next();
});

//ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRoutes);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'Fail';
  // err.statusCode = 404;
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error handler
app.use(globalErrorHandler);

module.exports = app;
