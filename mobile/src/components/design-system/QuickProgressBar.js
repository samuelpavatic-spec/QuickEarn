import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from './Theme';

export const QuickProgressBar = ({ progress, style }) => {
  // progress should be between 0 and 1
  const width = Math.min(Math.max(progress, 0), 1) * 100 + '%';

  return (
    <View style={[styles.track, style]}>
      <View style={[styles.fill, { width }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});
