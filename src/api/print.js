
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import pkg from 'pdf-to-printer';
import AWS from 'aws-sdk';
import url from 'url'; 
const s3 = new AWS.S3();
const { print } = pkg;

export const printReceipt = async (req, res) => {
  const { content } = req.body;
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pdfDirectory = path.join(__dirname, 'tmp');

  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
  }

  const pdfPath = path.join(pdfDirectory, `${Date.now()}Receipt.pdf`);

  generateReceiptPDF(content, pdfPath)
    .then(() => {
      res.setHeader('Content-Type', 'application/pdf');
      return print(pdfPath);
    })
    .then(() => {
      console.log('Print done');
      res.status(200).send('Print successful');
    })
    .catch(error => {
      console.log('Error while printing:', error);
      res.status(400).send(`Error while printing: ${error.message}`);
    })
    .finally(() => {
      fs.unlinkSync(pdfPath);
    });
};
//s
const generateReceiptPDF = async (htmlContent, pdfPath) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    await page.pdf({ path: pdfPath, format: 'Letter' });
    await browser.close();
  } catch (error) {
    throw new Error(`Error generating PDF: ${error.message}`);
  }
};

// import puppeteer from 'puppeteer';
// import AWS from 'aws-sdk';
// import pkg from 'pdf-to-printer';
// import url from 'url';
// import path from 'path';
// import fs from 'fs';
// const s3 = new AWS.S3();
// const { print } = pkg;

// export const printReceipt = async (req, res) => {
//   const { content } = req.body;
//   const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const pdfDirectory = path.join(__dirname, 'tmp');

// if (!fs.existsSync(pdfDirectory)) {
// fs.mkdirSync(pdfDirectory, { recursive: true });
// }
// const pdfFileName= `${Date.now()}Receipt.pdf`;
// const pdfPath = path.join(pdfDirectory, `${Date.now()}Receipt.pdf`);

//   try {
//     // Generate the PDF
//     // const pdfFileName = `${Date.now()}Receipt.pdf`;
//     // const pdfPath = `/tmp/${pdfFileName}`;

//     await generateReceiptPDF(content, pdfPath);

//     const s3Params = {
//       Bucket: 'patronworks',
//       Key: pdfFileName,
//       Body: pdfPath,
//     };
//     await s3.upload(s3Params).promise();

//     const s3GetObjectParams = {
//       Bucket: 'patronworks',
//       Key: pdfFileName,
//     };

//     const s3Object = await s3.getObject(s3GetObjectParams).promise();
//     if (!s3Object.Body) {
//       throw new Error('No data found');
//     }

//     const pdfBuffer = s3Object.Body;

//     await print(pdfBuffer);

//     console.log('Print done');
//     res.status(200).send('Print successful');
//   } catch (error) {
//     console.error('Error while processing the request:', error.message);
//     res.status(500).send('Internal Server Error');
//   }finally{
//     fs.unlinkSync(pdfPath);
//   }
// };

// const generateReceiptPDF = async (htmlContent, pdfPath) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.setContent(htmlContent);
//   await page.pdf({ path: pdfPath, format: 'Letter' });
//   await browser.close();
// };
