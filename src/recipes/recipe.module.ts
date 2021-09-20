import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CaslModule } from "../casl/casl.module";
import { Recipe, RecipeSchema } from "./recipe.model";
import { RecipesController } from "./recipe.controller";
import { RecipesService } from "./recipe.service";
import { IngredientsModule } from "../ingredients/ingredients.module";
import { TagsModule } from "../tags/tags.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    IngredientsModule,
    TagsModule,
    UsersModule,
    CaslModule,
    MongooseModule.forFeature([{ name: Recipe.name, schema: RecipeSchema }]),
  ],
  providers: [RecipesService],
  controllers: [RecipesController],
  exports: [RecipesService],
})
export class RecipesModule {}

export default RecipesModule;
