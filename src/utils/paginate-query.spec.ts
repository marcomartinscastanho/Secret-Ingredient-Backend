import { Document, Query } from "mongoose";
import { paginateQuery } from "./paginate-query";

let query: Query<Document[], Document>;

beforeAll(() => {
  query = new Query();
});

it("Not setting page nor results should return a query without options", () => {
  const paginatedQuery = paginateQuery(query);
  expect(paginatedQuery.getOptions()).toStrictEqual({});
});

it("Setting page and options should return skip (=page-1) and limit (=results)", () => {
  const paginatedQuery = paginateQuery(query, 1, 2);
  expect(paginatedQuery.getOptions()).toStrictEqual({ skip: 0, limit: 2 });
});

it("Setting page and options should return skip (=page-1) and limit (=results)", () => {
  const paginatedQuery = paginateQuery(query, 1, undefined);
  expect(paginatedQuery.getOptions()).toStrictEqual({ skip: 0, limit: 10 });
});

it("Setting page and options should return skip (=page-1) and limit (=results)", () => {
  const paginatedQuery = paginateQuery(query, undefined, 5);
  expect(paginatedQuery.getOptions()).toStrictEqual({ skip: 0, limit: 5 });
});
