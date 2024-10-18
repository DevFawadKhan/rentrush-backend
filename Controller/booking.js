const Booking = require('../Model/bookingModel');
const Car = require('../Model/Car');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a new booking
exports.bookCar = async (req, res) => {
  const { customerId, carId, startDate, endDate, startTime, endTime } = req.body;
  
  try {
    const car = await Car.findById(carId);
    if (!car || !car.availability) {
      return res.status(400).json({ error: 'Car not available' });
    }

    const rentalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = rentalDays * car.rentalRate;

    const booking = new Booking({
      customer: customerId,
      car: carId,
      startDate,
      endDate,
      startTime,
      endTime,
      totalPrice,
      invoiceGenerated: false
    });

    await booking.save();

    car.availability = false;
    await car.save();

    res.status(201).json({ message: 'Car booked successfully', booking });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Generate Invoice
exports.generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car customer');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const doc = new PDFDocument();
    const invoicePath = `./invoices/invoice-${booking._id}.pdf`;
    doc.pipe(fs.createWriteStream(invoicePath));

    doc.text(`Invoice for Booking ID: ${booking._id}`);
    doc.text(`Car: ${booking.car.make} ${booking.car.model}`);
    doc.text(`Rental Rate: ${booking.car.rentalRate}`);
    doc.text(`Total Price: ${booking.totalPrice}`);
    doc.text(`Booking Dates: ${booking.startDate} to ${booking.endDate}`);
    
    doc.end();

    booking.invoiceGenerated = true;
    booking.invoiceUrl = invoicePath;
    await booking.save();

    res.status(200).json({ message: 'Invoice generated successfully', invoiceUrl: invoicePath });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Download Invoice
exports.downloadInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || !booking.invoiceGenerated) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.download(booking.invoiceUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
