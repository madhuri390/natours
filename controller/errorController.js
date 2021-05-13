// eslint-disable-next-line prettier/prettier
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};
const handleJsonWebToken = () =>
  new AppError('Invalid token.Please Login again', 401);
const handleExpiredToken = () =>
  new AppError('Token Expired.Please login again!!', 401);
const handleduplicateErrorDB = (err) => {
  const value = err.keyValue.name;
  console.log(value);
  const message = `Duplicate field ${value}.Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  console.log('8888888888');
  console.log(err);
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join(' . ')}.`;
  return new AppError(message, 400);
};
const sendErrordev = (res, req, err) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //Rendered website
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};
const sendErrorpro = (res, req, err) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //production errors or unknown error
    } else {
      //Log error
      console.log('ERROR :(');
      //Generic message
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    }
  }
  //Rendered Website
  //console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  } else {
    //production errors or unknown error
    //Log error
    console.log('ERROR :(');
    //Generic message
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: 'Please try again later',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrordev(res, req, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    console.log(error._message);
    if (error.code === 11000) error = handleduplicateErrorDB(error);
    console.log(error.name === 'ValidationError');
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebToken();
    if (error.name === 'TokenExpiredError') error = handleExpiredToken();
    sendErrorpro(res, req, error);
  }
};
