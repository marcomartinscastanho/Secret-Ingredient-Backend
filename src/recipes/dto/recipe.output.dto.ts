import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { TagOutputDto } from "../../tags/dto/tag.output.dto";
import { RecipeIngredientOutputDto } from "./recipe-ingredient.output.dto";

export class RecipeOutputDto {
  @ApiProperty({
    description: "The id of the Recipe",
    example: "60702cd016b0da4034ed6313",
    type: String,
  })
  id: Types.ObjectId;

  @ApiProperty({
    description: "The title of the Recipe",
    example: "Chili con carne",
    type: String,
  })
  title: string;

  @ApiProperty({
    description: "The number of portions the recipe serves",
    example: 4,
    type: Number,
  })
  portions?: number;

  @ApiProperty({
    description: "A short description of the recipe",
    example: "Spicy recipe made of minced cow meat and beans. Goes well with white rice.",
    type: String,
  })
  description?: string;

  @ApiProperty({
    description: "The list of tags associated with the Recipe",
    example: [{ id: "60702cd016b0da1906ed1906", name: "Vegetarian" }],
    required: false,
    type: [TagOutputDto],
  })
  tags: TagOutputDto[];

  @ApiProperty({
    description: "The time it takes to prepare the Recipe, in minutes",
    example: 50,
    type: Number,
  })
  preparationTime: number;

  @ApiProperty({
    description: "The time it takes for the Recipe to cook, in minutes",
    example: 30,
    type: Number,
  })
  cookingTime: number;

  @ApiProperty({
    description: "The list of ingredients needed for the Recipe",
    example: [
      {
        quantity: "200 g",
        ingredient: { id: "60702cd016b0da1906ed1906", name: "Dark chocolate" },
        specification: "chopped into bits",
      },
    ],
    type: [RecipeIngredientOutputDto],
  })
  ingredients: RecipeIngredientOutputDto[];

  @ApiProperty({
    description: "The steps to prepare and cook the Recipe",
    example: ["Chop vegetables", "Put them in the oven"],
    type: [String],
  })
  preparationSteps: string[];

  @ApiProperty({
    description: "The id of the User who owns the Recipe",
    example: "60702cd016b0da1906ed1906",
    type: String,
  })
  user: Types.ObjectId;
}

export default RecipeOutputDto;
