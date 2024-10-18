const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'signup' }, // Assuming a User model exists
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  status: { type: String, default: 'Booked' }, // Other statuses can be 'Cancelled', 'Completed', etc.
  invoiceGenerated: Boolean,
  invoiceUrl: String
});

module.exports = mongoose.model('Booking', bookingSchema);
