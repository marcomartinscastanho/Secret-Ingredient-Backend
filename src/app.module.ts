import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { CaslModule } from "./casl/casl.module";
import { IngredientsModule } from "./ingredients/ingredients.module";
import { RecipesModule } from "./recipes/recipe.module";
import { TagsModule } from "./tags/tags.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RecipesModule,
    IngredientsModule,
    TagsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot("mongodb://localhost/secret-ingredient", { autoIndex: true }),
    CaslModule,
  ],
})
export class AppModule {}
