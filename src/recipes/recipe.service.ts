import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Query } from "mongoose";
import { ObjectId } from "mongodb";
import { RecipeInputDto } from "./dto/recipe.input.dto";
import { Recipe, RecipeDocument } from "./recipe.model";
import { RecipeQueryInput } from "../types/query.input.type";
import { paginateQuery } from "../utils/paginate-query";
import { UsersService } from "../users/users.service";
import { TagsService } from "../tags/tags.service";
import { IngredientsService } from "../ingredients/ingredients.service";
import { Tag } from "../tags/tags.model";
import { RecipeIngredient } from "../types/recipe-ingredient.type";
import { Ingredient } from "../ingredients/ingredients.model";

const strfy = (x: any) => JSON.stringify(x);

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @Inject(IngredientsService) private readonly ingredientsService: IngredientsService,
    @Inject(TagsService) private readonly tagsService: TagsService,
    @Inject(UsersService) private readonly usersService: UsersService
  ) {}
  async create(ownerId: string, dto: RecipeInputDto): Promise<Recipe> {
    const { ingredients, tagIds, ...input } = dto;

    const newRecipe = new this.recipeModel(input);

    // add ingredients
    const recipeIngredients: RecipeIngredient[] = [];
    await Promise.all(
      ingredients.map(async (recipeIngredient) => {
        const { quantity, ingredientId, specification } = recipeIngredient;
        const ingredient = await this.ingredientsService.findOneOrFail(ingredientId);
        recipeIngredients.push({ quantity, ingredient, specification });
      })
    );
    newRecipe.ingredients = recipeIngredients;

    // add tags
    const tags: Tag[] = [];
    await Promise.all(
      tagIds.map(async (tagId) => {
        const tag = await this.tagsService.findOneOrFail(tagId);
        tags.push(tag);
      })
    );
    newRecipe.tags = tags;

    // add owner
    const owner = await this.usersService.findOneOrFail(ownerId);
    newRecipe.owner = owner;

    return newRecipe
      .save()
      .then(async (recipe) => {
        // add the new recipe to each of its tags
        await Promise.all(
          tags.map(async (tag) => {
            await tag.updateOne({ $push: { recipes: recipe._id } });
          })
        );

        // TODO: add the new recipe to each of its ingredients

        // add the new recipe to its owner
        await owner.updateOne({ $push: { recipes: recipe._id } }, { new: true });

        return recipe;
      })
      .catch((e) => {
        /* istanbul ignore next */
        throw new BadRequestException(e.message);
      });
  }

  async findRecipes(queryParams: RecipeQueryInput): Promise<Recipe[]> {
    const { userId, page, results } = queryParams;

    let query: Query<RecipeDocument[], RecipeDocument> = this.recipeModel
      .find()
      .populate("tags", "_id name", Tag.name)
      .populate("ingredients.ingredient", "_id name", Ingredient.name);

    if (userId) {
      await this.usersService.findOneOrFail(userId);
      query = query.where("user").equals(new ObjectId(userId));
    }

    query = paginateQuery<RecipeDocument>(query, page, results);

    return query.sort("title").exec();
  }

  async findOneOrFail(id: string): Promise<Recipe> {
    return this.recipeModel
      .findById(id)
      .orFail()
      .catch(() => {
        throw new NotFoundException(`Recipe with id ${id} not found.`);
      });
  }

  // TODO: continue implementation
  async update(id: string, dto: RecipeInputDto): Promise<Recipe> {
    const { ownerId, tagIds, ingredients, ...delta } = dto;

    console.log("stringified input ownerId:", strfy(ownerId));
    console.log("stringified input tagIds:", strfy(tagIds));
    console.log("stringified input ingredients:", strfy(ingredients));

    const recipe = await this.findOneOrFail(id);

    console.log("stringified saved ownerId", strfy(recipe.owner._id));
    console.log("stringified saved tags", strfy(recipe.tags));
    console.log("stringified saved ingredients", strfy(recipe.ingredients));

    const hasOwnerChanged = strfy(ownerId) !== strfy(recipe.owner._id);
    const haveTagsChanged = strfy(tagIds) !== strfy(recipe.tags);
    const haveIngredientsChanged =
      strfy(ingredients) !==
      strfy(
        recipe.ingredients.map((ing) => {
          ing.quantity, ing.ingredient, ing.specification;
        })
      );

    // update owner
    if (hasOwnerChanged) {
      const newOwner = await this.usersService.findOneOrFail(ownerId);
      recipe.owner = newOwner;
    }

    // update tags
    if (haveTagsChanged) {
    }

    // update ingredients
    if (haveIngredientsChanged) {
    }

    throw new NotImplementedException("Feature not yet implemented");

    recipe
      .update(delta, { runValidators: true })
      .orFail()
      .catch((e) => {
        /* istanbul ignore next */
        throw new BadRequestException(e.message);
      });
  }

  async remove(id: string): Promise<void> {
    await this.recipeModel
      .findByIdAndDelete(id)
      .orFail()
      .then(async (recipe) => {
        await Promise.all(
          recipe.tags.map(async (tag) => {
            // FIXME: not working
            await tag.updateOne({ $pull: { recipes: recipe._id } });
          })
        );

        await recipe.owner.updateOne({ $pull: { recipes: recipe._id } });
      })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }
}

export default RecipesService;
