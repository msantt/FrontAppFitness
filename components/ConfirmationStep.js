import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomButton from './CustomButton';
import { colors, typography, spacing, borderRadius, shadows } from "../styles/theme";

const ConfirmationStep = ({ onConfirm, capturedPhoto, location }) => {
  const handleConfirm = () => {
    Alert.alert(
      'Check-in Realizado!',
      'Seu check-in foi realizado com sucesso.',
      [
        {
          text: 'OK',
          onPress: onConfirm,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In</Text>
      <Text style={styles.subtitle}>Confirmação Completa</Text>
      
      <View style={styles.confirmationContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo do Check-in:</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>📷 Foto:</Text>
            <Text style={styles.summaryValue}>Capturada</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>📍 Localização:</Text>
            <Text style={styles.summaryValue}>
              {location ? 
                `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 
                'Obtida'
              }
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>⏰ Horário:</Text>
            <Text style={styles.summaryValue}>
              {new Date().toLocaleTimeString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>

      <CustomButton
        title="Confirmar"
        onPress={handleConfirm}
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
  confirmationContainer: {
    width: 280,
    minHeight: 280,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  successIconText: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  summaryContainer: {
    width: '100%',
  },
  summaryTitle: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontFamily: 'monospace',
    flex: 1,
    textAlign: 'right',
  },
});

export default ConfirmationStep;

