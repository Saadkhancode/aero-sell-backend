import pkg from "pdf-to-printer";
import fs from "fs";
import path from "path";

import { fileURLToPath } from 'url';
const {print,getDefaultPrinter,getPrinters} = pkg;
export const printReceipt = async (req, res) => {
  const options = {};
 
  const printer=pkg.getDefaultPrinter().then(res=>{
    console.log('res: ', res);

  }).catch(err=>{
    console.log('err: ', err);

  })
  console.log('printer: ', printer);
  return
  // Get the current module's directory name
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Define the directory for temporary files
  const tmpDir = path.join(__dirname, 'tmp');

  // Ensure the directory exists (create if it doesn't)
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  // Generate a unique filename with an absolute path
  const uniqueFilename = path.join(tmpDir, `${Math.random().toString(36).substr(7)}.pdf`);

  fs.writeFileSync(uniqueFilename, req.body.content, 'binary');
  await ptp.print(uniqueFilename, options).then(res=>{
    Console.log('print done')
    fs.unlinkSync(uniqueFilename);
    res.status(200).json("print successfull");
    return
  }).catch(err=>{
    console.log('error while printing');
    fs.unlinkSync(uniqueFilename);
    res.status(200).send("error while printing");
  });
}