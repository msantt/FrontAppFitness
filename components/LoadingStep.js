import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import CustomButton from './CustomButton';
import { colors, typography, spacing, borderRadius, shadows } from "../styles/theme";

const LoadingStep = ({ onComplete }) => {
  const [isComplete, setIsComplete] = useState(false);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Animação de rotação do spinner
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spin.start();

    // Simular processamento por 3 segundos
    const timer = setTimeout(() => {
      setIsComplete(true);
      spin.stop();
    }, 3000);

    return () => {
      clearTimeout(timer);
      spin.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-In</Text>
      <Text style={styles.subtitle}>
        {isComplete ? 'Confirmação Completa' : 'Aguardando Confirmação'}
      </Text>
      
      <View style={styles.loadingContainer}>
        {isComplete ? (
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
        ) : (
          <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
            <View style={styles.spinnerSegment} />
            <View style={[styles.spinnerSegment, styles.spinnerSegment2]} />
            <View style={[styles.spinnerSegment, styles.spinnerSegment3]} />
            <View style={[styles.spinnerSegment, styles.spinnerSegment4]} />
          </Animated.View>
        )}
      </View>

      <CustomButton
        title={isComplete ? "Confirmar" : "Processando..."}
        onPress={onComplete}
        disabled={!isComplete}
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
  loadingContainer: {
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
  spinner: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  spinnerSegment: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    top: 0,
    left: 36,
  },
  spinnerSegment2: {
    transform: [{ rotate: '90deg' }],
    backgroundColor: colors.primaryTransparent,
  },
  spinnerSegment3: {
    transform: [{ rotate: '180deg' }],
    backgroundColor: colors.primaryTransparent,
  },
  spinnerSegment4: {
    transform: [{ rotate: '270deg' }],
    backgroundColor: colors.primaryTransparent,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primaryTransparent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  successIconText: {
    fontSize: 48,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});

export default LoadingStep;

