import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LoggedInUser } from "../../types/logged-in-user.type";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<LoggedInUser> {
    return this.authService.validateUser({ username, password }).catch(() => {
      throw new UnauthorizedException();
    });
  }
}

export default LocalStrategy;
