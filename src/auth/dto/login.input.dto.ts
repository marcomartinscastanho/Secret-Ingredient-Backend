import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginInputDto {
  @ApiProperty({
    description: "The username of the User",
    example: "homer",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: "The password of the User.",
    example: "I<3Donuts",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export default LoginInputDto;
