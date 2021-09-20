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
import { QueryInput } from "../types/query.input.type";
import { Swagger } from "../constants/swagger";
import { daoToDto } from "./dto/dao.to.dto";
import { UserInputDto } from "./dto/user.input.dto";
import { UserOutputDto } from "./dto/user.output.dto";
import { UsersService } from "./users.service";
import { Paginated } from "../types/paginated.type";
import { Role } from "../types/role.enum";
import { UpdateUserInputDto } from "./dto/update.user.input.dto";
import { LoggedInUser } from "../types/logged-in-user.type";
import { JwtAuthGuard } from "../auth/jwt/jwt.guard";
import { PoliciesGuard } from "../policies/policies.guard";
import { CheckPolicies } from "../policies/policies.decorator";
import {
  CreateUserPolicyHandler,
  ReadUserPolicyHandler,
  UpdateUserPolicyHandler,
  DeleteUserPolicyHandler,
} from "../policies/policies.handlers";

const checkPermission = (requester: LoggedInUser, userParamId: string) => {
  if (requester.role === Role.User && requester._id !== userParamId) {
    throw new ForbiddenException();
  }
};

@UseGuards(JwtAuthGuard)
@Controller("users")
@ApiTags(Swagger.apiTags.users)
@ApiBearerAuth("accessToken")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateUserPolicyHandler())
  @ApiOperation({
    summary: "Creates a new user",
  })
  @ApiCreatedResponse({
    type: UserOutputDto,
    description: "User is created and its properties are returned",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only Admin users can perform this request" })
  @ApiBadRequestResponse({
    description: "One of:\n - input doesn't match the request criteria\n - username already in use",
  })
  async create(@Body() createCatDto: UserInputDto): Promise<UserOutputDto> {
    return daoToDto(await this.usersService.create(createCatDto));
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadUserPolicyHandler())
  @ApiOperation({
    summary: "Get the list of existing users",
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
    type: [UserOutputDto],
    description: "List of existing users",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only Admin users can perform this request" })
  async findAll(@Query() query: QueryInput): Promise<Paginated<UserOutputDto>> {
    const users = await this.usersService.findUsers(query);

    return {
      data: users.map((user) => daoToDto(user)),
      page: query.page ? Number(query.page) : 1,
      results: users.length,
    };
  }

  @Get(":id")
  @UseGuards(PoliciesGuard)
  @ApiOperation({
    summary: "Obtains a given user's properties",
  })
  @ApiParam({
    name: "id",
    description: "id of the user",
    type: String,
  })
  @ApiOkResponse({
    type: UserOutputDto,
    description: "The properties of the user",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({
    description:
      "Only Admin users can get the properties of other users.\n" +
      "Normal Users can only get their own properties",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async findById(
    @Request() { user }: { user: LoggedInUser },
    @Param("id") id: string
  ): Promise<UserOutputDto> {
    checkPermission(user, id);
    return daoToDto(await this.usersService.findOneOrFail(id));
  }

  @Patch(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateUserPolicyHandler())
  @ApiOperation({
    summary: "Updates a given user",
  })
  @ApiParam({
    name: "id",
    description: "id of the user",
    type: String,
  })
  @ApiOkResponse({
    type: UserOutputDto,
    description: "User is updated and its new properties are returned",
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only Admin users can perform this request" })
  @ApiBadRequestResponse({
    description:
      "One of:\n - input doesn't match the request criteria\n - new username already in use",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async update(@Param("id") id: string, @Body() dto: UpdateUserInputDto): Promise<UserOutputDto> {
    return daoToDto(await this.usersService.update(id, dto));
  }

  @Delete(":id")
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteUserPolicyHandler())
  @ApiOperation({
    summary: "Deletes a given user",
  })
  @ApiParam({
    name: "id",
    description: "id of the user",
    type: String,
  })
  @ApiOkResponse({
    description: "User is deleted",
    type: null,
  })
  @ApiUnauthorizedResponse({ description: "Only logged in users can perform this request" })
  @ApiForbiddenResponse({ description: "Only Admin users can perform this request" })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async remove(@Param("id") id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}

export default UsersController;
