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
  CreateTagPolicyHandler,
  DeleteTagPolicyHandler,
  ReadTagPolicyHandler,
} from "../policies/policies.handlers";
import { QueryInput } from "../types/query.input.type";
import { Paginated } from "../types/paginated.type";
import { daoToDto } from "./dto/dao.to.dto";
import { TagsService } from "./tags.service";
import { TagInputDto } from "./dto/tag.input.dto";
import { TagOutputDto } from "./dto/tag.output.dto";

@Controller("tags")
@ApiTags(Swagger.apiTags.tags)
@ApiBearerAuth("accessToken")
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new CreateTagPolicyHandler())
  @ApiOperation({
    summary: "Creates a new tag",
  })
  @ApiCreatedResponse({
    type: TagOutputDto,
    description: "Tag is created and its properties are returned",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only allowed users can perform this request" })
  @ApiBadRequestResponse({
    description:
      "One of:\n" + " - input doesn't match the request criteria\n" + " - tag name already in use",
  })
  async create(@Body() tagInputDto: TagInputDto): Promise<TagOutputDto> {
    return daoToDto(await this.tagsService.create(tagInputDto));
  }

  @Get()
  @ApiOperation({
    summary: "Get the list of existing tags",
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
    type: [TagOutputDto],
    description: "List of existing tags",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only allowed users can perform this request" })
  async findAll(@Query() query: QueryInput): Promise<Paginated<TagOutputDto>> {
    const tags = await this.tagsService.findTags(query);

    return {
      data: tags.map((tag) => daoToDto(tag)),
      page: query.page ? Number(query.page) : 1,
      results: tags.length,
    };
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(new DeleteTagPolicyHandler())
  @ApiOperation({
    summary: "Deletes a given tag",
  })
  @ApiParam({
    name: "id",
    description: "id of the tag",
    type: String,
  })
  @ApiOkResponse({
    description: "Tag is deleted",
    type: null,
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only Admin users can perform this request" })
  @ApiNotFoundResponse({
    description: "Tag not found",
  })
  async remove(@Param("id") id: string): Promise<void> {
    await this.tagsService.remove(id);
  }
}

export default TagsController;
