export interface Activity {
  id: string;
  title: string;
  actor?: {
    displayName?: string;
  };
  object?: {
    objectType?: string;
  };
  published?: string;
}
