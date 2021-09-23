import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { RecipeQueryInput } from "../types/query.input.type";
import { Swagger } from "../constants/swagger";
import { daoToDto } from "./dto/recipe.dao.to.dto";
import { RecipeInputDto } from "./dto/recipe.input.dto";
import { RecipeOutputDto } from "./dto/recipe.output.dto";
import { RecipesService } from "./recipe.service";
import { Paginated } from "../types/paginated.type";
import { Role } from "../types/role.enum";
import { LoggedInUser } from "../types/logged-in-user.type";
import { JwtAuthGuard } from "../auth/jwt/jwt.guard";
import { PoliciesGuard } from "../policies/policies.guard";
import { CheckPolicies } from "../policies/policies.decorator";
import {
  CreateRecipePolicyHandler,
  ReadRecipePolicyHandler,
  UpdateRecipePolicyHandler,
  DeleteRecipePolicyHandler,
} from "../policies/policies.handlers";

@UseGuards(JwtAuthGuard)
@Controller("recipes")
@ApiTags(Swagger.apiTags.recipes)
@ApiBearerAuth("accessToken")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  private owner = (requester: LoggedInUser, createforUserId: string): string => {
    if (!createforUserId) {
      // if the userId was not specified, use requester id
      return requester._id;
    }

    if (requester._id === createforUserId) {
      // if the userId was specified and it's the requester, use either
      return requester._id;
    }

    // if the userId was specified and it's not the requester
    if (requester.role === Role.Admin) {
      // if the requester is Admin, create recipe for the user specified
      return createforUserId;
    }

    // if the requester is not Admin, then this is Forbidden
    throw new ForbiddenException("You have no permission to create a recipe for another user");
  };

  // check if the user is the owner of the recipe
  // or if the user has permission to access a recipe of another user (only Admins can)
  private checkRecipeAccessPermission = async (
    requester: LoggedInUser,
    recipeId: string
  ): Promise<void> => {
    if (requester.role === Role.User) {
      const recipe = await this.recipesService.findOneOrFail(recipeId);
      if (requester._id !== recipe.owner._id.toString()) {
        throw new ForbiddenException("You have no permission to access a recipe of another user");
      }
    }
  };

  private static checkRecipesListAccessPermission = (
    requester: LoggedInUser,
    userParamId: string
  ): void => {
    if (requester.role === Role.User) {
      // if requester is Normal User trying to access all existing recipes, forbidden
      if (!userParamId) {
        throw new ForbiddenException("You have no permission to access all existing recipes");
      }

      // if requester is Normal User trying to access list of recipes of another user, forbidden
      if (requester._id !== userParamId) {
        throw new ForbiddenException("You have no permission to the recipes of another user");
      }
    }
  };

  // check if user has permission to access the recipe
  // AND if the user has permission to modify the recipe's owner
  private checkRecipeUpdatePermission = async (
    requester: LoggedInUser,
    recipeId: string,
    updateDto: RecipeInputDto
  ): Promise<void> => {
    await this.checkRecipeAccessPermission(requester, recipeId);

    if (requester.role === Role.User) {
      if (updateDto.ownerId) {
        if (updateDto.ownerId !== requester._id) {
          throw new ForbiddenException("You have no permission to assign a recipe to another user");
        }
      }
    }
  };

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateRecipePolicyHandler())
  @ApiOperation({
    summary: "Creates a new recipe",
  })
  @ApiCreatedResponse({
    type: RecipeOutputDto,
    description: "Recipe is created and its properties are returned",
  })
  @ApiUnauthorizedResponse({
    description: "Only logged in users can perform this request",
  })
  @ApiForbiddenResponse({
    description: "Users cannot create Recipes for other users",
  })
  @ApiBadRequestResponse({
    description: "Input doesn't match the request criteria",
  })
  @ApiNotFoundResponse({
    description: "One of:\n - User not found\n - Tag not found\n - Ingredient not found",
  })
  async create(
    @Request() { user }: { user: LoggedInUser },
    @Body() createRecipeDto: RecipeInputDto
  ): Promise<RecipeOutputDto> {
    const ownerId = this.owner(user, createRecipeDto.ownerId);
    return daoToDto(await this.recipesService.create(ownerId, createRecipeDto));
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadRecipePolicyHandler())
  @ApiOperation({
    summary: "Get the list of existing recipes",
  })
  @ApiQuery({
    name: "tagId",
    type: String,
    description: "Get list of recipes associated with a give tag",
    required: false,
  })
  @ApiQuery({
    name: "ingredientId",
    type: String,
    description: "Get list of recipes that use a given ingredient",
    required: false,
  })
  @ApiQuery({
    name: "userId",
    type: String,
    description: "Get list of recipes belonging to a given user",
    required: false,
  })
  @ApiQuery({
    name: "page",
    type: Number,
    description: "Pagination - specify a page\nIf set, results defaults to 10",
    required: false,
  })
  @ApiQuery({
    name: "results",
    type: Number,
    description: "Pagination - the number of results to show",
    required: false,
  })
  @ApiOkResponse({
    type: [RecipeOutputDto],
    description: "List of existing recipes",
  })
  @ApiUnauthorizedResponse({
    description: "Only logged in users can perform this request",
  })
  @ApiForbiddenResponse({
    description:
      "One of:\n" +
      " - Normal Users have no permission to access all existing recipes\n" +
      " - Normal Users have no permission to access the recipes of another user",
  })
  async findAll(
    @Request() { user }: { user: LoggedInUser },
    @Query() query: RecipeQueryInput
  ): Promise<Paginated<RecipeOutputDto>> {
    RecipesController.checkRecipesListAccessPermission(user, query.userId);
    const recipes = await this.recipesService.findRecipes(query);

    return {
      data: recipes.map((recipe) => daoToDto(recipe)),
      page: query.page ? Number(query.page) : 1,
      results: recipes.length,
    };
  }

  @Get(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadRecipePolicyHandler())
  @ApiOperation({
    summary: "Gets the properties of a given recipe",
  })
  @ApiParam({
    name: "id",
    description: "id of the recipe",
    type: String,
  })
  @ApiOkResponse({
    type: RecipeOutputDto,
    description: "The properties of the recipe",
  })
  @ApiUnauthorizedResponse({
    description: "Only logged in users can perform this request",
  })
  @ApiForbiddenResponse({
    description: "Normal Users cannot access recipes they don't own",
  })
  @ApiNotFoundResponse({
    description: "Recipe not found",
  })
  async findById(
    @Request() { user }: { user: LoggedInUser },
    @Param("id") id: string
  ): Promise<RecipeOutputDto> {
    await this.checkRecipeAccessPermission(user, id);
    return daoToDto(await this.recipesService.findOneOrFail(id));
  }

  @Patch(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateRecipePolicyHandler())
  @ApiOperation({
    summary: "Updates the properties of a given recipe",
  })
  @ApiParam({
    name: "id",
    description: "id of the recipe",
    type: String,
  })
  @ApiOkResponse({
    type: RecipeOutputDto,
    description: "The new properties of the updated recipe",
  })
  @ApiUnauthorizedResponse({
    description: "Only logged in users can perform this request",
  })
  @ApiForbiddenResponse({
    description:
      "One of:\n" +
      " - Normal Users cannot update recipes they don't own\n" +
      " - Normal Users cannot assign a recipe they own to another user",
  })
  @ApiBadRequestResponse({
    description: "Input doesn't match the request criteria",
  })
  @ApiNotFoundResponse({
    description:
      "One of:\n - Recipe not found\n - New owner not found\n - Tag not found\n - Ingredient not found",
  })
  async update(
    @Request() { user }: { user: LoggedInUser },
    @Param("id") id: string,
    @Body() dto: RecipeInputDto
  ): Promise<RecipeOutputDto> {
    await this.checkRecipeUpdatePermission(user, id, dto);
    return daoToDto(await this.recipesService.update(id, dto));
  }

  @Delete(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteRecipePolicyHandler())
  @ApiOperation({
    summary: "Deletes a given recipe",
  })
  @ApiParam({
    name: "id",
    description: "id of the recipe",
    type: String,
  })
  @ApiOkResponse({
    description: "Recipe is deleted",
    type: null,
  })
  @ApiUnauthorizedResponse({
    description: "Only logged in users can perform this request",
  })
  @ApiForbiddenResponse({
    description: "Normal Users cannot delete recipes they don't own",
  })
  @ApiNotFoundResponse({
    description: "Recipe not found",
  })
  async remove(
    @Request() { user }: { user: LoggedInUser },
    @Param("id") id: string
  ): Promise<void> {
    await this.checkRecipeAccessPermission(user, id);
    await this.recipesService.remove(id);
  }
}

export default RecipesController;
