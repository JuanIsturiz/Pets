import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const commentRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        postId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.create({
        data: {
          text: input.text,
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      return true;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        commentId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.comment.delete({
        where: {
          id: input.commentId,
        },
      });
      return true;
    }),
});
