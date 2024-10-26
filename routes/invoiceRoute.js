// routes/bookCarRoutes.js
import express from 'express';
import { bookCar } from '../Controller/bookingController.js';
import path from 'path';

const router = express.Router();

// Route for booking a car
router.post('/book', bookCar);

// Route for downloading the invoice
router.get('/download/:invoiceId', (req, res) => {
  const { invoiceId } = req.params;
  const invoicePath = path.join(__dirname, `../invoices/invoice-${invoiceId}.pdf`);

  // Check if the file exists before serving
  res.download(invoicePath, (err) => {
    if (err) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
  });
});

export default router;
