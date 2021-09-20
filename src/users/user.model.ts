import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Recipe } from "../recipes/recipe.model";
import { Role } from "../types/role.enum";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true, required: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: Role.User })
  role!: Role;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Recipe" }] })
  recipes!: Recipe[];

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
