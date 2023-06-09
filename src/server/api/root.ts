import { createTRPCRouter } from "~/server/api/trpc";
import { petRouter } from "./routers/pet";
import { postRouter } from "./routers/post";
import { commentRouter } from "./routers/comment";
import { profileRouter } from "./routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  pet: petRouter,
  post: postRouter,
  comment: commentRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
