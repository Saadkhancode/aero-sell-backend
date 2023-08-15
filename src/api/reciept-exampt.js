import sendMail from '../middlewares/send-email.js';
// import pdf from 'html-pdf'; // Import the html-pdf library
import puppeteer from 'puppeteer';
import AWS from 'aws-sdk';
const s3 = new AWS.S3();
export const sendRecieptViaMail = async (req, res) => {
  const { email, recieptContent } = req.body;
  console.log('email: ', email);
  try {
    // Generate the PDF receipt from HTML content
    const pdfBuffer = await generateReceiptPDF(recieptContent);

    // Upload the PDF to S3
    const fileName = Date.now() + 'Receipt.pdf';
    const s3Params = {
      Bucket: 'patronworks', // Replace with your S3 bucket name
      Key: fileName,
      Body: pdfBuffer,
    };
    await s3.upload(s3Params).promise();

    // Send the receipt PDF as an email attachment
    const emailSubject = 'Receipt';
    const attachments = [{ filename: 'Receipt.pdf', path: `https://patronworks.s3.us-west-2.amazonaws.com/${fileName}` }];

    await sendMail(email, emailSubject, recieptContent, attachments);
    res.status(200).json({ message: 'Receipt sent successfully via email.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the receipt via email.' });
  }

};
const generateReceiptPDF = async (htmlContent) => {
  const browser = await puppeteer.launch({ headless: 'new' }); // Pass headless: 'new'
  const page = await browser.newPage();

  // Set the HTML content for the page
  await page.setContent(htmlContent);

  // Generate the PDF buffer
  const pdfBuffer = await page.pdf({ format: 'Letter' });

  // Close the browser
  await browser.close();

  return pdfBuffer;
};