import express from 'express'
import {getIngredientCategorys,
    getIngredientCategory,
    postIngredientCategory,
    updateIngredientCategory,
    deleteIngredientCategory
} from "../api/ingredient-category.js"
const routes=express.Router();
routes.get('/Ingredientcategorys', getIngredientCategorys )
routes.get('/Ingredientcategorys/:_id', getIngredientCategory )

routes.post('/Ingredientcategorys', postIngredientCategory )
routes.put('/Ingredientcategorys/:_id', updateIngredientCategory )
routes.delete('/Ingredientcategorys/:_id', deleteIngredientCategory )


export default routes