import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export const BottomNav = ({ active }) => {
  const navigation = useNavigation();

  const navItems = [
    { name: 'Home', icon: <Feather name="home" size={20} color="#FFF" />, route: 'Home' },
    { name: 'Grupos', icon: <Ionicons name="people-outline" size={20} color="#FFF" />, route: 'Grupos' },
    { name: 'Checkin', icon: <Feather name="check-circle" size={20} color="#FFF" />, route: 'Checkin' },
    { name: 'Desafios', icon: <MaterialIcons name="emoji-events" size={20} color="#FFF" />, route: 'Desafios' },
    { name: 'Perfil', icon: <FontAwesome5 name="user" size={20} color="#FFF" />, route: 'Perfil' },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = active === item.route;
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => navigation.navigate(item.route)}
          >
            {React.cloneElement(item.icon, { color: isActive ? '#000' : '#FFF' })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#1E1E1E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  navItemActive: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    width: 50,
    height: 50,
  },
});
