import { Document, Query } from "mongoose";

export const paginateQuery = <T extends Document>(
  query: Query<T[], T>,
  page?: number,
  results?: number
): Query<T[], T> => {
  if (page) {
    const limit = results ? Number(results) : 10;
    const offset = (page - 1) * limit;
    return query.skip(Number(offset)).limit(Number(limit));
  }
  if (results) {
    return query.limit(Number(results));
  }

  return query;
};

export default paginateQuery;
