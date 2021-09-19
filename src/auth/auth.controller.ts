import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local/local.guard";
import { LoginOutputDto } from "./dto/login.output.dto";
import { LoggedInUser } from "../types/logged-in.user";
import { RegisterInputDto } from "./dto/register.input.dto";
import { Swagger } from "../constants/swagger";
import { LoginInputDto } from "./dto/login.input.dto";

@Controller("auth")
@ApiTags(Swagger.apiTags.auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary:
      "Authenticates a user and returns the access token required to perform further requests",
  })
  @ApiBody({ type: LoginInputDto })
  @ApiCreatedResponse({
    type: LoginOutputDto,
    description: "User is authenticated and the access token returned",
  })
  @ApiUnauthorizedResponse({
    description: "Wrong username or password",
  })
  async login(@Req() { user }: { user: LoggedInUser }): Promise<LoginOutputDto> {
    return this.authService.onLogin(user);
  }

  @Post("register")
  @ApiOperation({
    summary:
      "Registers and authenticates a user," +
      " and returns the access token required to perform further requests",
  })
  @ApiBody({ type: RegisterInputDto })
  @ApiCreatedResponse({
    type: LoginOutputDto,
    description: "User is created, authenticated and the access token returned",
  })
  @ApiBadRequestResponse({
    description: "username already in user",
  })
  async register(@Body() dto: RegisterInputDto): Promise<LoginOutputDto> {
    return this.authService.register(dto);
  }
}

export default AuthController;
