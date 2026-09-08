import { prisma } from "@repo/database";

class CategoryRepository {
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  }

  async findAll() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
  }) {
    return prisma.category.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
    },
  ) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryRepository = new CategoryRepository();