import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { Role } from "../../types/role.enum";

describe("JWT Strategy", () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it("Should be defined", () => {
    expect(jwtStrategy).toBeDefined();
  });

  it("Should return user id and role if request is valid", async () => {
    const payload = { sub: "1", role: Role.Admin };
    expect(await jwtStrategy.validate(payload)).toStrictEqual({
      _id: "1",
      role: Role.Admin,
    });
  });
});
