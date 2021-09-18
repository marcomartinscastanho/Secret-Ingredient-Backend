import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import {
  acceptedSymbols,
  maxLength,
  minLength,
  minLowercase,
  minSymbols,
  minUppercase,
} from "../../constants/password.rules";

export class RegisterInputDto {
  @ApiProperty({
    description: "The presentation name of the User",
    example: "Homer Simpson",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The username of the User",
    example: "homer",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+([_.-]?[a-zA-Z0-9])*$/)
  username: string;

  @ApiProperty({
    description:
      "The password of the User. Is must include at least:" +
      "\n - 1 uppercase character" +
      "\n - 1 lowercase character" +
      "\n - 1 special character",
    example: "I<3Donuts",
    minLength: 8,
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(minLength)
  @MaxLength(maxLength)
  @Matches(new RegExp(`^[A-Za-z\\d${acceptedSymbols}]*$`))
  @Matches(new RegExp(`^(?=(?:.*[A-Z]){${minUppercase},}).+$`))
  @Matches(new RegExp(`^(?=(?:.*[a-z]){${minLowercase},}).+$`))
  @Matches(new RegExp(`^(?=(?:.*[${acceptedSymbols}]){${minSymbols},}).+$`))
  password: string;
}

export default RegisterInputDto;
