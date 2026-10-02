import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Data {
  title: string;
  displayName: string;
  objectType: string;
  published: string;

}

export default function App() {
  const [error, setError] = useState("");
  const [info, setInfo] = useState();
  useEffect(()=> {
    const fetchInfo = async() => {
      try {
        const response = await fetch("https://aggiefeed.ucdavis.edu/api/v1/activity/public?s=0&l=25");
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const jsonResponse = await response.json();
        setInfo(jsonResponse);
        setError("");
      } catch (caughtError: unknown) {
        // handling the case where the object passed as a parameter isn't a Error obj
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load the feed."
        );
      }
    };

    void fetchInfo();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
