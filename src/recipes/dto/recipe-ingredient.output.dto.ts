import { ApiProperty } from "@nestjs/swagger";
import { IngredientOutputDto } from "../../ingredients/dto/ingredient.output.dto";

export class RecipeIngredientOutputDto {
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
  specification?: string;
}

export default RecipeIngredientOutputDto;
