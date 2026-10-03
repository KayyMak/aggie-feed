import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivitiesProvider } from '../context/activities';

export default function RootLayout() {
  return (
    <ActivitiesProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'AggieFeed' }} />
        <Stack.Screen name="activity/[id]" options={{ title: 'Activity details' }} />
      </Stack>
      <StatusBar style="auto" />
    </ActivitiesProvider>
  );
}
