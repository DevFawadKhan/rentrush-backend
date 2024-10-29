// controllers/invoiceController.js
import PDFDocument from 'pdfkit';
import Booking from '../Model/bookingModel.js';
import fs from 'fs';

export const generateInvoice = async (req, res) => {
  const { bookingId } = req.params;

  try {
    // Validate booking ID
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    // Find the booking by ID
    const booking = await Booking.findById(bookingId).populate('userId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user data is populated
    if (!booking.userId) {
      return res.status(500).json({ message: 'User data not populated' });
    }

    // Create a PDF document
    const doc = new PDFDocument();
    const invoicePath = `invoices/invoice_${bookingId}.pdf`;

    // Pipe the PDF to a file
    doc.pipe(fs.createWriteStream(invoicePath));

    // Add content to the PDF
    doc.fontSize(25).text('Rental Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Customer Name: ${booking.userId.name}`);
    doc.text(`Email: ${booking.userId.email}`);
    doc.text(`CNIC: ${booking.userId.cnic}`);
    doc.text(`Contact: ${booking.userId.contact}`);
    doc.text(`Rental Start Date: ${booking.rentalStartDate}`);
    doc.text(`Rental End Date: ${booking.rentalEndDate}`);
    doc.text(`Total Amount: $${booking.totalAmount}`);

    // Finalize the PDF and end the stream
    doc.end();

    // Send the PDF file as a response
    res.download(invoicePath, `invoice_${bookingId}.pdf`, (err) => {
      if (err) {
        console.error('Error sending the invoice:', err);
      }
      // Optionally, remove the file after sending
      fs.unlink(invoicePath, (err) => {
        if (err) console.error('Error deleting the invoice file:', err);
      });
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};