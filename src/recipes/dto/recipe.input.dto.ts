import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
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
    description: "The number of portions the recipe serves",
    example: 4,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  portions?: number;

  @ApiProperty({
    description: "A short description of the recipe",
    example: "Spicy recipe made of minced cow meat and beans. Goes well with white rice.",
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  @MinLength(3)
  description?: string;

  @ApiProperty({
    description: "The list of tag Ids to associate the Recipe to",
    example: ["60702cd016b0da1906ed1906"],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  tagIds: string[];

  @ApiProperty({
    description: "The time it takes to prepare the Recipe, in minutes",
    example: 20,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  preparationTime?: number;

  @ApiProperty({
    description: "The time it takes for the Recipe to cook, in minutes",
    example: 45,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
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
  @MinLength(3, {
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
