// // utils/pdfGenerator.js
// import PDFDocument from 'pdfkit';
// import fs from 'fs';

// export const createInvoicePDF = (invoiceData) => {
//   const { userId, bookingId, carId, rentalStartDate, rentalEndDate, totalAmount } = invoiceData;

//   // Create a new PDF document
//   const doc = new PDFDocument();

//   // Define the output path for the PDF file
//   const filePath = `invoices/invoice_${bookingId}.pdf`;

//   // Pipe the PDF to a file
//   doc.pipe(fs.createWriteStream(filePath));

//   // Add content to the PDF
//   doc.fontSize(20).text('Invoice', { align: 'center' });
//   doc.moveDown();

//   // Add user and booking details
//   doc.fontSize(12).text(`User ID: ${userId}`);
//   doc.text(`Booking ID: ${bookingId}`);
//   doc.text(`Car ID: ${carId}`);
//   doc.text(`Rental Start Date: ${new Date(rentalStartDate).toLocaleDateString()}`);
//   doc.text(`Rental End Date: ${new Date(rentalEndDate).toLocaleDateString()}`);
//   doc.text(`Total Amount: $${totalAmount.toFixed(2)}`);
//   doc.moveDown();

//   // Finalize the PDF and end the stream
//   doc.end();

//   // Return the file path for further use
//   return filePath;
// };
