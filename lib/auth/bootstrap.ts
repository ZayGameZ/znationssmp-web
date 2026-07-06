import type { User } from "@/types";

export function getBootstrapUsers(): User[] {
  const ownerUsername = process.env.ZN_ADMIN_USERNAME ?? "owner";
  const playerUsername = process.env.ZN_PLAYER_USERNAME ?? "player";
  return [
    {
      id: "u-bootstrap-owner",
      username: ownerUsername,
      role: "owner",
      minecraftUuid: "",
      professionId: "",
      townId: "",
      nationId: "",
      balance: 0,
      playtimeMinutes: 0,
      avatarUrl: `https://mc-heads.net/avatar/${encodeURIComponent(ownerUsername)}/64`,
      badges: ["Owner"]
    },
    {
      id: "u-bootstrap-player",
      username: playerUsername,
      role: "player",
      minecraftUuid: "",
      professionId: "",
      townId: "",
      nationId: "",
      balance: 0,
      playtimeMinutes: 0,
      avatarUrl: `https://mc-heads.net/avatar/${encodeURIComponent(playerUsername)}/64`,
      badges: ["Website Account"]
    }
  ];
}

export function getGuestUser(): User {
  return {
    id: "u-guest",
    username: "Guest",
    role: "player",
    minecraftUuid: "",
    professionId: "",
    townId: "",
    nationId: "",
    balance: 0,
    playtimeMinutes: 0,
    avatarUrl: "/brand/zn-shield.svg",
    badges: ["Not Linked"]
  };
}
