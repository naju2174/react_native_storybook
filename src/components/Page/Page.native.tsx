import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header } from '../Header';

type User = {
  name: string;
};

export const Page: React.FC = () => {
  const [user, setUser] = useState<User>();

  return (
    <ScrollView accessible={false}>
      <Header
        user={user}
        onLogin={() => setUser({ name: 'Jane Doe' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />
      <View style={styles.content} accessibilityRole="summary">
        <Text style={styles.heading} accessibilityRole="header">Pages in Storybook</Text>
        <Text style={styles.paragraph}>
          We recommend building UIs with a component-driven process starting with atomic components
          and ending with pages.
        </Text>
        <Text style={styles.paragraph}>
          Render pages with mock data. This makes it easy to build and review page states without
          needing to navigate to them in your app.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingTop: 48,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  heading: {
    fontWeight: '700',
    fontSize: 32,
    marginBottom: 4,
    color: '#333',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 24,
    color: '#333',
    marginVertical: 8,
  },
});
