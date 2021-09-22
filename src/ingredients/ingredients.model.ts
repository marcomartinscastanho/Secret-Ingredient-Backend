import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Recipe } from "../recipes/recipe.model";

export type IngredientDocument = Ingredient & Document;

@Schema({ timestamps: true })
export class Ingredient extends Document {
  @Prop({ unique: true, required: true })
  name!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Recipe" }] })
  recipes!: Recipe[];

  @Prop({ type: Number, default: 0, min: 0 })
  popularity!: number;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
