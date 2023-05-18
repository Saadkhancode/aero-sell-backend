import express from 'express';

import {
  deleteReciept,
  getReciept,
  getRecieptById,
  getRecieptByNumber,
  postReciept,
  updateReciept,
} from '../api/reciept.js';

const routes = express.Router();

routes.get('/reciept', getReciept)
routes.get('/reciept/:_id', getRecieptById)
routes.get('/recieptNo', getRecieptByNumber)




routes.post('/reciept', postReciept)
routes.put('/reciept/:_id', updateReciept)
routes.delete('/reciept/:_id', deleteReciept)


export default routes