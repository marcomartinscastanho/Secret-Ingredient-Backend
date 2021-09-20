/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoggedInUser } from "src/types/logged-in-user.type";
import { UsersService } from "../users/users.service";
import { LoginInputDto } from "./dto/login.input.dto";
import { LoginOutputDto } from "./dto/login.output.dto";
import { RegisterInputDto } from "./dto/register.input.dto";
import { Role } from "../types/role.enum";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(dto: LoginInputDto): Promise<LoggedInUser> {
    const user = await this.usersService.findByNameOrFail(dto.username);

    return bcrypt.compare(dto.password, user.password).then((result) => {
      if (result) {
        const { _id, username, role } = user;
        return { _id: `${_id}`, username, role };
      }
      return Promise.reject();
    });
  }

  async onLogin(user: LoggedInUser): Promise<LoginOutputDto> {
    const payload = { username: user.username, sub: user._id, role: user.role };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterInputDto): Promise<LoginOutputDto> {
    const newUser = await this.usersService.create({ ...dto, role: Role.User });

    const payload = { username: newUser.username, sub: newUser._id, role: newUser.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

export default AuthService;
