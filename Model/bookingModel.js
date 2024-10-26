import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users_data", // Reference to the User model
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars", // Reference to the Car model
      required: true,
    },
    rentalStartDate: {
      type: Date,
      required: true,
    },
    rentalEndDate: {
      type: Date,
      required: true,
    },

    // rentalStartTime: {
    //   type: Date,
    //   required: true,
    // },

    // rentalEndTime: {
    //   type: Date,
    //   required: true,
    // },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  // { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
