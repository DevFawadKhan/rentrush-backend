import express from 'express';
import { bookCar } from '../Controller/bookingController.js';
import {verifyToken} from '../Middleware/verifyToken.js'; // JWT auth middleware

const router = express.Router();

router.post('/book', verifyToken, bookCar);

export default router;
