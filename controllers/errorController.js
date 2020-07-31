const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //if trusted error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //log
    console.log('Error 💥', err);
    //send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong...',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  //log
  console.log('Error 💥', err);
  //send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
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
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let newErr = { ...err };
    newErr.message = err.message;
    if (err.name === 'CastError') newErr = handleCastErrorDB(newErr);
    if (err.code === 11000) newErr = handleDuplicateFieldDB(err);
    if (err.name === 'ValidationError') newErr = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') newErr = handleJWTError();
    if (err.name === 'TokenExpiredError') newErr = handleJWTExpired();
    sendErrorProd(newErr, req, res);
  }
};
