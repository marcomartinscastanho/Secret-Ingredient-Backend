import { Role } from "./role.enum";

export type LoggedInUser = {
  _id: string;
  name?: string;
  username: string;
  role: Role;
};
