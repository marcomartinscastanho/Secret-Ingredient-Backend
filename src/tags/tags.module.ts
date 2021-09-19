import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CaslModule } from "../casl/casl.module";
import { TagsController } from "./tags.controller";
import { Tag, TagSchema } from "./tags.model";
import { TagsService } from "./tags.service";

@Module({
  imports: [CaslModule, MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  providers: [TagsService],
  controllers: [TagsController],
  exports: [TagsService],
})
export class TagsModule {}

export default TagsModule;
