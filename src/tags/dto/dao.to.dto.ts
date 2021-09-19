import { Tag } from "../tags.model";
import TagOutputDto from "./tag.output.dto";

export const daoToDto = (tag: Tag): TagOutputDto => {
  return {
    id: tag._id,
    name: tag.name,
  };
};

export default daoToDto;
