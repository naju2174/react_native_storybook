import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../atoms/Button';
import type { HeaderProps } from './Header.types';

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <View style={styles.container} accessible={true} accessibilityRole="header">
    <Text style={styles.title} accessibilityRole="header">Acme</Text>
    <View style={styles.actions} accessibilityRole="toolbar">
      {user ? (
        <>
          <Text style={styles.welcome}>
            Welcome, <Text style={styles.bold}>{user.name}</Text>!
          </Text>
          <Button size="small" onClick={onLogout} label="Log out" />
        </>
      ) : (
        <>
          <Button size="small" onClick={onLogin} label="Log in" />
          <View style={{ width: 10 }} />
          <Button primary size="small" onClick={onCreateAccount} label="Sign up" />
        </>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontWeight: '700',
    fontSize: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcome: {
    marginRight: 10,
    color: '#333',
    fontSize: 14,
  },
  bold: {
    fontWeight: '700',
  },
});
