
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import pkg from 'pdf-to-printer';
import url from 'url';
import os from 'os';
import {exec} from 'child_process'
const { print } = pkg;



export const printReceipt = async (req, res) => {
  const { content } = req.body;

  const platform = os.platform();
  console.log('platform: ', platform);

  try {
    if (platform === 'win32') {
      console.log('window is called ')
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
          res.status(400).send(`Error while printing: ${error}`);
        })
        .finally(() => {
          fs.unlinkSync(pdfPath);
        });
        return;
    } else if (platform === 'linux') {
      console.log('linux is called ')
      const __filename = url.fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const pdfDirectory = path.join(__dirname, 'tmp');

      if (!fs.existsSync(pdfDirectory)) {
        fs.mkdirSync(pdfDirectory, { recursive: true });
      }

      const pdfPath = path.join(pdfDirectory, `${Date.now()}Receipt.pdf`);

      generateReceiptPDF(content, pdfPath)
        .then(() => {
          const printCommand = `lp -d HP-LaserJet-Professional-P1102 ${pdfPath}`;
          exec(printCommand, (error) => {
            if (error) {
              console.log('Error while printing:', error);
              res.status(400).send(`Error while printing: ${error}`);
            } else {
              console.log('Print done');
              res.status(200).send('Print successful');
              fs.unlinkSync(pdfPath); 
            }
          });
        })
        .catch(error => {
          console.log('Error while generating PDF:', error);
          res.status(400).send(`Error while generating PDF: ${error}`);
        });
        return;
    } else {
      console.error('Unsupported platform:', platform);
      res.status(400).send('Unsupported platform');
    }

    console.log('Print done');
    res.status(200).send('Print successful');
  } catch (error) {
    console.error('Error while printing:', error);
    res.status(400).send(`Error while printing: ${error}`);
  }
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