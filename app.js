const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const viewRouter = require('./routes/viewsRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const reviewRouter = require('./routes/reviewRoutes');
//starting express
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//Global Middle wares
app.use(express.static(path.join(__dirname, 'public')));
//1)Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
//2)Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//3)Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many message from this IP,please try after 1hr',
});
app.use('/api', limiter);

//4)Body parser,reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization against xss
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ],
  })
);

//5)Serving static files
//app.use(express.static(`${__dirname}/public`));

//6)Test middlewares
app.use((req, res, next) => {
  console.log('Hello from Middleware 👋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});
// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Get request',
//   });
// });

app.post('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Post request',
  });
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find the ${req.originalUrl} on this server`, 400));
});
app.use(globalErrorHandler);
module.exports = app;
