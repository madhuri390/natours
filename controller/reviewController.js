const handleFactory = require('./handlerFactory');
//const catchAsync = require('../utils/catchAsync');
const Review = require('../model/reviewModel');

exports.setTourUserIds = (req, res, next) => {
  //Allowing nested queries
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getAllReviews = handleFactory.getAll(Review);
exports.getReview = handleFactory.getOne(Review);
exports.createReview = handleFactory.createOne(Review);
exports.updateReview = handleFactory.updateOne(Review);
exports.deleteReview = handleFactory.deleteOne(Review);
