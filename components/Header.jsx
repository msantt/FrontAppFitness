import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { NotificationBell } from '../components/NotificationBell';

export const Header = ({
  title,
  subtitle,
  showBackButton = false,
  showShareButton = false,
  onBackPress,
  onSharePress,
  rightComponent,
  hasNotification = false,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2A2A2A" />
      
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
            <Text style={styles.icon}>←</Text>
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.actionsContainer}>
          <NotificationBell hasNotification={hasNotification} />

          {showShareButton && (
            <TouchableOpacity style={styles.iconButton} onPress={onSharePress}>
              <Text style={styles.icon}>⤴</Text>
            </TouchableOpacity>
          )}

          {rightComponent && (
            <View style={styles.rightComponent}>
              {rightComponent}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A2A2A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#1DB954',
    fontSize: 14,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // se der erro, substitua por marginLeft dentro dos elementos
  },
  rightComponent: {
    marginLeft: 8,
  },
});
