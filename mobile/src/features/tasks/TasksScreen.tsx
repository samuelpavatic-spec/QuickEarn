import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, SafeAreaView, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from './api';
import { TaskItem } from '../../components/design-system/TaskItem';
import { COLORS, TYPOGRAPHY } from '../../components/design-system/Theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../../navigation/types';

const CATEGORIES = ['All', 'Survey', 'Ads', 'Install', 'Other'];

const TasksScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<TasksStackParamList>>();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: tasks, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const filteredTasks = tasks?.filter(task => 
    selectedCategory === 'All' || task.type.toLowerCase() === selectedCategory.toLowerCase()
  );

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
      <View className="px-6 py-4 flex-1">
        <Text style={TYPOGRAPHY.h1} className="mb-2">Available Tasks</Text>
        <Text style={TYPOGRAPHY.caption} className="mb-6">Complete tasks to earn money</Text>
        
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`mr-3 px-6 py-2 rounded-full border ${
                  selectedCategory === cat 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text className={selectedCategory === cat ? 'text-white font-bold' : 'text-gray-600'}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredTasks}
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
              <Text style={TYPOGRAPHY.body} className="text-gray-400">No {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : ''} tasks available right now.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default TasksScreen;
