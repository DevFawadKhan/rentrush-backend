import express from 'express';
import { createBooking, getBookings } from '../Controller/bookingController';

const router = express.Router();

// Route for creating a booking
router.post('/book', createBooking);

// Route for getting all bookings
router.get('/bookings', getBookings);

// Other routes for updating and deleting bookings...

export default router;
