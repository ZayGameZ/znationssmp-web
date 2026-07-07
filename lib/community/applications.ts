import type { ApplicationRole, ApplicationStatus } from "@/types";

export interface ApplicationQuestion {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

export interface ApplicationRoleConfig {
  role: ApplicationRole;
  title: string;
  blurb: string;
  requirements: string[];
  questions: ApplicationQuestion[];
}

// Single source of truth for the /apply form and the admin review screen, so a
// question added here shows up in both without a second edit.
export const APPLICATION_ROLES: ApplicationRoleConfig[] = [
  {
    role: "discord-mod",
    title: "Discord Moderator",
    blurb: "Keep the community chat welcoming, on-topic, and troll-free.",
    requirements: ["Active in the Discord", "Level-headed under pressure", "16+ recommended"],
    questions: [
      { key: "timezone", label: "Timezone & typical hours online", placeholder: "e.g. EST, evenings + weekends" },
      { key: "experience", label: "Prior moderation experience", placeholder: "Servers you've moderated and what you did.", multiline: true },
      { key: "scenario", label: "Two members are arguing and it's getting heated. What do you do?", placeholder: "Walk us through your approach.", multiline: true },
      { key: "why", label: "Why do you want to help moderate ZNations?", placeholder: "Tell us what draws you to the role.", multiline: true }
    ]
  },
  {
    role: "server-admin",
    title: "Server Admin",
    blurb: "Help run the Minecraft server — plugins, events, in-game support, and fair play.",
    requirements: ["Solid Minecraft/Java knowledge", "Trustworthy with elevated permissions", "18+ recommended"],
    questions: [
      { key: "timezone", label: "Timezone & typical hours online", placeholder: "e.g. GMT, most days" },
      { key: "experience", label: "Server administration / plugin experience", placeholder: "Paper, Towny, permissions, event running, etc.", multiline: true },
      { key: "scenario", label: "You suspect a player is duping items. How do you investigate and respond?", placeholder: "Describe your process.", multiline: true },
      { key: "contribution", label: "What could you bring to the admin team?", placeholder: "Skills, availability, ideas.", multiline: true }
    ]
  }
];

export function getApplicationRole(role: string): ApplicationRoleConfig | undefined {
  return APPLICATION_ROLES.find((entry) => entry.role === role);
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pending Review",
  reviewing: "Under Review",
  accepted: "Accepted",
  rejected: "Not Accepted"
};
