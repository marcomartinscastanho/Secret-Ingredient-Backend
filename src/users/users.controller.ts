import { UsersService } from "./users.service";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}

export default UsersController;
