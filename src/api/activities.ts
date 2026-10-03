export async function fetchActivities(signal: AbortSignal) {
  const response = await fetch(
    'https://aggiefeed.ucdavis.edu/api/v1/activity/public?s=0&l=25',
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
  const data: unknown = await response.json();
  return data;
}
