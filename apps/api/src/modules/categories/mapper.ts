import type { Category } from "@repo/database";
import type { CategoryResponseDto } from "./dto.ts";

export const toCategoryResponse = (
  category: Category,
): CategoryResponseDto => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
});