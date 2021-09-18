import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "../../users/user.model";
import { LoginInputDto } from "../dto/login.input.dto";
import { Role } from "../../types/role.enum";
import { LocalStrategy } from "./local.strategy";

describe("Local Strategy", () => {
  let localStrategy: LocalStrategy;

  beforeEach(async () => {
    class MockAuthService {
      static async validateUser(dto: LoginInputDto): Promise<Partial<User>> {
        if (dto.password !== "correct-password") {
          return Promise.reject();
        }

        const user: any = {};
        user.username = dto.username;
        user.name = "A User";
        user.role = Role.Admin;

        return user;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: "AuthService",
          useValue: MockAuthService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it("Should be defined", () => {
    expect(localStrategy).toBeDefined();
  });

  describe("Validate user", () => {
    it("Should return a user object if valid username/password", async () => {
      const user = await localStrategy.validate("user", "correct-password");
      expect(user).toBeDefined();
      expect(user.username).toBe("user");
      expect(user.name).toBe("A User");
      expect(user.role).toBe(Role.Admin);
      expect(Object.keys(user)).not.toContain("password");
    });

    it("should throw an exception if the password is wrong", async () => {
      await expect(
        localStrategy.validate("user", "wrong-password").catch((e) => {
          expect(e.status).toEqual(HttpStatus.UNAUTHORIZED);
          expect(e.errorCode).toEqual("auth/wrong-credentials");
          return Promise.reject(e);
        })
      ).rejects.toThrow();
    });
  });
});
