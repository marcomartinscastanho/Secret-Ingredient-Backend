import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CaslModule } from "../casl/casl.module";
import { IngredientsController } from "./ingredients.controller";
import { Ingredient, IngredientSchema } from "./ingredients.model";
import { IngredientsService } from "./ingredients.service";

@Module({
  imports: [
    CaslModule,
    MongooseModule.forFeature([{ name: Ingredient.name, schema: IngredientSchema }]),
  ],
  providers: [IngredientsService],
  controllers: [IngredientsController],
  exports: [IngredientsService],
})
export class IngredientsModule {}

export default IngredientsModule;
