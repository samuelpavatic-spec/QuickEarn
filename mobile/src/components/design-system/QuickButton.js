import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from './Theme';

export const QuickButton = ({ title, onPress, type = 'primary', disabled = false, style }) => {
  const buttonStyle = [
    styles.button,
    type === 'secondary' ? styles.secondary : styles.primary,
    disabled && styles.disabled,
    style
  ];

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={buttonStyle} activeOpacity={0.8}>
      <Text style={[styles.text, type === 'secondary' && styles.textSecondary]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    backgroundColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  textSecondary: {
    color: COLORS.primary,
  },
});
