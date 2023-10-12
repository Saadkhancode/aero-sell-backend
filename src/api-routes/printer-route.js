import express from 'express'
import {printReceipt} from '../api/print.js'
import {awsupload} from "../middlewares/aws-s3-upload.js";
 const router=express.Router()
 router.post('/print', async (req, res) => {
    try {
      // Call the printReceipt function and get the PDF content
      const pdfBuffer = await printReceipt(req, res);
  
      // Set the Content-Type header to application/pdf
      res.setHeader('Content-Type', 'application/pdf');
  
      // Set other headers as needed, e.g., Content-Disposition
      res.setHeader('Content-Disposition', 'attachment; filename="Receipt.pdf"');
      res.setHeader('Cache-Control', 'no-cache');
  
      // Send the PDF content as the response
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error while processing the request:', error);
      res.status(500).send('Internal Server Error');
    }
  });


 export default router