export type QueryInput = {
  page?: number;
  results?: number;
};

export type RecipeIngredientsQueryInput = QueryInput & { recipeId?: string };
