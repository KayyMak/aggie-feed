import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { fetchActivities } from '../api/activities';
import type { Activity } from '../types/activity';
import { parseActivities } from '../utils/parse-activities';

interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string;
  retry: () => Promise<void>;
}

const ActivitiesContext = createContext<ActivitiesState | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);

  const loadActivities = useCallback(() => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;

    return fetchActivities(controller.signal)
      .then(data => {
        if (!controller.signal.aborted) {
          setActivities(parseActivities(data));
        }
      })
      .catch((caughtError: unknown) => {
        if (!controller.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load the feed.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
  }, []);

  function retry() {
    setLoading(true);
    setError('');
    return loadActivities();
  }

  useEffect(() => {
    void loadActivities();
    return () => request.current?.abort();
  }, [loadActivities]);

  return (
    <ActivitiesContext.Provider value={{ activities, loading, error, retry }}>
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
