import { z } from "zod";

export const pollInput = z.object({
  question: z.string().min(6).max(160),
  description: z.string().max(400).default(""),
  category: z.string().min(2).max(40).default("general"),
  options: z.array(z.string().min(1).max(120)).min(2).max(8),
  closesAt: z.string().datetime().optional()
});

export const voteInput = z.object({
  optionId: z.string().min(1).max(120)
});

export const applicationInput = z.object({
  role: z.enum(["discord-mod", "server-admin"]),
  discordUsername: z.string().max(60).optional(),
  minecraftUsername: z.string().max(40).optional(),
  answers: z.record(z.string().min(1).max(2000))
});

export const applicationReviewInput = z.object({
  status: z.enum(["pending", "reviewing", "accepted", "rejected"]),
  adminNotes: z.string().max(1000).optional()
});
