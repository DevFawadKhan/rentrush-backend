// controllers/bookCar.js
import Booking from '../Model/bookingModel.js';
import Car from '../Model/Car.js';
import { generateInvoice } from '../utils/invoiceGenerator.js';
// import { createInvoicePDF } from '../utils/pdfGenerator.js';

export const bookCar = async (req, res) => {
  const { carId, rentalStartDate, rentalEndDate, totalAmount } = req.body;
  const userId = req.user; // This is the user that is signed in using JWT

  try {
    // Find the car by ID
    const car = await Car.findById(carId);

    // Check if the car is available
    if (!car || car.availability !== 'Available') {
      return res.status(400).json({ message: 'Car is not available for booking.' });
    }

    // Create a new booking
    const newBooking = new Booking({
      carId,
      userId,
      rentalStartDate,
      rentalEndDate,
      totalAmount,
    });

    await newBooking.save();
    
    // Change car availability to 'Rented Out'
    car.availability = 'Rented Out';
    await car.save();

    // Generate invoice after booking
    const invoice = await generateInvoice(userId, newBooking._id, carId, rentalStartDate, rentalEndDate, totalAmount);

    // const pdfPath = createInvoicePDF({
    //   userId,
    //   bookingId: newBooking._id,
    //   carId,
    //   rentalStartDate,
    //   rentalEndDate,
    //   totalAmount,
    // });

    // Send only the success message without additional booking data
    return res.status(201).json({ message: 'Car booked successfully!', invoiceId: invoice._id });
  } catch (error) {
    console.error('Error booking car:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// import Booking from '../Model/bookingModel.js';
// import Car from '../Model/Car.js';
// // import { generateInvoice } from '../utils/invoiceGenerator.js'

// export const bookCar = async (req, res) => {
//   const { carId, rentalStartDate, rentalEndDate, totalAmount } = req.body;
//   const userId = req.user; // This is the user that is signed in using JWT

//   try {
//     // Find the car by ID
//     const car = await Car.findById(carId);

//     // Check if the car is available
//     if (!car || car.availability !== 'Available') {
//       return res.status(400).json({ message: 'Car is not available for booking.' });
//     }

//     // Create a new booking
//     const newBooking = new Booking({
//       carId,
//       userId,
//       rentalStartDate,
//       rentalEndDate,
//       totalAmount,
//     });

//     await newBooking.save();
    
//     // Change car availability to 'Rented Out'
//     car.availability = 'Rented Out';
//     await car.save();

//     // const invoice = await generateInvoice(userId, newBooking._id, carId, rentalStartDate, rentalEndDate, totalAmount);

//     // Send only the success message without additional booking data
//     return res.status(201).json({ message: 'Car booked successfully!' });
//   } catch (error) {
//     console.error('Error booking car:', error);
//     return res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// };


// import Booking from '../Model/bookingModel.js';
// import Car from '../Model/Car.js';

// export const bookCar = async (req, res) => {
//   const { carId, rentalStartDate, rentalEndDate, totalAmount } = req.body;
//   const userId = req.user; // This is the user that is signed in using JWT

//   try {
//     const car = await Car.findById(carId);

//     // Check if car exists and is available
//     if (!car || car.availability !== 'Available') {
//       return res.status(400).json({ message: 'Car is not available for booking.' });
//     }

//     // Check if the car is already booked for the selected dates
//     const overlappingBooking = await Booking.findOne({
//       carId: carId,
//       rentalStartDate: { $lt: rentalEndDate },
//       rentalEndDate: { $gt: rentalStartDate }
//     }).populate('-carId');

//     if (overlappingBooking) {
//       return res.status(400).json({ message: 'Car is already booked for the selected dates.' });
//     }

//     // Create new booking
//     const newBooking = new Booking({
//       carId,
//       userId,
//       rentalStartDate,
//       rentalEndDate,
//       totalAmount,
//     });

//     await newBooking.save();
    
//     // Change car availability to 'Rented Out'
//     car.availability = 'Rented Out';
//     await car.save();

//     res.status(201).json({ message: 'Car booked successfully!', booking: newBooking });
//   } catch (error) {
//     console.error('Error booking car:', error);
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// };
