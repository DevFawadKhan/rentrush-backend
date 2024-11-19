import moment from "moment";
import Booking from "../Model/bookingModel.js";
import Car from "../Model/Car.js";
import { createInvoice } from "./invoiceController.js";

export const bookCar = async (req, res) => {
  const {
    carId,
    rentalStartDate,
    rentalStartTime,
    rentalEndDate,
    rentalEndTime,
  } = req.body;

  const userId = req.user;
  console.log("User ID in Bookings Car:", userId);

  try {
    const car = await Car.findById(carId);
    if (!car || car.availability !== "Available") {
      return res
        .status(400)
        .json({ message: "Car is not available for booking." });
    }

    const rentalStartDateTime = new Date(rentalStartDate);
    const rentalEndDateTime = new Date(rentalEndDate);

    const [startHours, startMinutes] = rentalStartTime.split(":").map(Number);
    const [endHours, endMinutes] = rentalEndTime.split(":").map(Number);

    rentalStartDateTime.setHours(startHours, startMinutes, 0);
    rentalEndDateTime.setHours(endHours, endMinutes, 0);

    const rentalDuration =
      (rentalEndDateTime - rentalStartDateTime) / (1000 * 60 * 60 * 24);
    const daysRented = Math.max(0, Math.ceil(rentalDuration));
    const totalPrice = daysRented * car.rentRate;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (rentalStartDateTime < now) {
      return res
        .status(400)
        .json({
          message: "Rental start date must be in the present or future.",
        });
    }

    if (rentalEndDateTime < now) {
      return res
        .status(400)
        .json({ message: "Rental end date must be in the present or future." });
    }

    if (rentalEndDateTime <= rentalStartDateTime) {
      return res
        .status(400)
        .json({ message: "End date must be after the start date." });
    }

    const newBooking = new Booking({
      carId,
      userId,
      rentalStartDate: rentalStartDateTime,
      rentalStartTime,
      rentalEndDate: rentalEndDateTime,
      rentalEndTime,
      totalPrice,
    });

    await newBooking.save();

    const invoicePath = await createInvoice({
      _id: newBooking._id,
      carId,
      userId,
      rentalStartDate: rentalStartDateTime,
      rentalEndDate: rentalEndDateTime,
      rentalStartTime,
      rentalEndTime,
      totalPrice,
    });

    car.availability = "Rented Out";
    await car.save();

    const invoiceUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/bookcar/invoices/invoice_${newBooking._id}.pdf`;

    res.status(201).json({
      message: "Car booked successfully",
      booking: newBooking,
      invoiceUrl,
    });
  } catch (error) {
    console.error("Error booking car:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user;
    const userRole = req.role;  // Log the role of the user
    console.log("User ID:", userId);
    console.log("User Role:", userRole);

    const bookings = await Booking.find({ userId: userId });
    console.log("Booking found", bookings);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No active bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { rentalStartDate, rentalEndDate, rentalStartTime, rentalEndTime } =
    req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (rentalStartDate) booking.rentalStartDate = rentalStartDate;
    if (rentalEndDate) booking.rentalEndDate = rentalEndDate;
    if (rentalStartTime) booking.rentalStartTime = rentalStartTime;
    if (rentalEndTime) booking.rentalEndTime = rentalEndTime;

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(400).json({ message: "Error updating booking", error });
  }
};

export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user;

  try {
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized access." });
    }

    // const secondsUntilStart = moment(booking.rentalStartDate).diff(
    //   moment(),
    //   "seconds"
    // );
    // if (secondsUntilStart < ) {
    //   return res.status(400).json({
    //     message:
    //       "Cancellation not allowed within 5 seconds of the rental start date.",
    //   });
    // }

    const minutesUntilStart = moment(booking.rentalStartDate).diff(
      moment(),
      "minutes"
    );
    if (minutesUntilStart < 5) {
      return res.status(400).json({
        message:
          "Cancellation not allowed within 1 minute of the rental start date.",
      });
    }

    // const hoursUntilStart = moment(booking.rentalStartDate).diff(
    //   moment(),
    //   "hours"
    // );
    // if (hoursUntilStart < 24) {
    //   return res.status(400).json({
    //     message:
    //       "Cancellation not allowed within 24 hours of rental start date.",
    //   });
    // }

    const car = await Car.findById(booking.carId);
    if (car) {
      car.availability = "Available";
      await car.save();
    }

    await Booking.findByIdAndDelete(bookingId);

    return res.status(200).json({ message: "Booking canceled successfully." });
  } catch (error) {
    console.error("Error canceling booking:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
