import type { Activity } from '../types/activity';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

// API data is unknown until these checks establish which fields are usable.
export function parseActivities(data: unknown): Activity[] {
  if (!Array.isArray(data)) {
    throw new Error('Unable to load the feed: unexpected response format.');
  }

  const activities: Activity[] = [];
  for (const entry of data) {
    if (!isRecord(entry)) continue;

    const id = readText(entry.id);
    const title = readText(entry.title);
    if (!id || !title) continue;

    const displayName = isRecord(entry.actor) ? readText(entry.actor.displayName) : undefined;
    const objectType = isRecord(entry.object) ? readText(entry.object.objectType) : undefined;
    const published = readText(entry.published);

    activities.push({
      id,
      title,
      actor: displayName ? { displayName } : undefined,
      object: objectType ? { objectType } : undefined,
      published: published && !Number.isNaN(Date.parse(published)) ? published : undefined,
    });
  }

  return activities;
}
