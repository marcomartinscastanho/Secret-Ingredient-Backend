import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CaslModule } from "../casl/casl.module";
import { User, UserSchema } from "./user.model";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [CaslModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

export default UsersModule;
