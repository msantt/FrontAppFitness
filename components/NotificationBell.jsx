import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const NotificationBell = ({ hasNotification = false }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Notificacao')}
      activeOpacity={0.8}
    >
      <Icon name="bell-outline" size={26} color="#FFFFFF" />
      {hasNotification && (
        <View style={styles.badge} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    backgroundColor: '#1DB954',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#121212',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1.5,
    elevation: 3,
  },
});
