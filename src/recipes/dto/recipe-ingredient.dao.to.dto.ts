import { RecipeIngredient } from "../recipe-ingredients.model";
import { RecipeIngredientOutputDto } from "./recipe-ingredient.output.dto";
import { daoToDto as ingredientDaoToDto } from "../../ingredients/dto/dao.to.dto";

export const daoToDto = (recipeIngredient: RecipeIngredient): RecipeIngredientOutputDto => {
  return {
    id: recipeIngredient._id,
    quantity: recipeIngredient.quantity,
    ingredient: ingredientDaoToDto(recipeIngredient.ingredient),
    specification: recipeIngredient.specification ? recipeIngredient.specification : "",
  };
};

export default daoToDto;
