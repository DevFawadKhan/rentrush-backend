import moment from "moment";
import Booking from "../Model/bookingModel.js";
import Car from "../Model/Car.js";
import { createInvoice } from "./invoiceController.js";
import { io } from "../index.js";

export const bookCar = async (req, res) => {
  const {
    carId,
    showroomId,
    rentalStartDate,
    rentalStartTime,
    rentalEndDate,
    rentalEndTime,
  } = req.body;

  const userId = req.user;

  try {
    const car = await Car.findById(carId);
    if (!car || car.availability !== "Available") {
      return res
        .status(400)
        .json({ message: "Car is not available for booking." });
    }

    // Create Date objects from the input dates
    const rentalStartDateis = new Date(rentalStartDate);
    const rentalEndDateis = new Date(rentalEndDate);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (rentalStartDateis < now) {
      return res.status(400).json({
        message: "Rental start date must be in the present or future.",
      });
    }

    if (rentalEndDateis < now) {
      return res
        .status(400)
        .json({ message: "Rental end date must be in the present or future." });
    }

    if (rentalEndDateis < rentalStartDateis) {
      return res
        .status(400)
        .json({ message: "End date must be after the start date." });
    }

    // Calculate the rental duration including the last day
    const rentalDuration =
      (rentalEndDateis - rentalStartDateis) / (1000 * 60 * 60 * 24) + 1; // Add 1 to include the end date
    const daysRented = Math.max(0, Math.ceil(rentalDuration));
    const totalPrice = daysRented * car.rentRate;

    // Format dates as "Tue Dec 10 2024"
    const formattedRentalStartDate = rentalStartDateis.toDateString();
    const formattedRentalEndDate = rentalEndDateis.toDateString();

    const newBooking = new Booking({
      carId,
      userId,
      showroomId,
      rentalStartDate: formattedRentalStartDate, // Save as formatted String
      rentalStartTime,
      rentalEndDate: formattedRentalEndDate, // Save as formatted String
      rentalEndTime,
      totalPrice,
    });

    await newBooking.save();

    const invoicePath = await createInvoice({
      _id: newBooking._id,
      carId,
      userId,
      rentalStartDate: formattedRentalStartDate,
      rentalEndDate: formattedRentalEndDate,
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
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // console.log("User ID in getUserBookings:", userId);

    const bookings = await Booking.find({ userId: userId })
      .populate("carId")
      .populate("showroomId", "-password");

    console.log("Bookings after population:", bookings);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No active bookings found" });
    }

    // Create an array to hold the bookings with additional details
    const bookingsWithDetails = bookings.map((booking) => ({
      ...booking.toObject(),
      carDetails: booking.carId, // Car details populated
      showroomDetails: booking.showroomId, // Showroom details populated
    }));

    res.status(200).json(bookingsWithDetails);
  } catch (error) {
    console.error("Error fetching bookings:", error);

    // Check if the error is a Mongoose error
    if (error.name === "MongoError") {
      return res.status(500).json({ message: "Database error occurred" });
    }

    // Handle other types of errors
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { rentalStartDate, rentalEndDate, rentalStartTime, rentalEndTime } = req.body;
  console.log(req.body);

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log(booking);

    // Calculate the current time and the rental start time
    const currentTime = new Date();
    const rentalStartDateTime = new Date(`${booking.rentalStartDate}T${booking.rentalStartTime}`);

    // Check if the rental start time has already passed
    if (rentalStartDateTime <= currentTime) {
      return res.status(400).json({
        message: "You can only update the booking before the rental start time.",
      });
    }

    // Update booking details if provided
    if (rentalStartDate) booking.rentalStartDate = new Date(rentalStartDate);
    if (rentalEndDate) booking.rentalEndDate = new Date(rentalEndDate);
    if (rentalStartTime) booking.rentalStartTime = rentalStartTime;
    if (rentalEndTime) booking.rentalEndTime = rentalEndTime;

    // Save the updated booking
    await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
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

// export const cancelBooking = async (req, res) => {
//   const { bookingId } = req.params; // Extract bookingId from request parameters
//   const userId = req.user; // Get the user ID from the request object

//   try {
//     // Find the booking by ID and ensure it belongs to the user
//     const booking = await Booking.findOne({ _id: bookingId, userId });
//     if (!booking) {
//       return res
//         .status(404)
//         .json({ message: "Booking not found or unauthorized access." });
//     }

//     // Get the current time and the booking start time
//     const currentTime = moment();
//     const bookingStartTime = moment(booking.rentalStartDate).set({
//       hour: booking.rentalStartTime.split(':')[0],
//       minute: booking.rentalStartTime.split(':')[1],
//     });

//     // Check if the cancellation is allowed before the booking start time
//     if (currentTime.isAfter(bookingStartTime)) {
//       return res.status(400).json({
//         message: "Cancellation not allowed after the booking start time.",
//       });
//     }

//     // Update the car's availability to "Available"
//     const car = await Car.findById(booking.carId);
//     if (car) {
//       car.availability = "Available";
//       await car.save();
//     }

//     // Delete the booking
//     await Booking.findByIdAndDelete(bookingId);

//     return res.status(200).json({ message: "Booking canceled successfully." });
//   } catch (error) {
//     console.error("Error canceling booking:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error. Please try again later." });
//   }
// };

// Return a car

export const Return_car = async (req, res) => {
  try {
    const { BookingId } = req.params;
    const booking = await Booking.findById(BookingId).populate("carId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log("booking details", booking);
    const car = await Car.findById(booking.carId._id);
    if (!car) {
      return res.status(404).json({ message: "car not found" });
    }
    io.emit(`notification${car.userId}`, {
      message: "Car return request recieved",
    });
    return res
      .status(200)
      .json({ message: "Return request sent to showroom  owner for approved" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// export const updateBooking = async (req, res) => {
//   const { bookingId } = req.params;
//   const { rentalStartDate, rentalEndDate, rentalStartTime, rentalEndTime } =
//     req.body;

//   try {
//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (rentalStartDate) booking.rentalStartDate = rentalStartDate;
//     if (rentalEndDate) booking.rentalEndDate = rentalEndDate;
//     if (rentalStartTime) booking.rentalStartTime = rentalStartTime;
//     if (rentalEndTime) booking.rentalEndTime = rentalEndTime;

//     await booking.save();
//     res.status(200).json({ message: "Booking updated successfully", booking });
//   } catch (error) {
//     res.status(400).json({ message: "Error updating booking", error });
//   }
// };
