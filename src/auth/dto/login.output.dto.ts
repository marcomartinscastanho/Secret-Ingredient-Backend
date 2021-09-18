import { ApiProperty } from "@nestjs/swagger";

export class LoginOutputDto {
  @ApiProperty({
    description:
      "The access token to be used as request header in order to authenticate further requests",
    type: String,
  })
  accessToken: string;
}

export default LoginOutputDto;
