import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import Car from '../Model/Car.js'; 
import User from '../Model/signup.js'; 
import moment from 'moment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const invoicesDir = path.join(__dirname, '../invoices');

export const createInvoice = async (bookingDetails) => {
    const car = await Car.findById(bookingDetails.carId);
    const user = await User.findById(bookingDetails.userId);

    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 50 });
    const invoicePath = path.join(invoicesDir, `invoice_${bookingDetails._id}.pdf`);
    console.log(`Invoice saved at: ${invoicePath}`);

    doc.pipe(fs.createWriteStream(invoicePath));

    doc.fontSize(30).fillColor('blue').text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).fillColor('black').text(`User Name: ${user.ownerName}`, { continued: true }).text(`\nUser Email: ${user.email}`);
    doc.moveDown();

    doc.text(`Car Brand: ${car.carBrand}`);
    doc.text(`Car Model: ${car.carModel}`);
    doc.text(`Car Color: ${car.color}`);
    doc.moveDown();

    doc.text(`Rental Start Date: ${moment(bookingDetails.rentalStartDate).format('MMMM Do YYYY')}`);
    
    const startDateTime = `${moment(bookingDetails.rentalStartDate).format('YYYY-MM-DD')} ${bookingDetails.rentalStartTime}`;
    const startTimeFormatted = moment(startDateTime, 'YYYY-MM-DD HH:mm').format('hh:mm A');
    doc.text(`Rental Start Time: ${startTimeFormatted}`); 
    
    doc.text(`Rental End Date: ${moment(bookingDetails.rentalEndDate).format('MMMM Do YYYY')}`);
    
    const endDateTime = `${moment(bookingDetails.rentalEndDate).format('YYYY-MM-DD')} ${bookingDetails.rentalEndTime}`;
    const endTimeFormatted = moment(endDateTime, 'YYYY-MM-DD HH:mm').format('hh:mm A');
    doc.text(`Rental End Time: ${endTimeFormatted}`);

    doc.moveDown();
    doc.text(`Total Price: ${bookingDetails.totalPrice.toFixed(2)} Rs/-`); 

    doc.moveDown();
    doc.fontSize(10).fillColor('gray').text('Thank you for choosing our service!', { align: 'center' });

    doc.end();

    console.log(`Invoice saved at: ${invoicePath}`);
    return invoicePath;
};