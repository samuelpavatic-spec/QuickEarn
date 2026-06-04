import React from 'react';
import { View, Text, FlatList, RefreshControl, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from './api';
import { TaskItem } from '../../components/design-system/TaskItem';
import { COLORS, TYPOGRAPHY } from '../../components/design-system/Theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../../navigation/types';

const TasksScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList>>();
  const { data: tasks, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const renderItem = ({ item }: { item: any }) => (
    <TaskItem
      title={item.title}
      reward={item.rewardAmount}
      category={item.type}
      onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        <Text style={TYPOGRAPHY.h1} className="mb-2">Available Tasks</Text>
        <Text style={TYPOGRAPHY.caption} className="mb-6">Complete tasks to earn money</Text>
        
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text style={TYPOGRAPHY.body} className="text-gray-400">No tasks available right now.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default TasksScreen;
