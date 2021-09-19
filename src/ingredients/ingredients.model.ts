import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type IngredientDocument = Ingredient & Document;

@Schema({ timestamps: true })
export class Ingredient extends Document {
  @Prop({ unique: true, required: true })
  name!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
