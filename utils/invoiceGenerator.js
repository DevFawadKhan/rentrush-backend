// utils/invoiceGenerator.js
import Invoice from '../Model/invoiceModel.js';

export const generateInvoice = async (userId, bookingId, carId, rentalStartDate, rentalEndDate, totalAmount) => {
  // Create a new invoice object
  const newInvoice = new Invoice({
    userId,
    bookingId,
    carId,
    rentalStartDate,
    rentalEndDate,
    totalAmount,
  });

  // Save the invoice to the database
  await newInvoice.save();

  // Return the saved invoice for further use if needed
  return newInvoice;
};
