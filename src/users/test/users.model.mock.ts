/* eslint-disable max-classes-per-file */
import { NotFoundException } from "@nestjs/common";
import { UserInputDto } from "../dto/user.input.dto";
import { Role } from "../../types/role.enum";

export class MockModel {
  _id?: string;

  name?: string;

  username?: string;

  password?: string;

  role?: Role;

  searchResult?: MockModel | Array<MockModel> = undefined;

  constructor(user: Partial<UserInputDto>) {
    this._id = "1";
    this.name = user.name;
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
  }

  static create(entityLike: MockModel): MockModel {
    return new MockModel(entityLike);
  }

  async save(): Promise<MockModel> {
    return this;
  }

  sort(): MockModel {
    return this;
  }

  static of(opts: UserInputDto): MockModel {
    return new MockModel(opts);
  }

  async exec() {
    if (this.searchResult === undefined) {
      return Promise.reject(this.searchResult);
    }

    return Promise.resolve(this.searchResult);
  }

  async orFail() {
    if (this.searchResult === undefined) {
      return Promise.reject(NotFoundException);
    }

    return Promise.resolve(this.searchResult);
  }

  static findOne(conditions: Partial<MockModel>) {
    if (conditions.username === "homer" || conditions._id === "1") {
      const result = MockModel.of({
        name: "Homer Simpson",
        username: "homer",
        role: Role.Admin,
        password: "iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g",
      });

      result.searchResult = result;
      return result;
    }

    const result = MockModel.of({
      name: "",
      username: "",
      role: Role.User,
      password: "",
    });

    result.searchResult = undefined;

    return result;
  }

  static findById(id: string) {
    if (id === "1") {
      const result = MockModel.of({
        name: "Homer Simpson",
        username: "homer",
        role: Role.Admin,
        password: "iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g",
      });
      result.searchResult = result;
      return result;
    }

    if (id === "7") {
      const result = MockModel.of({
        name: "Bart Simpson",
        username: "bart",
        role: Role.User,
        password: "iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g",
      });
      result.searchResult = result;
      return result;
    }

    if (id === "9") {
      const result = MockModel.of({
        name: "Marge Simpson",
        username: "marge",
        role: Role.Admin,
        password: "dsgqoubvpuvbadvqoifoifenbq943th0f0iebf03bvav",
      });
      result.searchResult = result;
      return result;
    }

    const result = MockModel.of({
      name: "",
      username: "",
      role: Role.User,
      password: "",
    });

    result.searchResult = undefined;

    return result;
  }

  static find(conditions: Partial<MockModel>) {
    if (conditions === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const builder = MockRepositoryBuilder.getInstance();
      const result = MockModel.of({
        name: "",
        username: "",
        role: Role.User,
        password: "",
      });
      result.searchResult = [
        builder
          .withName("Homer Simpson")
          .withUsername("homer")
          .withRole(Role.Admin)
          .withPassword("iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g")
          .build(),
        builder
          .withName("Bart Simpson")
          .withUsername("bart")
          .withRole(Role.User)
          .withPassword("iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g")
          .build(),
      ];

      return result;
    }

    if (conditions.name === "Homer") {
      const result = MockModel.of({
        name: "Homer Simpson",
        username: "homer",
        role: Role.Admin,
        password: "iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g",
      });
      result.searchResult = [result];
      return result;
    }

    const result = MockModel.of({
      name: "",
      username: "",
      role: Role.User,
      password: "",
    });

    result.searchResult = undefined;
    return result;
  }

  static findByIdAndUpdate(id: string, conditions: Partial<MockModel>) {
    if (id === "7") {
      const bart = MockModel.of({
        name: "Bart Simpson",
        username: "bart",
        role: Role.User,
        password: "iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g",
      });

      Object.assign(bart, conditions);

      bart.searchResult = bart;

      return bart;
    }

    const result = MockModel.of({
      name: "",
      username: "",
      role: Role.User,
      password: "",
    });

    result.searchResult = undefined;
    return result;
  }

  static findByIdAndDelete(id: string) {
    if (id === "1") {
      const result = MockModel.of({
        name: "Homer Simpson",
        username: "homer",
        role: Role.Admin,
        password: "iafo0323tffq0n20g-1g0enif0q250834fq0v0q34g",
      });
      result.searchResult = result;
      return result;
    }

    const result = MockModel.of({
      name: "",
      username: "",
      role: Role.User,
      password: "",
    });

    result.searchResult = undefined;
    return result;
  }
}

export class MockRepositoryBuilder {
  private static instance: MockRepositoryBuilder | undefined = undefined;

  private user: any = {};

  static getInstance(): MockRepositoryBuilder {
    if (!MockRepositoryBuilder.instance) {
      MockRepositoryBuilder.instance = new MockRepositoryBuilder();
    }

    return MockRepositoryBuilder.instance;
  }

  withName(name: string): MockRepositoryBuilder {
    this.user.name = name;
    return this;
  }

  withUsername(username: string): MockRepositoryBuilder {
    this.user.username = username;
    return this;
  }

  withPassword(password: string): MockRepositoryBuilder {
    this.user.password = password;
    return this;
  }

  withRole(role: string): MockRepositoryBuilder {
    this.user.role = role;
    return this;
  }

  build(): MockModel {
    return MockModel.of(this.user);
  }
}

export default MockModel;
