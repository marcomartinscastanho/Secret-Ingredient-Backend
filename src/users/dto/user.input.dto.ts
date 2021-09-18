import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import {
  acceptedSymbols,
  maxLength,
  minLength,
  minLowercase,
  minSymbols,
  minUppercase,
} from "../../constants/password.rules";
import { Role } from "../../types/role.enum";

export class UserInputDto {
  @ApiProperty({
    description: "The presentation name of the new User",
    example: "Homer Simpson",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The username of the new User",
    example: "homer",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+([_.-]?[a-zA-Z0-9])*$/, {
    message: "username contains invalid characters",
  })
  username: string;

  @ApiProperty({
    description:
      "The password of the new User. Is must include at least:" +
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
  @Matches(new RegExp(`^[A-Za-z\\d${acceptedSymbols}]*$`), {
    message: "password contains invalid characters",
  })
  @Matches(new RegExp(`^(?=(?:.*[A-Z]){${minUppercase},}).+$`), {
    message: "password muste have 1 or more uppercase characters",
  })
  @Matches(new RegExp(`^(?=(?:.*[a-z]){${minLowercase},}).+$`), {
    message: "password muste have 1 or more lowercase characters",
  })
  @Matches(new RegExp(`^(?=(?:.*[${acceptedSymbols}]){${minSymbols},}).+$`), {
    message: "password muste have 1 or more special characters",
  })
  password: string;

  @ApiProperty({
    description: "The role of the new User",
    enum: Role,
    example: "User",
    type: String,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role, { message: "role must be a value in [User, Admin]" })
  role: Role;
}

export default UserInputDto;
