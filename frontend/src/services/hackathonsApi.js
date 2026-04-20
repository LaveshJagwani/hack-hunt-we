import { apiRequest } from "./apiClient";

const tones = ["peach", "mint", "sky", "butter", "blush"];
const stamps = ["cherry", "sky", "mint", "butter", "ink"];
const tilts = ["left", "right", "slightLeft", "slightRight", "flat"];

export function mapApiHackathonToCard(item, index = 0) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    host: item.host ?? "Unknown host",
    theme: item.theme ?? "General",
    format: item.format ?? "unknown",
    location: item.location ?? "Location TBD",
    deadline: item.deadlineLabel ?? "Deadline TBD",
    prize: item.prize ?? "Prize TBD",
    summary: item.summary ?? item.description ?? "Details are being aggregated.",
    tags: Array.isArray(item.tags) ? item.tags.slice(0, 4) : [],
    tech: Array.isArray(item.tech) ? item.tech.slice(0, 4) : [],
    note: item.isBeginnerFriendly
      ? "Beginner-friendly signal spotted."
      : item.isStudentFriendly
        ? "Student-friendly listing."
        : "Freshly indexed from source feeds.",
    tone: tones[index % tones.length],
    stamp: stamps[index % stamps.length],
    tilt: tilts[index % tilts.length],
    source: item.source,
    sourceUrl: item.sourceUrl,
    rankingScore: item.rankingScore,
    trendingScore: item.trendingScore
  };
}

export async function fetchHackathons(params = {}) {
  return apiRequest("/hackathons", { params });
}

export async function searchHackathons(q, params = {}) {
  return apiRequest("/hackathons/search", { params: { q, ...params } });
}

export async function fetchHackathonBySlug(slug) {
  return apiRequest(`/hackathons/${slug}`);
}

export async function fetchTrendingHackathons(limit = 12) {
  return apiRequest("/hackathons/trending", { params: { limit } });
}

export async function fetchHackathonFilters() {
  return apiRequest("/hackathons/filter");
}
