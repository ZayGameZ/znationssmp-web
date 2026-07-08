import { z } from "zod";

export const announcementInput = z.object({
  title: z.string().min(3).max(90),
  body: z.string().min(8).max(400),
  category: z.string().min(2).max(40),
  pinned: z.boolean().default(false)
});

export const eventInput = z.object({
  title: z.string().min(3).max(90),
  description: z.string().min(8).max(400),
  type: z.string().min(2).max(40),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  active: z.boolean().default(false),
  reward: z.string().max(120).optional()
});

export const queuedActionInput = z.object({
  type: z.string().min(2).max(80),
  targetType: z.enum(["town", "nation", "shop", "profile"]),
  targetId: z.string().optional(),
  payload: z.record(z.union([z.string(), z.number(), z.boolean()]))
});
