import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: {
          name: input.username,
        },
        include: {
          posts: {
            select: {
              _count: true,
            },
          },
          pets: {
            select: {
              _count: true,
            },
          },
        },
      });
    }),
});
