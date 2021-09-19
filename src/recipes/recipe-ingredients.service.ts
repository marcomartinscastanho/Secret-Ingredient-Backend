import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { paginateQuery } from "../utils/paginate-query";
import { RecipeIngredientsQueryInput } from "../types/query.input.type";
import { RecipeIngredientInputDto } from "./dto/recipe-ingredient.input.dto";
import { RecipeIngredient, RecipeIngredientDocument } from "./recipe-ingredients.model";
import { IngredientsService } from "../ingredients/ingredients.service";

@Injectable()
export class RecipeIngredientsService {
  constructor(
    @InjectModel(RecipeIngredient.name)
    private recipeIngredientModel: Model<RecipeIngredientDocument>,
    @Inject(IngredientsService) private readonly ingredientsService: IngredientsService
  ) {}

  async create(dto: RecipeIngredientInputDto): Promise<RecipeIngredient> {
    const newRecipeIngredient = new this.recipeIngredientModel(dto);
    const ingredient = await this.ingredientsService.findOneOrFail(dto.ingredientId);
    // TODO: uncomment once Recipes exists
    // const recipe = await this.recipesService.findOneOrFail(dto.recipeId);
    newRecipeIngredient.ingredient = ingredient;
    // newRecipeIngredient.recipe = recipe;

    return newRecipeIngredient
      .save()
      .then(async (recipeIngredient) => {
        // TODO: uncomment once Recipes exists
        // await recipe.updateOne({ $push: { ingredients: recipeIngredient._id } });

        return recipeIngredient;
      })
      .catch((e) => {
        /* istanbul ignore next */
        throw new BadRequestException(e.message);
      });
  }

  findRecipeIngredients(queryParams: RecipeIngredientsQueryInput): Promise<RecipeIngredient[]> {
    const { recipeId, page, results } = queryParams;

    let query: Query<RecipeIngredientDocument[], RecipeIngredientDocument> =
      this.recipeIngredientModel.find();

    // TODO: uncomment once Recipe exists
    // if (recipeId) {
    //   await this.recipesService.findOneOrFail(recipeId);
    //   query = query.where("recipe").equals(new ObjectId(recipeId));
    // }
    query = paginateQuery<RecipeIngredientDocument>(query, page, results);

    return query.sort("-createdAt").exec(); // FIXME: change to id
  }

  async remove(id: string): Promise<void> {
    await this.recipeIngredientModel
      .findByIdAndDelete(id)
      .orFail()
      .then(async (recipeIngredient) => {
        // TODO: uncomment once Recipe exists
        // const recipe = await this.recipesService.findOneOrFail(recipeIngredient.recipe._id);
        // await recipe.updateOne({ $pull: { ingredients: recipeIngredient._id } });
      })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }
}

export default RecipeIngredientsService;
