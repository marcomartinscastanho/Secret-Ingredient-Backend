import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { paginateQuery } from "../utils/paginate-query";
import { QueryInput } from "../types/query.input.type";
import { IngredientInputDto } from "./dto/ingredient.input.dto";
import { Ingredient, IngredientDocument } from "./ingredients.model";

@Injectable()
export class IngredientsService {
  constructor(@InjectModel(Ingredient.name) private ingredientModel: Model<IngredientDocument>) {}

  async create(dto: IngredientInputDto): Promise<Ingredient> {
    const createdIngredient = new this.ingredientModel(dto);

    return createdIngredient.save().catch((e) => {
      /* istanbul ignore next */
      throw new BadRequestException(e.message);
    });
  }

  findIngredients(queryParams: QueryInput): Promise<Ingredient[]> {
    const { page, results } = queryParams;

    let query: Query<IngredientDocument[], IngredientDocument> = this.ingredientModel.find();
    query = paginateQuery<IngredientDocument>(query, page, results);

    return query.sort("-popularity").exec();
  }

  // TODO: this should return also the ids and names of recipes associated with this ingredient
  async findOneOrFail(id: string): Promise<Ingredient> {
    return this.ingredientModel
      .findById(id)
      .orFail()
      .catch(() => {
        throw new NotFoundException(`Ingredient with id ${id} not found.`);
      });
  }

  async remove(id: string): Promise<void> {
    const ingredient = await this.findOneOrFail(id);
    if (ingredient.recipes.length > 0) {
      throw new MethodNotAllowedException(
        "Cannot delete Ingredients that are being used in Recipes"
      );
    }

    await this.ingredientModel
      .findByIdAndDelete(id)
      .orFail()
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }
}

export default IngredientsService;
