import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().nullable(),
        image: z.string(),
        tags: z.string().array().optional(),
        pet: z.object({
          id: z.string().cuid(),
          name: z.string(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await ctx.prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          image: input.image,
          tags: input.tags?.join("~"),
          petName: input.pet.name,
          petId: input.pet.id,
          userId,
        },
      });
      return true;
    }),
});
