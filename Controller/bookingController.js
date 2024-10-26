import moment from "moment";
import Booking from "../Model/bookingModel.js";
import Car from "../Model/Car.js";

export const bookCar = async (req, res) => {
  const { carId, rentalStartDate, rentalEndDate, totalAmount } = req.body;
  const userId = req.user;

  try {
    const car = await Car.findById(carId);
    if (!car || car.availability !== "Available") {
      return res
        .status(400)
        .json({ message: "Car is not available for booking." });
    }

    const newBooking = new Booking({
      carId,
      userId,
      rentalStartDate,
      rentalEndDate,
      totalAmount,
    });

    await newBooking.save();

    car.availability = "Rented Out";
    await car.save();

    return res.status(201).json({ message: "Car booked successfully!" });
  } catch (error) {
    console.error("Error booking car:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
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

    //     const secondsUntilStart = moment(booking.rentalStartDate).diff(moment(), 'seconds');
    // if (secondsUntilStart < 5) {
    //   return res.status(400).json({
    //     message: 'Cancellation not allowed within 5 seconds of the rental start date.'
    //   });
    // }

    //     const minutesUntilStart = moment(booking.rentalStartDate).diff(moment(), 'minutes');
    // if (minutesUntilStart < 1) {
    //   return res.status(400).json({
    //     message: 'Cancellation not allowed within 1 minute of the rental start date.'
    //   });
    // }

    const hoursUntilStart = moment(booking.rentalStartDate).diff(
      moment(),
      "hours"
    );
    if (hoursUntilStart < 24) {
      return res.status(400).json({
        message:
          "Cancellation not allowed within 24 hours of rental start date.",
      });
    }

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
