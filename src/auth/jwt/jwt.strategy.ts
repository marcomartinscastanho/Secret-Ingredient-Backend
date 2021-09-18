import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async validate(payload: any) {
    // the return of this function is added in the request under the key "user"
    // and can be accessible in other Guards
    return { _id: payload.sub, role: payload.role };
  }
}

export default JwtStrategy;
