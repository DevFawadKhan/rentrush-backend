// import fs from 'fs';
// import path from 'path';
// import PDFDocument from 'pdfkit';
// import { fileURLToPath } from 'url';
// import Booking from '../Model/bookingModel.js'; 
// import Car from '../Model/Car.js'; 
// import User from '../Model/signup.js'; 
// import moment from 'moment';

// // Derive __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define the invoices directory path
// const invoicesDir = path.join(__dirname, '../invoices');

// // Function to create an invoice
// export const createInvoice = async (bookingDetails) => {
//     // Fetch car and user details using their IDs
//     const car = await Car.findById(bookingDetails.carId);
//     const user = await User.findById(bookingDetails.userId);

//     // Check if the invoices directory exists, if not, create it
//     if (!fs.existsSync(invoicesDir)) {
//         fs.mkdirSync(invoicesDir, { recursive: true });
//     }

//     const doc = new PDFDocument();
//     const invoicePath = path.join(invoicesDir, `invoice_${bookingDetails._id}.pdf`);

//     doc.pipe(fs.createWriteStream(invoicePath));
//     doc.fontSize(25).text('Invoice', { align: 'center' });
//     doc.text(`User Name: ${user.ownerName}`);
//     doc.text(`User Email: ${user.email}`); 
//     doc.text(`Car Brand: ${car.carBrand}`);
//     doc.text(`Car Model: ${car.carModel}`); 
//     doc.text(`Car Color: ${car.color}`);
//     doc.text(`Rental Start Date: ${moment(bookingDetails.rentalStartDate).format('MMMM Do YYYY')}`);
    
//     // Combine date and time for rental start
//     const startDateTime = `${moment(bookingDetails.rentalStartDate).format('YYYY-MM-DD')} ${bookingDetails.rentalStartTime}`;
//     const startTimeFormatted = moment(startDateTime, 'YYYY-MM-DD HH:mm').format('hh:mm A');
//     doc.text(`Rental Start Time: ${startTimeFormatted}`); 
    
//     doc.text(`Rental End Date: ${moment(bookingDetails.rentalEndDate).format('MMMM Do YYYY')}`);
    
//     // Combine date and time for rental end
//     const endDateTime = `${moment(bookingDetails.rentalEndDate).format('YYYY-MM-DD')} ${bookingDetails.rentalEndTime}`;
//     const endTimeFormatted = moment(endDateTime, 'YYYY-MM-DD HH:mm').format('hh:mm A');
//     doc.text(`Rental End Time: ${endTimeFormatted}`);
    
//     doc.end();

//     console.log(`Invoice saved at: ${invoicePath}`);
//     return invoicePath;
// };

import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import Booking from '../Model/bookingModel.js'; 
import Car from '../Model/Car.js'; 
import User from '../Model/signup.js'; 
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

    const doc = new PDFDocument({ margin: 50 });
    const invoicePath = path.join(invoicesDir, `invoice_${bookingDetails._id}.pdf`);

    doc.pipe(fs.createWriteStream(invoicePath));

    // Title
    doc.fontSize(30).fillColor('blue').text('Invoice', { align: 'center' });
    doc.moveDown();

    // User Information
    doc.fontSize(12).fillColor('black').text(`User Name: ${user.ownerName}`, { continued: true }).text(`\nUser Email: ${user.email}`);
    doc.moveDown();

    // Car Information
    doc.text(`Car Brand: ${car.carBrand}`);
    doc.text(`Car Model: ${car.carModel}`);
    doc.text(`Car Color: ${car.color}`);
    doc.moveDown();

    // Rental Dates
    doc.text(`Rental Start Date: ${moment(bookingDetails.rentalStartDate).format('MMMM Do YYYY')}`);
    
    // Combine date and time for rental start
    const startDateTime = `${moment(bookingDetails.rentalStartDate).format('YYYY-MM-DD')} ${bookingDetails.rentalStartTime}`;
    const startTimeFormatted = moment(startDateTime, 'YYYY-MM-DD HH:mm').format('hh:mm A');
    doc.text(`Rental Start Time: ${startTimeFormatted}`); 
    
    doc.text(`Rental End Date: ${moment(bookingDetails.rentalEndDate).format('MMMM Do YYYY')}`);
    
    // Combine date and time for rental end
    const endDateTime = `${moment(bookingDetails.rentalEndDate).format('YYYY-MM-DD')} ${bookingDetails.rentalEndTime}`;
    const endTimeFormatted = moment(endDateTime, 'YYYY-MM-DD HH:mm').format('hh:mm A');
    doc.text(`Rental End Time: ${endTimeFormatted}`);
    
    // Add a footer
    doc.moveDown();
    doc.fontSize(10).fillColor('gray').text('Thank you for choosing our service!', { align: 'center' });

    // Finalize the PDF and end the stream
    doc.end();

    console.log(`Invoice saved at: ${invoicePath}`);
    return invoicePath;
};