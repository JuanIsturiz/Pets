import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const petRouter = createTRPCRouter({
  getOwn: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
    return await ctx.prisma.pet.findMany({
      where: { userId },
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
      return await ctx.prisma.pet.findMany({
        where: { userId: input.userId },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        specie: z.string(),
        image: z.string(),
        age: z.number(),
        birthday: z.string(),
        genre: z.enum(["male", "female"]),
        size: z.enum(["xs", "sm", "md", "lg", "xl"]),
        bio: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const birthdayDate = new Date(input.birthday);
      const userId = ctx.session?.user.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
      const fixedDate = new Date(
        birthdayDate.setDate(birthdayDate.getDate() + 1)
      );
      await ctx.prisma.pet.create({
        data: {
          ...input,
          userId,
          birthday: fixedDate,
        },
      });
      return true;
    }),
});
