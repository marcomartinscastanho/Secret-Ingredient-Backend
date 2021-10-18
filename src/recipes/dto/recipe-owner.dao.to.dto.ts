import { User } from "../../users/user.model";
import { RecipeOwnerOutputDto } from "./recipe-owner.output.dto";

export const daoToDto = (user: User): RecipeOwnerOutputDto => {
  return {
    id: user._id,
    name: user.name,
  };
};

export default daoToDto;
