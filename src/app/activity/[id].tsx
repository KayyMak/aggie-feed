import { Link, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useActivities } from '../../context/activities';

export default function ActivityDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activities, loading, error } = useActivities();
  const activity = activities.find(item => item.id === id);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator accessibilityLabel="Loading activity" /></View>;
  }
  if (error) {
    return <View style={styles.centered}><Text>{error}</Text></View>;
  }
  if (!activity) {
    return (
      <View style={styles.centered}>
        <Text>This activity is not available in the current feed.</Text>
        <Link href="/" style={styles.link}>Go to feed</Link>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.organization}>{activity.actor.displayName}</Text>
      <Text style={styles.detail}>Type: {activity.object.objectType}</Text>
      <Text style={styles.detail}>Published: {activity.published}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 12 },
  organization: { fontSize: 17, color: '#4b5563' },
  detail: { fontSize: 16, color: '#4b5563', marginTop: 12 },
  link: { marginTop: 16, color: '#2563eb' },
});
