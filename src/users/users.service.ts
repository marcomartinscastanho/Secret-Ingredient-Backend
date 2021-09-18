import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "../types/role.enum";
import { UserInputDto } from "./dto/user.input.dto";
import { User, UserDocument } from "./user.model";

@Injectable()
export class UsersService /**implements OnModuleInit*/ {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //   /* istanbul ignore next */
  //   onModuleInit() {
  //     this.findByNameOrFail("admin").catch(async () => {
  //       await this.create({
  //         username: "admin",
  //         name: "Default Admin",
  //         role: Role.Admin,
  //         password: "#SecrIng21",
  //       });
  //     });
  //   }

  //   async create(dto: UserInputDto): Promise<User> {
  //     const { password, ...input } = dto;

  //     const createdUser = new this.userModel(input);
  //     createdUser.password = await cypher(password);

  //     return createdUser.save().catch((e) => {
  //       /* istanbul ignore next */
  //       throw new BadRequestException(e.message);
  //     });
  //   }
}
export default UsersService;
