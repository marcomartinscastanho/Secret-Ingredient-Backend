import { User } from "../user.model";
import { UserOutputDto } from "./user.output.dto";

export const daoToDto = (user: User): UserOutputDto => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    role: user.role,
  };
};

export default daoToDto;
