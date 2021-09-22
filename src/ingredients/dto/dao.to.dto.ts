import { Ingredient } from "../ingredients.model";
import { IngredientOutputDto } from "./ingredient.output.dto";

export const daoToDto = (ingredient: Ingredient): IngredientOutputDto => {
  return {
    id: ingredient._id,
    name: ingredient.name,
    popularity: ingredient.popularity,
  };
};

export default daoToDto;
