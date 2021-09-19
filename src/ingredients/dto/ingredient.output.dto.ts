import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class IngredientOutputDto {
  @ApiProperty({
    description: "The id of the Ingredient",
    example: "60702cd016b0da4034ed6313",
    type: String,
  })
  id: Types.ObjectId;

  @ApiProperty({
    description: "The name of the Ingredient",
    example: "Cinnamon",
    type: String,
  })
  name: string;
}

export default IngredientOutputDto;
