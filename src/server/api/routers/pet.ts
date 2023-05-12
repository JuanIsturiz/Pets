import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const petRouter = createTRPCRouter({
  getOwn: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
    return await ctx.prisma.pet.findMany({
      where: { ownerId: userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.pet.findMany({
      //todo include pet owner
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
        where: { ownerId: input.userId },
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
          ownerId: userId,
          birthday: fixedDate,
        },
      });
      return true;
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        bio: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.pet.update({
        where: {
          id: input.id,
        },
        data: {
          bio: input.bio,
        },
      });
      return true;
    }),
  remove: privateProcedure
    .input(
      z.object({
        petId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const pet = await ctx.prisma.pet.findUnique({
        where: {
          id: input.petId,
        },
        select: {
          ownerId: true,
        },
      });

      if (userId !== pet?.ownerId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await ctx.prisma.pet.delete({
        where: {
          id: input.petId,
        },
      });
      return true;
    }),
});
