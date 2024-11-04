import moment from "moment";
import Booking from "../Model/bookingModel.js";
import Car from "../Model/Car.js";
import { createInvoice } from './invoiceController.js';


export const bookCar = async (req, res) => {
  const { carId, rentalStartDate, rentalStartTime, rentalEndDate, rentalEndTime } = req.body; // Accept start and end dates and times from the user
  const userId = req.user;

  try {
    const car = await Car.findById(carId);
    if (!car || car.availability !== "Available") {
      return res.status(400).json({ message: "Car is not available for booking." });
    }

    // Create Date objects for rental start and end dates
    const rentalStartDateTime = new Date(rentalStartDate);
    const rentalEndDateTime = new Date(rentalEndDate);

    // Set the hours and minutes for the start and end times
    const [startHours, startMinutes] = rentalStartTime.split(':').map(Number);
    const [endHours, endMinutes] = rentalEndTime.split(':').map(Number);

    // Set the time for the rental start and end dates
    rentalStartDateTime.setHours(startHours, startMinutes, 0); // Set hours and minutes for start
    rentalEndDateTime.setHours(endHours, endMinutes, 0); // Set hours and minutes for end

    // Check if the rental start date is in the past
    const now = new Date();
    if (rentalStartDateTime < now) {
      return res.status(400).json({ message: "Rental start date must be in the present or future." });
    }

    // Check if the rental end date is in the past
    if (rentalEndDateTime < now) {
      return res.status(400).json({ message: "Rental end date must be in the present or future." });
    }

    // Check if the rental start time is in the past
    if (rentalStartDateTime.getTime() === now.getTime() && (startHours < now.getHours() || (startHours === now.getHours() && startMinutes < now.getMinutes()))) {
      return res.status(400).json({ message: "Rental start time must be in the present or future." });
    }

    // Check if the rental end time is in the past
    if (rentalEndDateTime.getTime() === now.getTime() && (endHours < now.getHours() || (endHours === now.getHours() && endMinutes < now.getMinutes()))) {
      return res.status(400).json({ message: "Rental end time must be in the present or future." });
    }

    // Validate that the end date is after the start date
    if (rentalEndDateTime <= rentalStartDateTime) {
      return res.status(400).json({ message: "End date must be after the start date." });
    }

    const newBooking = new Booking({
      carId,
      userId,
      rentalStartDate: rentalStartDateTime,
      rentalStartTime: rentalStartTime, // Store as string
      rentalEndDate: rentalEndDateTime,
      rentalEndTime: rentalEndTime, // Store as string
    });

    await newBooking.save();

    const invoicePath = await createInvoice({
      _id: newBooking._id,
      carId,
      userId,
      rentalStartDate: rentalStartDateTime,
      rentalEndDate: rentalEndDateTime,
      rentalStartTime: rentalStartTime, // Pass as string
      rentalEndTime: rentalEndTime, // Pass as string
    });

    car.availability = "Rented Out";
    await car.save();

    res.status(201).json({
      message: 'Car booked successfully',
      booking: newBooking,
      invoicePath
    });
  } catch (error) {
    console.error("Error booking car:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateBooking = async (req, res) => {
  const { rentalStartDate, rentalEndDate, totalAmount } = req.body;
  const { bookingId } = req.params;
  const userId = req.user;

  try {
    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized access." });
    }

    const car = await Car.findById(booking.carId);
    if (!car || car.availability !== "Rented Out") {
      return res
        .status(400)
        .json({ message: "Car is not currently rented out." });
    }

    const newStartDate = new Date(rentalStartDate);
    const newEndDate = new Date(rentalEndDate);
    const today = new Date();

    if (newStartDate < today || newEndDate < today) {
      return res
        .status(400)
        .json({ message: "Rental dates cannot be in the past." });
    }

    if (newEndDate <= newStartDate) {
      return res
        .status(400)
        .json({ message: "End date must be after the start date." });
    }

    booking.rentalStartDate = rentalStartDate;
    booking.rentalEndDate = rentalEndDate;
    booking.totalAmount = totalAmount;

    await booking.save();

    return res.status(200).json({ message: "Booking updated successfully!" });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
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

          const minutesUntilStart = moment(booking.rentalStartDate).diff(moment(), 'minutes');
          if (minutesUntilStart < 5) {
            return res.status(400).json({
              message: 'Cancellation not allowed within 1 minute of the rental start date.'
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