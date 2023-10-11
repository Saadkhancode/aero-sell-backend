import pkg from "pdf-to-printer";
import puppeteer from 'puppeteer';
import fs from "fs";
import path from "path";
import url from 'url'; // Import url module

const { print, getDefaultPrinter } = pkg;

export const printReceipt = async (req, res) => {
  const { content } = req.body;
  const options = {};

  // Get the directory name using import.met
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const pdfPath = path.join(__dirname, 'tmp', `${Date.now()}Receipt.pdf`);

  try {
    // Generate the PDF and save it to a temporary file
    await generateReceiptPDF(content, pdfPath);

    const defaultPrinter = await pkg.getDefaultPrinter().catch(err => {
      console.log('Error getting default printer:', err);
      res.status(400).send("Error getting default printer");
      return;
    });

    if (!defaultPrinter) {
      console.log('No default printer found.');
      res.status(400).send("No default printer found");
      return;
    }

    console.log('Default printer: ', defaultPrinter);

    // Print the PDF using the default printer
    await pkg.print(pdfPath, options).then(() => {
      console.log('Print done');
      res.status(200).json("Print successful");
    }).catch(err => {
      console.log('Error while printing:', err);
      res.status(400).send("Error while printing");
    });
  } finally {
    // Delete the temporary file
    fs.unlinkSync(pdfPath);
  }
};

const generateReceiptPDF = async (htmlContent, pdfPath) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    console.log('html content',htmlContent)
    await page.setContent(htmlContent);
    await page.pdf({ path: pdfPath, format: 'Letter' });
  } finally {
    await browser.close();
  }
};
