import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from './Theme';
import { QuickCard } from './QuickCard';

export const TaskItem = ({ title, reward, category, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <QuickCard style={styles.container}>
        <View style={styles.left}>
          <Text style={TYPOGRAPHY.h2}>{title}</Text>
          <Text style={TYPOGRAPHY.caption}>{category}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.reward}>${reward}</Text>
        </View>
      </QuickCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  left: {
    flex: 1,
  },
  reward: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
