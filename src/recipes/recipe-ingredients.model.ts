import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Ingredient } from "src/ingredients/ingredients.model";

export type RecipeIngredientDocument = RecipeIngredient & Document;

@Schema({ timestamps: true })
export class RecipeIngredient extends Document {
  // TODO: uncomment once Recipe is created
  // @Prop({ type: { type: Types.ObjectId, ref: "Recipe" } })
  // recipe!: Recipe;

  @Prop({ required: true })
  quantity!: string;

  @Prop({ type: { type: Types.ObjectId, ref: "Ingredient" } })
  ingredient!: Ingredient;

  @Prop({ required: true })
  specification!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const IngredientSchema = SchemaFactory.createForClass(RecipeIngredient);
