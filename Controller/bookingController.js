import moment from "moment";
import Booking from "../Model/bookingModel.js";
import Car from "../Model/Car.js";
import { createInvoice } from './invoiceController.js';


// export const bookCar = async (req, res) => {
//   const { carId, rentalStartDate, rentalStartTime, rentalEndDate, rentalEndTime } = req.body; // Accept start and end dates and times from the user
//   const userId = req.user;

//   try {
//     const car = await Car.findById(carId);
//     if (!car || car.availability !== "Available") {
//       return res.status(400).json({ message: "Car is not available for booking." });
//     }

//     const startDate = new Date(`${rentalStartDate}T${rentalStartTime}`); 
//     const endDate = new Date(`${rentalEndDate}T${rentalEndTime}`); 

    
//     if (endDate <= startDate) {
//       return res.status(400).json({ message: "End date must be after the start date." });
//     }

//     const newBooking = new Booking({
//       carId,
//       userId,
//       rentalStartDate: startDate,
//       rentalStartTime: startDate, 
//       rentalEndDate: endDate,
//       rentalEndTime: endDate, 
//     });

//     await newBooking.save();

//     const invoicePath = await createInvoice({
//       _id: newBooking._id,
//       carId,
//       userId,
//       rentalStartDate: startDate,
//       rentalEndDate: endDate,
//     });

//     car.availability = "Rented Out";
//     await car.save();

//     res.status(201).json({
//       message: 'Car booked successfully',
//       booking: newBooking,
//       invoicePath
//     });
//   } catch (error) {
//     console.error("Error booking car:", error);
//     return res.status(500).json({ message: "Server error. Please try again later." });
//   }
// };

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

    // Validate that the end date is after the start date
    if (rentalEndDateTime <= rentalStartDateTime) {
      return res.status(400).json({ message: "End date must be after the start date." });
    }

    const rentalDurationHours = (rentalEndDateTime - rentalStartDateTime) / (1000 * 60 * 60); // Calculate duration in hours

    const newBooking = new Booking({
      carId,
      userId,
      rentalStartDate: rentalStartDateTime,
      rentalStartTime: rentalStartDateTime, // Store the full Date object for rentalStartTime
      rentalEndDate: rentalEndDateTime,
      rentalEndTime: rentalEndDateTime, // Store the full Date object for rentalEndTime
      rentalDurationHours, // Store the duration in hours
    });

    await newBooking.save();

    const invoicePath = await createInvoice({
      _id: newBooking._id,
      carId,
      userId,
      rentalStartDate: rentalStartDateTime,
      rentalEndDate: rentalEndDateTime,
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