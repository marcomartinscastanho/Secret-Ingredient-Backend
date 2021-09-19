import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ObjectId } from "mongodb";
import { CaslModule } from "../../casl/casl.module";
import { Role } from "../../types/role.enum";
import { UpdateUserInputDto } from "../dto/update.user.input.dto";
import { UserInputDto } from "../dto/user.input.dto";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";

const mockUser = {
  _id: new ObjectId("606ca9f295e89592ec42e440"),
  username: "marge",
  name: "Marge Simpson",
  role: Role.Admin,
  password: "#MargeRules",
};

describe("User Controller", () => {
  let usersController: UsersController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CaslModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn(() => Promise.resolve(mockUser)),
            findUsers: jest.fn(() => Promise.resolve([mockUser])),
            findOneOrFail: jest.fn(() => Promise.resolve(mockUser)),
            update: jest.fn(() => Promise.resolve(mockUser)),
            remove: jest.fn(() => Promise.resolve()),
          }),
        },
      ],
    }).compile();

    usersController = module.get(UsersController);
  });

  it("Controller should be created", () => {
    expect(usersController).toBeDefined();
  });

  describe("POST /users", () => {
    const mockUserDtoInput: UserInputDto = {
      username: "marge",
      name: "Marge Simpson",
      role: Role.Admin,
      password: "#MargeRules",
    };

    it("Should create and save the new user and return it", async () => {
      const created = await usersController.create(mockUserDtoInput);
      expect(created.id).toBeDefined();
      expect(created.username).toBe("marge");
      expect(created.name).toBe("Marge Simpson");
      expect(created.role).toBe(Role.Admin);
      expect(Object.keys(created)).not.toContain("password");
    });
  });

  describe("GET /users", () => {
    it("Should return all users", async () => {
      const users = await usersController.findAll({});
      expect(users.data.length).toBe(1);
      expect(users.page).toBe(1);
      expect(users.results).toBe(1);
      expect(users.data[0].id).toBeDefined();
      expect(users.data[0].username).toBe("marge");
      expect(Object.keys(users.data[0])).not.toContain("password");
    });

    it("Should return all users, defining page", async () => {
      const users = await usersController.findAll({ page: 1 });
      expect(users.data.length).toBe(1);
      expect(users.page).toBe(1);
      expect(users.results).toBe(1);
      expect(users.data[0].id).toBeDefined();
      expect(users.data[0].username).toBe("marge");
      expect(Object.keys(users.data[0])).not.toContain("password");
    });

    it("Should return all users, defining results", async () => {
      const users = await usersController.findAll({ results: 5 });
      expect(users.data.length).toBe(1);
      expect(users.page).toBe(1);
      expect(users.results).toBe(1);
      expect(users.data[0].id).toBeDefined();
      expect(users.data[0].username).toBe("marge");
      expect(Object.keys(users.data[0])).not.toContain("password");
    });
  });

  describe("GET /users/:id", () => {
    it("Should allow an Admin to get a user", async () => {
      const user = await usersController.findById(
        { user: { _id: "1", username: "homer", role: Role.Admin } },
        "not-relevant"
      );
      expect(user.id).toBeDefined();
      expect(user.username).toBe("marge");
      expect(user.name).toBe("Marge Simpson");
      expect(user.role).toBe(Role.Admin);
      expect(Object.keys(user)).not.toContain("password");
    });

    it("Should allow a User to get itself", async () => {
      const user = await usersController.findById(
        { user: { _id: "606ca9f295e89592ec42e440", username: "marge", role: Role.User } },
        "606ca9f295e89592ec42e440"
      );
      expect(user.id).toBeDefined();
      expect(user.username).toBe("marge");
      expect(user.name).toBe("Marge Simpson");
      expect(user.role).toBe(Role.Admin);
      expect(Object.keys(user)).not.toContain("password");
    });

    it("Should not allow a User to get another user", async () => {
      await expect(
        usersController
          .findById({ user: { _id: "1", username: "bart", role: Role.User } }, "not-relevant")
          .catch((e) => {
            expect(e.status).toEqual(HttpStatus.FORBIDDEN);
            expect(e.message).toEqual("Forbidden");
            return Promise.reject(e);
          })
      ).rejects.toThrow(HttpException);
    });
  });

  describe("PATCH /users/:d", () => {
    const dto: UpdateUserInputDto = {
      username: "marge",
      name: "Marge Simpson",
      role: Role.Admin,
      password: "#MargeRules",
    };

    it("Should update a user and return it", async () => {
      const updated = await usersController.update("2", dto);
      expect(updated.id).toBeDefined();
      expect(updated.username).toBe("marge");
      expect(updated.name).toBe("Marge Simpson");
      expect(updated.role).toBe(Role.Admin);
      expect(Object.keys(updated)).not.toContain("password");
    });
  });

  describe("DELETE /users/:id", () => {
    it("Should allow to delete a user", async () => {
      await expect(usersController.remove("not-relevant")).resolves.not.toThrow(HttpException);
    });
  });
});
