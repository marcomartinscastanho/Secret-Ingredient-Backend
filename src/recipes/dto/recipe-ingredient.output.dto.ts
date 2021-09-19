import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { IngredientOutputDto } from "../../ingredients/dto/ingredient.output.dto";

export class RecipeIngredientOutputDto {
  @ApiProperty({
    description: "The id of the RecipeIngredient",
    example: "60702cd016b0da4034ed6313",
    type: String,
  })
  id: Types.ObjectId;

  @ApiProperty({
    description: "The quantity of the ingredient",
    example: "200 g",
    type: String,
  })
  quantity: string;

  @ApiProperty({
    description: "The Ingredient",
    example: "200 g",
    type: IngredientOutputDto,
  })
  ingredient: IngredientOutputDto;

  @ApiProperty({
    description: "The specification of this recipe ingredient",
    example: "chopped in cubes",
    type: String,
  })
  specification: string;

  @ApiProperty({
    description: "The id of the Recipe to which this RecipeIngredient belongs",
    example: "60702cd016b0da1906ed1906",
    type: String,
  })
  recipe: Types.ObjectId;
}

export default RecipeIngredientOutputDto;
