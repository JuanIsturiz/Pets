import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  getAllInfinite: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit = 8, cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
          pet: {
            select: {
              name: true,
            },
          },
        },
      });
      let nextCursor: typeof cursor | undefined;

      if (posts.length > limit) {
        const nextItem = posts.pop();
        if (!nextItem) return;
        nextCursor = {
          id: nextItem.id,
          createdAt: nextItem.createdAt,
        };
      }

      return { posts, nextCursor };
    }),
  getOwn: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
    return await ctx.prisma.post.findMany({
      where: { authorId: userId },
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
        pet: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
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
        pet: {
          select: {
            name: true,
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
          authorId: input.userId,
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
          pet: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.post.findMany({
        where: {
          author: {
            name: {
              equals: input.username,
            },
          },
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
          pet: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
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
          pet: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),
  getByTags: publicProcedure
    .input(
      z.object({
        tag: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          tags: {
            search: input.tag,
          },
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
          pet: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return posts;
    }),
  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().nullable(),
        image: z.string(),
        tags: z.optional(z.string().array()),
        petId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await ctx.prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          image: input.image,
          tags: input.tags?.join("~"),
          petId: input.petId,
          authorId: userId,
        },
      });
      return { id: post.id };
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
  update: privateProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
        title: z.optional(z.string()),
        description: z.optional(z.string()),
        tags: z.optional(z.string().array()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, title, description, tags } = input;
      await ctx.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title,
          description,
          tags: tags?.join("~"),
        },
      });
      return true;
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
          authorId: true,
        },
      });

      if (userId !== post?.authorId) {
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
