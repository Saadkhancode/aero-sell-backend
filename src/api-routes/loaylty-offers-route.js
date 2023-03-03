import express  from "express";
const routes=express.Router();

import {getLoyalty,
    postLoyalty,
    updateLoyalty,
    deleteLoyalty,
    getLoyaltyById
} from "../api/loyality-offers.js"

routes.get('/loyalty', getLoyalty )
routes.get('/loyalty/:_id',getLoyaltyById)

routes.post('/loyalty', postLoyalty )

routes.put('/loyalty/:_id', updateLoyalty )
routes.delete('/loyalty/:_id', deleteLoyalty )


export default routes;