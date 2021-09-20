import { RecipeIngredientOutputDto } from "./recipe-ingredient.output.dto";
import { daoToDto as ingredientDaoToDto } from "../../ingredients/dto/dao.to.dto";
import { RecipeIngredient } from "../../types/recipe-ingredient.type";

export const daoToDto = (recipeIngredient: RecipeIngredient): RecipeIngredientOutputDto => {
  return {
    quantity: recipeIngredient.quantity,
    ingredient: ingredientDaoToDto(recipeIngredient.ingredient),
    specification: recipeIngredient.specification ? recipeIngredient.specification : "",
  };
};

export default daoToDto;
