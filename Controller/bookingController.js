import Booking from '../Model/bookingModel.js';
import Car from '../Model/Car.js';

export const 
bookCar = async (req, res) => {
  const { carId, rentalStartDate, rentalEndDate, totalAmount } = req.body;
  const userId = req.user; // This is the user that is signed in using JWT

  try {
    const car = await Car.findById(carId);
    if (!car || car.availability !== 'Available') {
      return res.status(400).json({ message: 'Car is not available for booking.' });
    }

    const newBooking = new Booking({
      carId,
      userId,
      rentalStartDate,
      rentalEndDate,
      totalAmount,
    });

    await newBooking.save();
    
    // Change car availability to 'Rented Out'
    car.availability = 'Pending';
    await car.save();

    res.status(201).json({ message: 'Car booked successfully!', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
