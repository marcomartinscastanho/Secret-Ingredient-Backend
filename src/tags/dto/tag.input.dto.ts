import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class TagInputDto {
  @ApiProperty({
    description: "The name of the Tag",
    example: "Vegetarian",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export default TagInputDto;
