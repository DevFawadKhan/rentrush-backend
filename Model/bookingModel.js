import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users_data", required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: "cars", required: true },
  bookingDate: { type: Date, default: Date.now },
  rentalDays: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

export const Booking = mongoose.model("Booking", bookingSchema);
