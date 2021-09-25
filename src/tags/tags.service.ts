import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { paginateQuery } from "../utils/paginate-query";
import { QueryInput } from "../types/query.input.type";
import { Tag, TagDocument } from "./tags.model";
import { TagInputDto } from "./dto/tag.input.dto";

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(dto: TagInputDto): Promise<Tag> {
    const createdTag = new this.tagModel(dto);

    return createdTag.save().catch((e) => {
      /* istanbul ignore next */
      throw new BadRequestException(e.message);
    });
  }

  findTags(queryParams: QueryInput): Promise<Tag[]> {
    const { page, results } = queryParams;

    let query: Query<TagDocument[], TagDocument> = this.tagModel.find();
    query = paginateQuery<TagDocument>(query, page, results);

    return query.sort({ popularity: -1, name: 1 }).exec();
  }

  // TODO: this should return also the ids and names of recipes associated with this tag
  async findOneOrFail(id: string): Promise<Tag> {
    return this.tagModel
      .findById(id)
      .orFail()
      .catch(() => {
        throw new NotFoundException(`Tag with id ${id} not found.`);
      });
  }

  async remove(id: string): Promise<void> {
    await this.tagModel
      .findByIdAndDelete(id)
      .orFail()
      .then(async (tag) => {
        await Promise.all(
          tag.recipes.map(async (recipe) => {
            // FIXME: probably not working
            await recipe.updateOne({ $pull: { tags: tag._id } });
          })
        );
      })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }
}

export default TagsService;
