import express from 'express'
import {getIngredients,
    getIngredient,
    postIngredient,
    updateIngredient,
    deleteIngredient
} from "../api/ingredients.js"
const routes=express.Router();
routes.get('/Ingredients', getIngredients )
routes.get('/Ingredients/:_id', getIngredient )

routes.post('/Ingredients', postIngredient )
routes.put('/Ingredients/:_id', updateIngredient )
routes.delete('/Ingredients/:_id', deleteIngredient )


export default routes