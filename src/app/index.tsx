import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useActivities } from '../context/activities';

export default function FeedScreen() {
  const { activities, loading, error } = useActivities();

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator accessibilityLabel="Loading activities" /></View>;
  }
  if (error) {
    return <View style={styles.centered}><Text>{error}</Text></View>;
  }

  return (
    <FlatList
      style={styles.list}
      data={activities}
      keyExtractor={activity => activity.id}
      ListEmptyComponent={<Text style={styles.card}>No activities available.</Text>}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/activity/[id]', params: { id: item.id } }} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`View details for ${item.title}`}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.organization}>{item.actor.displayName}</Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  card: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  pressed: { backgroundColor: '#f3f4f6' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  organization: { fontSize: 15, color: '#4b5563' },
});
