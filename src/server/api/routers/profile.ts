import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { getSession } from "next-auth/react";
import { TRPCError } from "@trpc/server";

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
  remove: privateProcedure.mutation(async ({ ctx }) => {
    const session = await getSession();
    if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });
    await ctx.prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });
    return true;
  }),
});
