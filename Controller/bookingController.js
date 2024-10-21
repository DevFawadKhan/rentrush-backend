import { Booking } from '../Model/bookingModel';

export const createBooking = async (req, res) => {
  try {
    const { carId, rentalDays, bookingDate, totalPrice } = req.body;
    const newBooking = new Booking({
      user: req.user,
      car: carId,
      rentalDays,
      totalPrice,
      bookingDate
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);

  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error });
  }
};

export const getBookings = async (req, res) => {
  try {
    // const bookings = await Booking.find().populate('user').populate('car');
    const bookings = await Booking.find().populate('user')
    .populate('car')
    ;
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error });
  }
};
