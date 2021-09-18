/* eslint-disable max-classes-per-file */
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { UserInputDto } from "../users/dto/user.input.dto";
import { User } from "../users/user.model";
import { AuthService } from "./auth.service";
import { Role } from "../types/role.enum";
import { LoggedInUser } from "../types/logged-in.user";

async function cypher(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    class MockJwtService {
      static sign(): string {
        return "some-fake-jwt";
      }
    }

    class MockUsersService {
      static async create(dto: UserInputDto): Promise<User> {
        if (dto.username === "homer") {
          throw new BadRequestException("username already in use");
        }

        const lisa = {
          _id: new ObjectId("606ca9f295e89592ec42e440"),
          name: dto.name,
          username: dto.username,
          role: dto.role,
          password: await cypher(dto.password),
        };

        return lisa as User;
      }

      static async findByNameOrFail(username: string): Promise<User> {
        const user: any = {};

        if (username === "homer") {
          user._id = new ObjectId("606ca36b2ff691770c20884d");
          user.name = "Homer Simpson";
          user.role = Role.Admin;
          // ciphered password of "mamamia!"
          user.password = "$2b$10$zr.2SPnhPMuMCwOM5OhfeuT33rQj1eQ5fZUgZmYwPbR.wt6IWa/mu";
        } else {
          user._id = new ObjectId("606cb3a4b2b68930689c25a7");
          user.name = "Marge Simpson";
          user.role = Role.User;
          // ciphered password of "mamamia!"
          user.password = "$2b$10$zr.2SPnhPMuMCwOM5OhfeuT33rQj1eQ5fZUgZmYwPbR.wt6IWa/mu";
        }

        user.username = username;

        return user as User;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: "UsersService",
          useValue: MockUsersService,
        },
        {
          provide: "JwtService",
          useValue: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("Should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Validate user", () => {
    it("Should return a user object if the password is correct", async () => {
      const authUser = await service.validateUser({ username: "marge", password: "mamamia!" });
      expect(authUser).toBeDefined();
      expect(authUser._id).toBeDefined();
      expect(authUser.username).toBe("marge");
      expect(authUser.role).toBe(Role.User);
      expect(Object.keys(authUser)).not.toContain("password");
    });

    it("Should be rejected if the password is wrong", async () => {
      await expect(
        service.validateUser({ username: "homer", password: "wrong-password" })
      ).rejects.toBeUndefined();
    });
  });

  describe("onLogin", () => {
    it("Should return a jwt on successful login", async () => {
      const user: any = {};
      user.username = "homer";
      user.name = "Homer Simpson";
      user._id = "606ca36b2ff691770c20884d";
      user.role = Role.Admin;

      expect(await service.onLogin(user as LoggedInUser)).toStrictEqual({
        accessToken: "some-fake-jwt",
      });
    });
  });

  describe("Register user", () => {
    it("Should return a user object if register is ok", async () => {
      const registeredUser = await service.register({
        name: "Lisa Simpson",
        username: "lisa",
        password: "#Lisa4President",
      });
      expect(registeredUser).toBeDefined();
      expect(registeredUser.accessToken).toBeDefined();
      expect(Object.keys(registeredUser).length).toBe(1);
    });

    it("Should be rejected if the username already exists", async () => {
      await expect(
        service
          .register({
            name: "Homer Simpson",
            username: "homer",
            password: "I<3Donuts",
          })
          .catch((e) => {
            expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
            expect(e.message).toEqual("username already in use");
            return Promise.reject(e);
          })
      ).rejects.toThrow(HttpException);
    });
  });
});
