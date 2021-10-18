import { Recipe } from "../recipe.model";
import { RecipeOutputDto } from "./recipe.output.dto";
import { daoToDto as recipeIngredientDaoToDto } from "./recipe-ingredient.dao.to.dto";
import { daoToDto as recipeOwnerDaoToDto } from "./recipe-owner.dao.to.dto";
import { daoToDto as tagDaoToDto } from "../../tags/dto/dao.to.dto";

export const daoToDto = (recipe: Recipe): RecipeOutputDto => {
  return {
    id: recipe._id,
    title: recipe.title,
    portions: recipe.portions,
    description: recipe.description,
    tags: recipe.tags.map((tag) => tagDaoToDto(tag)),
    cookingTime: recipe.cookingTime,
    preparationTime: recipe.preparationTime,
    ingredients: recipe.ingredients.map((ingredient) => recipeIngredientDaoToDto(ingredient)),
    preparationSteps: recipe.preparationSteps,
    owner: recipeOwnerDaoToDto(recipe.owner),
  };
};

export default daoToDto;
