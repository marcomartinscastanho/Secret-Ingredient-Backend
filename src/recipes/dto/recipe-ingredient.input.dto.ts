import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RecipeIngredientInputDto {
  @ApiProperty({
    description: "The quantity of this ingredient",
    example: "200 g",
    required: true,
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  quantity: string;

  @ApiProperty({
    description: "The id of the Ingredient",
    example: "60702cd016b0da1906ed1906",
    required: true,
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  ingredientId: string;

  @ApiProperty({
    description: "The specification of this ingredient",
    example: "chopped in cubes",
    type: String,
  })
  @IsOptional()
  @IsString()
  specification?: string;
}

export default RecipeIngredientInputDto;
