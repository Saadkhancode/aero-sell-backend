import express from 'express';

import {
  deleteBillDenomination,
  getBillDenomination,
  getBillDenominationById,
  postBillDenomination,
  updateBillDenomination,
} from '../api/denomination.js'; // Import the corresponding API functions for Bill Denominations

const routes = express.Router();

// Define routes for Bill Denominations
routes.get('/billdenomination', getBillDenomination);
routes.get('/billdenomination/:_id', getBillDenominationById);

routes.post('/billdenomination', postBillDenomination);
routes.put('/billdenomination/:_id', updateBillDenomination);
routes.delete('/billdenomination/:_id', deleteBillDenomination);

export default routes;
