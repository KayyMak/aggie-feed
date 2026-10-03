import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Activity } from '../types/activity';
import { parseActivities } from '../utils/parse-activities';

interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string;
}

const ActivitiesContext = createContext<ActivitiesState | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchActivities() {
      try {
        const response = await fetch(
          'https://aggiefeed.ucdavis.edu/api/v1/activity/public?s=0&l=25',
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const data: unknown = await response.json();
        if (!controller.signal.aborted) {
          setActivities(parseActivities(data));
          setError('');
        }
      } catch (caughtError: unknown) {
        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load the feed.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void fetchActivities();
    return () => controller.abort();
  }, []);

  return (
    <ActivitiesContext.Provider value={{ activities, loading, error }}>
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivities must be used inside ActivitiesProvider.');
  }
  return context;
}
