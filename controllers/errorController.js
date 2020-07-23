const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //if trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //log
    console.log('Error 💥', err);
    //send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong...',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const message = `Duplicate field value: "${err.keyValue.name}". Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, please log in again.', 401);

const handleJWTExpired = () =>
  new AppError('Expired token, please log in again.', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let newErr = { ...err };
    if (err.name === 'CastError') newErr = handleCastErrorDB(newErr);
    if (err.code === 11000) newErr = handleDuplicateFieldDB(err);
    if (err.name === 'ValidationError') newErr = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') newErr = handleJWTError();
    if (err.name === 'TokenExpiredError') newErr = handleJWTExpired();
    sendErrorProd(newErr, res);
  }
};
