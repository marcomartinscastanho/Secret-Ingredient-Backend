export type Paginated<T> = {
  data: T[];

  page?: number;

  results?: number;
};

export default Paginated;
