import { Test, TestingModule } from "@nestjs/testing";
import { LoggedInUser } from "../types/logged-in.user";
import { AuthController } from "./auth.controller";
import { RegisterInputDto } from "./dto/register.input.dto";
import { Role } from "../types/role.enum";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    class MockAuthService {
      static register() {
        return { accessToken: "some-jwt-token" };
      }

      static onLogin() {
        return { accessToken: "another-jwt-token" };
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: "AuthService",
          useValue: MockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("Should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("Should register", async () => {
    const user: RegisterInputDto = {
      username: "homer",
      name: "Homer Simpson",
      password: "I<3Donuts",
    };

    expect(await controller.register(user)).toStrictEqual({
      accessToken: "some-jwt-token",
    });
  });

  it("Should login", async () => {
    const user: LoggedInUser = {
      username: "homer",
      name: "Homer Simpson",
      role: Role.Admin,
      _id: "1",
    };

    const req: any = { user };

    expect(await controller.login(req)).toStrictEqual({
      accessToken: "another-jwt-token",
    });
  });
});
