import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Recipe } from "../recipes/recipe.model";

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag extends Document {
  @Prop({ unique: true, required: true })
  name!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Recipe" }] })
  recipes!: Recipe[];

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.post("validate", () => {
  console.log(`Tag ${this} has been validated`);
});

TagSchema.post("save", () => {
  console.log(`Tag ${this} has been saved`);
});

TagSchema.post("updateOne", function () {
  console.log(`Tag ${this} has been updated`);
});
