import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sendMail from '../middlewares/send-email.js';
import pdf from 'html-pdf'; // Import the html-pdf library

export const sendRecieptViaMail = async (req, res) => {
  const { email, recieptContent } = req.body;

  // Get the current module's URL
  const currentFilePath = fileURLToPath(import.meta.url);

  try {
    // Generate the PDF receipt from HTML content
    const pdfBuffer = await generateReceiptPDF(recieptContent);

    // Send the receipt PDF as an email attachment
    const emailSubject = 'Receipt';
    const attachments = [{ filename: 'Receipt.pdf', content: pdfBuffer }];

    await sendMail(email, emailSubject, recieptContent, attachments);
    res.status(200).json({ message: 'Receipt sent successfully via email.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the receipt via email.' });
  }
};

const generateReceiptPDF = async (htmlContent) => {
  return new Promise((resolve, reject) => {
    // Define options for html-pdf
    const pdfOptions = {
      format: 'Letter', // or 'A4', etc.
    };

    // Generate PDF from HTML content
    pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};
