import { Pressable, StyleSheet, Text, View } from 'react-native';

export function FeedError({ error, onRetry }: { error: string; onRetry: () => Promise<void> }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unable to load activities</Text>
      <Text style={styles.message}>{error}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => { void onRetry(); }}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: 8 },
  message: { fontSize: 16, lineHeight: 24, color: '#4b5563', textAlign: 'center' },
  button: { marginTop: 20, minHeight: 48, minWidth: 120, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center' },
  pressed: { backgroundColor: '#1e40af' },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
