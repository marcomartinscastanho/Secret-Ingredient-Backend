import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class TagOutputDto {
  @ApiProperty({
    description: "The id of the Tag",
    example: "60702cd016b0da4034ed6313",
    type: String,
  })
  id: Types.ObjectId;

  @ApiProperty({
    description: "The name of the Tag",
    example: "Vegetarian",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The number of recipes using this tag",
    example: 14,
    type: Number,
  })
  popularity: number;
}

export default TagOutputDto;
