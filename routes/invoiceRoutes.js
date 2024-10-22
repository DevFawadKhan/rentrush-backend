// // routes/invoiceRoutes.js
// import express from 'express';
// import fs from 'fs';
// import path from 'path';

// const router = express.Router();

// // Download PDF invoice by booking ID
// router.get('/invoice/download/:bookingId', (req, res) => {
//   const { bookingId } = req.params;
//   const filePath = path.join(__dirname, `../invoices/invoice_${bookingId}.pdf`);

//   // Check if the file exists
//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).json({ message: 'Invoice not found.' });
//     }
    
//     // Send the file to the client
//     res.download(filePath, `invoice_${bookingId}.pdf`, (err) => {
//       if (err) {
//         console.error('Error sending file:', err);
//         return res.status(500).send('Error sending invoice.');
//       }
//     });
//   });
// });

// export default router;
