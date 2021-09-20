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
