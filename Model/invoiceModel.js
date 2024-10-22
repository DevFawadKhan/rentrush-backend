// Model/invoiceModel.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users_data", required: true },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "cars", required: true },
  rentalStartDate: { type: Date, required: true },
  rentalEndDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  invoiceDate: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending"],
    default: "Pending",
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
