import { z } from "zod";

export const announcementInput = z.object({
  title: z.string().min(3).max(90),
  body: z.string().min(8).max(400),
  category: z.string().min(2).max(40),
  pinned: z.boolean().default(false)
});

export const queuedActionInput = z.object({
  type: z.string().min(2).max(80),
  targetType: z.enum(["town", "nation", "shop", "profile"]),
  targetId: z.string().optional(),
  payload: z.record(z.union([z.string(), z.number(), z.boolean()]))
});
