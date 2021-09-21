import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, Query } from "mongoose";
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
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @Inject(IngredientsService) private readonly ingredientsService: IngredientsService,
    @Inject(TagsService) private readonly tagsService: TagsService,
    @Inject(UsersService) private readonly usersService: UsersService
  ) {}
  async create(ownerId: string, dto: RecipeInputDto): Promise<Recipe> {
    const { ingredients, tagIds, ...input } = dto;

    const session = await this.connection.startSession();
    session.startTransaction();

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

    await newRecipe
      .save()
      .then(async (recipe) => {
        // add the new recipe to each of its tags
        await Promise.all(
          tags.map(async (tag) => {
            await tag.updateOne({ $push: { recipes: recipe._id } }, { session });
          })
        );

        // add the new recipe to each of its ingredients
        await Promise.all(
          recipeIngredients.map(async (recipeIngredient) => {
            await recipeIngredient.ingredient.updateOne(
              { $push: { recipes: recipe._id } },
              { session }
            );
          })
        );

        // add the new recipe to its owner
        await owner.updateOne({ $push: { recipes: recipe._id } }, { new: true, session });

        await session.commitTransaction();
      })
      .catch((e) => {
        session.abortTransaction();
        throw new BadRequestException(e.message);
      });

    session.endSession();

    return newRecipe;
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

  async update(id: string, dto: RecipeInputDto): Promise<Recipe> {
    const { ownerId, tagIds, ingredients, ...input } = dto;
    let delta: Partial<Recipe> = { ...input };

    const recipe = await this.findOneOrFail(id);

    const hasOwnerChanged = ownerId && strfy(ownerId) !== strfy(recipe.owner._id);
    const haveTagsChanged = strfy(tagIds) !== strfy(recipe.tags);
    const haveIngredientsChanged =
      strfy(ingredients) !==
      strfy(
        recipe.ingredients.map((ing) => {
          ing.quantity, ing.ingredient, ing.specification;
        })
      );

    // > Starting the update transaction
    const session = await this.connection.startSession();
    session.startTransaction();

    // update owner
    if (hasOwnerChanged) {
      const newOwner = await this.usersService.findOneOrFail(ownerId);
      const oldOwner = await this.usersService.findOneOrFail(recipe.owner._id);

      await oldOwner.updateOne({ $pull: { recipes: recipe._id } });
      await newOwner.updateOne({ $push: { recipes: recipe._id } });

      delta = { ...delta, owner: newOwner };
    }

    // update tags
    if (haveTagsChanged) {
      const oldTagIds: string[] = recipe.tags.map((tag) => tag._id);

      const newTags: Tag[] = [];
      await Promise.all(
        tagIds.map(async (tagId) => {
          const tag = await this.tagsService.findOneOrFail(tagId);
          newTags.push(tag);
        })
      );

      // remove recipe from dropped tags
      await Promise.all(
        oldTagIds.map(async (oldTagId) => {
          if (!tagIds.includes(oldTagId)) {
            const oldTag = await this.tagsService.findOneOrFail(oldTagId);
            await oldTag.updateOne({ $pull: { recipes: recipe._id } });
          }
        })
      );

      // add recipe to newly added tags
      await Promise.all(
        tagIds.map(async (newTagId) => {
          if (!oldTagIds.includes(newTagId)) {
            const newTag = await this.tagsService.findOneOrFail(newTagId);
            await newTag.updateOne({ $push: { recipes: recipe._id } });
          }
        })
      );

      delta = { ...delta, tags: newTags };
    }

    // update ingredients
    if (haveIngredientsChanged) {
      const newIngredientIds: string[] = ingredients.map((ing) => ing.ingredientId);
      const oldIngredientIds: string[] = recipe.ingredients.map((ing) => ing.ingredient._id);

      // add ingredients
      const newRecipeIngredients: RecipeIngredient[] = [];
      await Promise.all(
        ingredients.map(async (recipeIngredient) => {
          const { quantity, ingredientId, specification } = recipeIngredient;
          const ingredient = await this.ingredientsService.findOneOrFail(ingredientId);
          newRecipeIngredients.push({ quantity, ingredient, specification });
        })
      );

      // remove recipe from dropped ingredients
      await Promise.all(
        oldIngredientIds.map(async (oldIngredientId) => {
          if (!newIngredientIds.includes(oldIngredientId)) {
            const oldIngredient = await this.ingredientsService.findOneOrFail(oldIngredientId);
            await oldIngredient.updateOne({ $pull: { recipes: recipe._id } });
          }
        })
      );

      // add recipe to newly added ingredients
      await Promise.all(
        newIngredientIds.map(async (newIngredientId) => {
          if (!oldIngredientIds.includes(newIngredientId)) {
            const newIngredient = await this.ingredientsService.findOneOrFail(newIngredientId);
            await newIngredient.updateOne({ $pull: { recipes: recipe._id } });
          }
        })
      );

      delta = { ...delta, ingredients: newRecipeIngredients };
    }

    recipe
      .updateOne(delta, { runValidators: true })
      .orFail()
      .catch((e) => {
        session.abortTransaction();
        throw new BadRequestException(e.message);
      });

    await session.commitTransaction();
    session.endSession();

    return recipe;
  }

  async remove(id: string): Promise<void> {
    await this.recipeModel
      .findByIdAndDelete(id)
      .orFail()
      .then(async (recipe) => {
        // remove recipe from all its tags
        await Promise.all(
          recipe.tags.map(async (recipeTag) => {
            const tag = await this.tagsService.findOneOrFail(recipeTag._id);
            await tag.updateOne({ $pull: { recipes: recipe._id } });
          })
        );

        // remove recipe from all its ingredients
        await Promise.all(
          recipe.ingredients.map(async (recipeIngredient) => {
            const ingredient = await this.ingredientsService.findOneOrFail(
              recipeIngredient.ingredient._id
            );
            await ingredient.updateOne({ $pull: { recipes: recipe._id } });
          })
        );

        // remove recipe from user
        const owner = await this.usersService.findOneOrFail(recipe.owner._id);
        await owner.updateOne({ $pull: { recipes: recipe._id } });
      })
      .catch((e) => {
        throw new NotFoundException(e.message);
      });
  }
}

export default RecipesService;
