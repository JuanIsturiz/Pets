import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        likedBy: {
          select: {
            id: true,
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
        petId: z.string().cuid(),
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
          petId: input.petId,
          userId,
        },
      });
      return true;
    }),
  like: privateProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
        action: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const action = input.action ? "disconnect" : "connect";

      await ctx.prisma.post.update({
        where: { id: input.postId },
        data: {
          likedBy: {
            [action]: {
              id: userId,
            },
          },
        },
      });
    }),
});