// import fs from 'fs';
// import path from 'path';
// import PDFDocument from 'pdfkit';
// import { fileURLToPath } from 'url';
// import moment from 'moment';

// // Derive __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define the invoices directory path
// const invoicesDir = path.join(__dirname, '../invoices');

// // Function to create an invoice
// export const createInvoice = async (bookingDetails) => {
//     // Check if the invoices directory exists, if not, create it
//     if (!fs.existsSync(invoicesDir)) {
//         fs.mkdirSync(invoicesDir, { recursive: true });
//     }

//     const doc = new PDFDocument();
//     const invoicePath = path.join(invoicesDir, `invoice_${bookingDetails._id}.pdf`);

//     doc.pipe(fs.createWriteStream(invoicePath));
//     doc.fontSize(25).text('Invoice', { align: 'center' });
//     doc.text(`Booking ID: ${bookingDetails._id}`);
//     doc.text(`User ID: ${bookingDetails.userId}`);
//     doc.text(`Car ID: ${bookingDetails.carId}`);
//     doc.text(`Rental Start Date: ${moment(bookingDetails.rentalStartDate).format('MMMM Do YYYY')}`);
//     doc.text(`Rental End Date: ${moment(bookingDetails.rentalEndDate).format('MMMM Do YYYY')}`);
//     doc.text(`Total Amount: $${bookingDetails.totalAmount}`);
//     doc.end();

//     console.log(`Invoice saved at: ${invoicePath}`);
//     return invoicePath;
// };

import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import Booking from '../Model/bookingModel.js'; // Assuming you have a Booking model
import Car from '../Model/Car.js'; // Assuming you have a Car model
import User from '../Model/signup.js'; // Assuming you have a User model
import moment from 'moment';

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the invoices directory path
const invoicesDir = path.join(__dirname, '../invoices');

// Function to create an invoice
export const createInvoice = async (bookingDetails) => {
    // Fetch car and user details using their IDs
    const car = await Car.findById(bookingDetails.carId);
    const user = await User.findById(bookingDetails.userId);

    // Check if the invoices directory exists, if not, create it
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const invoicePath = path.join(invoicesDir, `invoice_${bookingDetails._id}.pdf`);

    doc.pipe(fs.createWriteStream(invoicePath));
    doc.fontSize(25).text('Invoice', { align: 'center' });
    // doc.text(`Booking ID: ${bookingDetails._id}`);
    doc.text(`User Name: ${user.ownerName}`);
    doc.text(`User Email: ${user.email}`); 
    doc.text(`Car Brand: ${car.carBrand}`);
    doc.text(`Car Model: ${car.carModel}`); 
    doc.text(`Car Color: ${car.color}`);
    doc.text(`Rental Start Date: ${moment(bookingDetails.rentalStartDate).format('MMMM Do YYYY')}`);
    doc.text(`Rental End Date: ${moment(bookingDetails.rentalEndDate).format('MMMM Do YYYY')}`);
    doc.text(`Total Amount: $${bookingDetails.totalAmount}`);
    doc.end();

    console.log(`Invoice saved at: ${invoicePath}`);
    return invoicePath;
};