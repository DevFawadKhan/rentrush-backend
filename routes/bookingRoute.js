import express from 'express';
import {bookCar, updateBooking, cancelBooking} from '../Controller/bookingController.js';
import {verifyToken} from '../Middleware/verifyToken.js';


const router = express.Router();

// router.get('/booking/:bookingId', verifyToken, getAllBookings);
router.post('/book', verifyToken, bookCar);
router.put('/update/:bookingId', verifyToken, updateBooking);
router.delete('/cancel/:bookingId', verifyToken, cancelBooking);

export default router;