import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag extends Document {
  @Prop({ unique: true, required: true })
  name!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
