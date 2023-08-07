import PDFDocument from 'pdfkit'
import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
import sendMail from '../middlewares/send-email.js';

export const sendRecieptViaMail = async (req, res) => {
    const { email, recieptContent } = req.body;
  
    // Get the current module's URL
    const currentFilePath = fileURLToPath(import.meta.url);
  
    // Generate the PDF receipt
    const receiptFileName = generateReceipt(recieptContent, currentFilePath);
    console.log('receiptFileName: ', receiptFileName);
  
    // Send the receipt PDF as an email attachment
    const emailSubject = 'Receipt';
    const attachments = [{ filename: 'Receipt.pdf', path: path.join(path.dirname(currentFilePath), '..', 'receipts', receiptFileName) }];
  
    try {
      await sendMail(email, emailSubject, recieptContent, attachments);
      res.status(200).json({ message: 'Receipt sent successfully via email.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'An error occurred while sending the receipt via email.' });
    }
  };
  
  const generateReceipt = (recieptContent, currentFilePath) => {
    const doc = new PDFDocument();
    const fileName = `receipt_${Date.now()}.pdf`;
    const filePath = path.join(path.dirname(currentFilePath), '..', 'receipts', fileName);
  
    // Create the receipts folder if it doesn't exist
    if (!fs.existsSync(path.join(path.dirname(currentFilePath), '..', 'receipts'))) {
      fs.mkdirSync(path.join(path.dirname(currentFilePath), '..', 'receipts'));
    }
  
    // Generate the receipt content
    doc.pipe(fs.createWriteStream(filePath));
    doc.font('Helvetica-Bold').fontSize(20).text(recieptContent, { align: 'center' });
    // Add your receipt content here based on the `recieptContent` object
    // For example:
    // doc.font('Helvetica').fontSize(12).text(`Order ID: ${recieptContent.orderId}`);
    // doc.font('Helvetica').fontSize(12).text(`Customer Name: ${recieptContent.customerName}`);
    // ...
    doc.end();
  
    return fileName;
  };
