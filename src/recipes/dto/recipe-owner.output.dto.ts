import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class RecipeOwnerOutputDto {
  @ApiProperty({
    description: "The id of the Owner",
    example: "60702cd016b0da4034ed6313",
    type: String,
  })
  id: Types.ObjectId;

  @ApiProperty({
    description: "The presentation name of the Owner",
    example: "Homer Simpson",
    type: String,
  })
  name: string;
}

export default RecipeOwnerOutputDto;
