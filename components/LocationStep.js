import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import CustomButton from './CustomButton';
import { colors, typography, spacing, borderRadius, shadows } from "../styles/theme";

const LocationStep = ({ onLocationCapture, location }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const getLocation = async () => {
    if (!hasPermission) {
      Alert.alert('Erro', 'Permissão de localização negada');
      return;
    }

    setIsLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      onLocationCapture(location);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check-In</Text>
        <Text style={styles.subtitle}>Solicitando permissão de localização...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Check-In</Text>
        <Text style={styles.subtitle}>Acesso à localização negado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In</Text>
      <Text style={styles.subtitle}>Verificação de GPS</Text>
      
      <View style={styles.locationContainer}>
        <View style={[
          styles.locationIcon,
          location && styles.locationIconSuccess
        ]}>
          <Text style={styles.locationIconText}>
            {location ? '📍' : '📍'}
          </Text>
        </View>
        
        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              Lat: {location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Lng: {location.coords.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>

      <CustomButton
        title={location ? "Avançar" : (isLoading ? "Obtendo localização..." : "Obter Localização")}
        onPress={location ? () => onLocationCapture(location) : getLocation}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  locationContainer: {
    width: 280,
    height: 280,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  locationIcon: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  locationIconSuccess: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent,
  },
  locationIconText: {
    fontSize: 48,
  },
  locationInfo: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  locationText: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontFamily: 'monospace',
  },
});

export default LocationStep;

