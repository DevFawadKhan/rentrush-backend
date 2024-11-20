import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users_data",
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars",
      required: true,
    },
    rentalStartDate: {
      type: Date,
      required: true,
    },
    rentalStartTime: {
      type: String,
      required: true,
    },
    rentalEndDate: {
      type: Date,
      required: true,
    },
    rentalEndTime: {
      type: String,
      required: true,
    },
    totalPrice: {
      // New field for total price
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
