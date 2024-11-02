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
      type: Date,
      required: true,
    },
    rentalEndDate: {
      type: Date,
      required: true,
    },
    rentalEndTime: {
      type: Date,
      required: true,
    },
    // rentalDurationHours: {
    //   type: Number,
    //   required: true, // Make this required if you want to enforce it
    // },
    // totalAmount: {
    //   type: Number,
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
