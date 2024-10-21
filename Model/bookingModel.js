import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users_data',  // Reference to the User model
    required: true,
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cars',  // Reference to the Car model
    required: true,
  },
  rentalStartDate: {
    type: String,
    required: true,
  },
  rentalEndDate: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
