const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking');

// Route to book a car
router.post('/', bookingController.bookCar);

// Route to generate an invoice
router.post('/:id/invoice', bookingController.generateInvoice);

// Route to download invoice
router.get('/:id/download', bookingController.downloadInvoice);

module.exports = router;
