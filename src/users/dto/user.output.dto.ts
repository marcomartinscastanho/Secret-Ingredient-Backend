import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { Role } from "../../types/role.enum";

export class UserOutputDto {
  @ApiProperty({
    description: "The id of the User",
    example: "60702cd016b0da4034ed6313",
    type: String,
  })
  id: Types.ObjectId;

  @ApiProperty({
    description: "The presentation name of the User",
    example: "Homer Simpson",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The username of the User",
    example: "homer",
    type: String,
  })
  username: string;

  @ApiProperty({
    description: "The role of the User",
    enum: Role,
    example: "User",
    type: String,
  })
  role: string;
}

export default UserOutputDto;
