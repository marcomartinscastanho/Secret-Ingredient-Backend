import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
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
import { Swagger } from "../constants/swagger";
import { JwtAuthGuard } from "../auth/jwt/jwt.guard";
import { PoliciesGuard } from "../policies/policies.guard";
import { CheckPolicies } from "../policies/policies.decorator";
import {
  CreateIngredientPolicyHandler,
  DeleteIngredientPolicyHandler,
  ReadIngredientPolicyHandler,
} from "../policies/policies.handlers";
import { IngredientInputDto } from "./dto/ingredient.input.dto";
import { IngredientOutputDto } from "./dto/ingredient.output.dto";
import { QueryInput } from "../types/query.input.type";
import { Paginated } from "../types/paginated.type";
import { daoToDto } from "./dto/dao.to.dto";
import { IngredientsService } from "./ingredients.service";

@UseGuards(JwtAuthGuard)
@Controller("ingredients")
@ApiTags(Swagger.apiTags.ingredients)
@ApiBearerAuth("accessToken")
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateIngredientPolicyHandler())
  @ApiOperation({
    summary: "Creates a new ingredient",
  })
  @ApiCreatedResponse({
    type: IngredientOutputDto,
    description: "Ingredient is created and its properties are returned",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only allowed users can perform this request" })
  @ApiBadRequestResponse({
    description:
      "One of:\n" +
      " - input doesn't match the request criteria\n" +
      " - ingredient name already in use",
  })
  async create(@Body() ingredientInputDto: IngredientInputDto): Promise<IngredientOutputDto> {
    return daoToDto(await this.ingredientsService.create(ingredientInputDto));
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadIngredientPolicyHandler())
  @ApiOperation({
    summary: "Get the list of existing ingredients",
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
    type: [IngredientOutputDto],
    description: "List of existing ingredients",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only allowed users can perform this request" })
  async findAll(@Query() query: QueryInput): Promise<Paginated<IngredientOutputDto>> {
    const ingredients = await this.ingredientsService.findIngredients(query);

    return {
      data: ingredients.map((ingredient) => daoToDto(ingredient)),
      page: query.page ? Number(query.page) : 1,
      results: ingredients.length,
    };
  }

  // TODO: method to get 1 ingredient, with list of recipes (_id and name)

  @Delete(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteIngredientPolicyHandler())
  @ApiOperation({
    summary: "Deletes a given ingredient",
  })
  @ApiParam({
    name: "id",
    description: "id of the ingredient",
    type: String,
  })
  @ApiOkResponse({
    description: "Ingredient is deleted",
    type: null,
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only Admin users can perform this request" })
  @ApiNotFoundResponse({
    description: "Ingredient not found",
  })
  async remove(@Param("id") id: string): Promise<void> {
    await this.ingredientsService.remove(id);
  }
}

export default IngredientsController;
