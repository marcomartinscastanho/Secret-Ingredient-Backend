export type QueryInput = {
  page?: number;
  results?: number;
};

export type RecipeQueryInput = QueryInput & { userId?: string };
