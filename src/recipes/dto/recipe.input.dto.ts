import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import RecipeIngredientInputDto from "./recipe-ingredient.input.dto";

export class RecipeInputDto {
  @ApiProperty({
    description: "The title of the Recipe",
    example: "Chili con carne",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: "The list of tag Ids to associate the Recipe to",
    example: ["60702cd016b0da1906ed1906"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  tagIds: string[];

  @ApiProperty({
    description: "The time it takes to prepare the Recipe, in minutes",
    example: 20,
    type: Number,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  preparationTime?: number;

  @ApiProperty({
    description: "The time it takes for the Recipe to cook, in minutes",
    example: 45,
    type: Number,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  cookingTime?: number;

  @ApiProperty({
    description: "The list of ingredients needed for the Recipe",
    example: [
      {
        quantity: "200 g",
        ingredientId: "60702cd016b0da1906ed1906",
        specification: "chopped into bits",
      },
    ],
    type: [RecipeIngredientInputDto],
  })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(2)
  ingredients!: RecipeIngredientInputDto[];

  @ApiProperty({
    description: "The steps to prepare and cook the Recipe",
    example: ["Chop vegetables", "Put them in the oven"],
    type: [String],
  })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(2)
  @MinLength(8, {
    each: true,
  })
  @MaxLength(240, {
    each: true,
  })
  preparationSteps!: string[];

  @ApiProperty({
    description: "The id of the User who owns the new Recipe",
    example: "60702cd016b0da1906ed1906",
    required: false,
    default: "If not set, defaults to the id of the user who performs the request",
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  ownerId?: string;
}

export default RecipeInputDto;
