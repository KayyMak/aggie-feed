import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useActivities } from '../context/activities';
import { FeedError } from '../components/feed-error';

export default function FeedScreen() {
  const { activities, loading, error, retry } = useActivities();

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator accessibilityLabel="Loading activities" /></View>;
  }
  if (error) {
    return <FeedError error={error} onRetry={retry} />;
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={activities}
      keyExtractor={activity => activity.id}
      ListEmptyComponent={<Text style={styles.empty}>No activities available.</Text>}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <Link href={{ pathname: '/activity/[id]', params: { id: item.id } }} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`View details for ${item.title}`}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <Text style={styles.title}>{item.title}</Text>
            {item.actor?.displayName ? (
              <Text style={styles.organization}>{item.actor.displayName}</Text>
            ) : null}
            <Text style={styles.action}>View details ›</Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#f3f4f6' },
  listContent: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  card: { padding: 20, borderWidth: 1, borderColor: '#9ca3af', borderRadius: 12, backgroundColor: '#fff' },
  separator: { height: 1, backgroundColor: '#d1d5db', marginVertical: 12 },
  pressed: { backgroundColor: '#eff6ff', borderColor: '#1d4ed8' },
  title: { fontSize: 18, lineHeight: 26, fontWeight: '600', color: '#111827', marginBottom: 8 },
  organization: { fontSize: 15, lineHeight: 22, color: '#4b5563' },
  action: { marginTop: 16, fontSize: 16, lineHeight: 24, fontWeight: '600', color: '#1d4ed8' },
  empty: { padding: 24, fontSize: 16, color: '#4b5563', textAlign: 'center' },
});
