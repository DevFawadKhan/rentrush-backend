import express from 'express';
import { bookCar } from '../Controller/bookingController.js';
import {updateBooking} from '../Controller/bookingController.js';
import {cancelBooking} from '../Controller/bookingController.js';
import {verifyToken} from '../Middleware/verifyToken.js'; // JWT auth middleware

const router = express.Router();

router.post('/book', verifyToken, bookCar);
router.put('/update/:bookingId', verifyToken, updateBooking);
router.delete('/cancel/:bookingId', verifyToken, cancelBooking);

export default router;
