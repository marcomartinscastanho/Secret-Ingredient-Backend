import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import * as bcrypt from "bcrypt";
import { Role } from "../types/role.enum";
import { UserInputDto } from "./dto/user.input.dto";
import { User, UserDocument } from "./user.model";
import { QueryInput } from "../types/query.input.type";
import { paginateQuery } from "../utils/paginate-query";
import { UpdateUserInputDto } from "./dto/update.user.input.dto";

async function cypher(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /* istanbul ignore next */
  onModuleInit() {
    this.findByNameOrFail("admin").catch(async () => {
      await this.create({
        username: "admin",
        name: "Default Admin",
        role: Role.Admin,
        password: "#SecrIng21",
      });
    });
  }

  async create(dto: UserInputDto): Promise<User> {
    const { password, ...input } = dto;

    const createdUser = new this.userModel(input);
    createdUser.password = await cypher(password);

    return createdUser.save().catch((e) => {
      /* istanbul ignore next */
      throw new BadRequestException(e.message);
    });
  }

  findUsers(queryParams: QueryInput): Promise<User[]> {
    const { page, results } = queryParams;

    let query: Query<UserDocument[], UserDocument> = this.userModel.find();
    query = paginateQuery<UserDocument>(query, page, results);

    return query.sort("-createdAt").exec();
  }

  async findOneOrFail(id: string): Promise<User> {
    return this.userModel
      .findById(id)
      .orFail()
      .catch(() => {
        throw new NotFoundException(`User with id ${id} not found.`);
      });
  }

  async findByNameOrFail(username: string): Promise<User> {
    return this.userModel
      .findOne({ username })
      .orFail()
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }

  async update(id: string, dto: UpdateUserInputDto): Promise<User> {
    const { password, ...input } = dto;
    let delta: Partial<User> = { ...input };

    /* istanbul ignore else */
    if (password) {
      delta = { ...delta, password: await cypher(password) };
    }

    return this.userModel
      .findByIdAndUpdate(id, delta, { new: true, runValidators: true })
      .orFail()
      .catch((e) => {
        throw new BadRequestException(e.message);
      });
  }

  async remove(id: string): Promise<void> {
    await this.userModel
      .findByIdAndDelete(id)
      .orFail()
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }
}

export default UsersService;
