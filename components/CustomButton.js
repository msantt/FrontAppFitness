import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

const CustomButton = ({ title, onPress, disabled = false, style = {}, variant = 'primary' }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [
          styles.button,
          styles.buttonSecondary,
          disabled && styles.buttonDisabled,
          style
        ];
      default:
        return [
          styles.button,
          disabled && styles.buttonDisabled,
          style
        ];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.buttonTextSecondary, disabled && styles.buttonTextDisabled];
      default:
        return [styles.buttonText, disabled && styles.buttonTextDisabled];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    ...shadows.small,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.borderDisabled,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  buttonTextDisabled: {
    color: colors.textDisabled,
  },
});

export default CustomButton;

