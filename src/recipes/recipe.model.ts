import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Tag } from "../tags/tags.model";
import { RecipeIngredient } from "../types/recipe-ingredient.type";
import { User } from "../users/user.model";

export type RecipeDocument = Recipe & Document;

@Schema({ timestamps: true })
export class Recipe extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: false })
  portions?: number;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Tag" }] })
  tags!: Tag[];

  @Prop({ required: false })
  preparationTime?: number;

  @Prop({ required: false })
  cookingTime?: number;

  @Prop({
    type: [
      {
        quantity: { type: String },
        ingredient: { type: Types.ObjectId },
        specification: { type: String },
      },
    ],
    ref: "Ingredient",
  })
  ingredients!: RecipeIngredient[];

  @Prop({ type: [String], required: true })
  preparationSteps!: string[];

  @Prop({ type: Types.ObjectId, ref: "User" })
  owner!: User;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
