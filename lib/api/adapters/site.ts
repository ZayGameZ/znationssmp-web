import { siteData } from "@/lib/mock-data";
import type {
  Announcement,
  Event,
  IntegrationStatus,
  MarketItem,
  Nation,
  Profession,
  QueuedAction,
  ServerSnapshot,
  SiteData,
  Town
} from "@/types";

export async function getSiteData(): Promise<SiteData> {
  return siteData;
}

export async function getServerStatus(): Promise<ServerSnapshot> {
  return siteData.server;
}

export async function getMarketItems(): Promise<MarketItem[]> {
  return siteData.items;
}

export async function getProfessions(): Promise<Profession[]> {
  return siteData.professions;
}

export async function getTowns(): Promise<Town[]> {
  return siteData.towns;
}

export async function getNations(): Promise<Nation[]> {
  return siteData.nations;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return siteData.announcements;
}

export async function getEvents(): Promise<Event[]> {
  return siteData.events;
}

export async function getQueuedActions(): Promise<QueuedAction[]> {
  return siteData.queuedActions;
}

export async function getIntegrationStatuses(): Promise<IntegrationStatus[]> {
  return siteData.integrations;
}
