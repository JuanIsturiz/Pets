import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          userId: input.userId,
        },
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
  remove: privateProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          userId: true,
        },
      });

      if (userId !== post?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.post.delete({
        where: {
          id: input.postId,
        },
      });
      return true;
    }),
});
