const mongooose = require('mongoose');

const bookingSchema = new mongooose.Schema({
  tour: {
    type: mongooose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must have a tour'],
  },
  user: {
    type: mongooose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a user'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});
const Booking = mongooose.model('Booking', bookingSchema);

module.exports = Booking;
