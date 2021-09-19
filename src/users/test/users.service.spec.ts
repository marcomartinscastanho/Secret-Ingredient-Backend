import { HttpException, HttpStatus } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { Role } from "../../types/role.enum";
import { UpdateUserInputDto } from "../dto/update.user.input.dto";
import { User } from "../user.model";
import { UsersService } from "../users.service";
import { MockModel } from "./users.model.mock";

function passwordsMatch(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

describe("User Service", () => {
  let service: UsersService;

  beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = testModule.get<UsersService>(UsersService);
  });

  it("Service should be created", () => {
    expect(service).toBeDefined();
  });

  describe("Create", () => {
    it("Should allow to create a new user", async () => {
      const created = await service.create({
        name: "Maggie Simpson",
        username: "maggie",
        role: Role.User,
        password: "#Maggie3",
      });

      expect(created.name).toBe("Maggie Simpson");
      expect(created.username).toBe("maggie");
      expect(created.role).toBe(Role.User);
      expect(await passwordsMatch("#Maggie3", created.password)).toBe(true);
    });
  });

  describe("Find All", () => {
    it("Should get the list of all users", async () => {
      const users = await service.findUsers({});
      expect(users).toBeDefined();
      expect(users.length).toBe(2);
      const usernames: string[] = [];
      users.forEach((user) => {
        usernames.push(user.username);
      });

      expect(usernames).toContain("homer");
      expect(usernames).toContain("bart");
    });
  });

  describe("Find One Or Fail", () => {
    it("Should get a user by its id", async () => {
      const user = await service.findOneOrFail("1");
      expect(user).toBeDefined();
      expect(user.username).toBe("homer");
      expect(user.name).toBe("Homer Simpson");
    });

    it("Should return error if user does not exist", async () => {
      await expect(
        service.findOneOrFail("1906").catch((e) => {
          expect(e.status).toEqual(HttpStatus.NOT_FOUND);
          expect(e.message).toEqual("User with id 1906 not found.");
          return Promise.reject(e);
        })
      ).rejects.toThrow(HttpException);
    });
  });

  describe("Find By Name Or Fail", () => {
    it("Should get a user by its name", async () => {
      const user = await service.findByNameOrFail("homer");
      expect(user).toBeDefined();
      expect(user.username).toBe("homer");
      expect(user.name).toBe("Homer Simpson");
    });

    it("Should return error if user does not exist", async () => {
      await expect(
        service.findByNameOrFail("maude.flanders").catch((e) => {
          expect(e.status).toEqual(HttpStatus.NOT_FOUND);
          expect(e.message).toEqual("Not Found");
          return Promise.reject(e);
        })
      ).rejects.toThrow(HttpException);
    });
  });

  describe("Update", () => {
    const id = "7";
    const input: UpdateUserInputDto = {
      username: "bart",
      name: "Sir Bart Simpson",
      password: "#BartRulez",
      role: Role.Admin,
    };

    it("Should update a user", async () => {
      const updated = await service.update(id, input);
      expect(updated.username).toBe("bart");
      expect(updated.name).toBe("Sir Bart Simpson");
      expect(await passwordsMatch(input.password, updated.password)).toBe(true);
      expect(updated.role).toBe(Role.Admin);
    });

    it("Should return error if trying to update a nonexistent user", async () => {
      await expect(
        service.update("1906", input).catch((e) => {
          expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
          expect(e.message).toBe("Bad Request");
          return Promise.reject(e);
        })
      ).rejects.toThrow(HttpException);
    });
  });

  describe("Remove", () => {
    it("Should remove a user by its id", async () => {
      await expect(service.remove("1")).resolves.not.toThrow(HttpException);
    });

    it("Should return error if user does not exist", async () => {
      await expect(
        service.remove("1906").catch((e) => {
          expect(e.status).toEqual(HttpStatus.NOT_FOUND);
          expect(e.message).toEqual("Not Found");
          return Promise.reject(e);
        })
      ).rejects.toThrow(HttpException);
    });
  });
});
