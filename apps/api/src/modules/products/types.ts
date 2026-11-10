export type ProductFilters = {
  search?: string;
  sortBy?: "price" | "createdAt";
  sortOrder?: "asc" | "desc";
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
};