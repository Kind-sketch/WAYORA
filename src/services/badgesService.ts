// Simple badges persistence. Uses localStorage on web, AsyncStorage if available.
const STORAGE_KEY = "wayora_badges_v1";

async function readBadges(): Promise<string[]> {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  } catch (e) {
    // ignore
  }
  return [];
}

async function writeBadges(badges: string[]) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(badges));
    }
  } catch (e) {
    // ignore
  }
}

export async function earnBadge(id: string) {
  const badges = await readBadges();
  if (!badges.includes(id)) {
    badges.push(id);
    await writeBadges(badges);
  }
}

export async function getBadges(): Promise<string[]> {
  return await readBadges();
}
