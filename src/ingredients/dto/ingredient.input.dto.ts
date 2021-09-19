import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class IngredientInputDto {
  @ApiProperty({
    description: "The name of the Ingredient",
    example: "Cinnamon",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export default IngredientInputDto;
