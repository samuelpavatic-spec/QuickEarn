import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getTaskDetails, startTask, submitTask } from './api';
import { COLORS, TYPOGRAPHY } from '../../components/design-system/Theme';
import { QuickButton } from '../../components/design-system/QuickButton';
import { QuickCard } from '../../components/design-system/QuickCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TasksStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<TasksStackParamList, 'TaskDetails'>;

const TaskDetailsScreen = ({ route, navigation }: Props) => {
  const { taskId } = route.params;
  const [isStarted, setIsStarted] = useState(false);
  const [evidence, setEvidence] = useState('');

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskDetails(taskId),
  });

  const startMutation = useMutation({
    mutationFn: () => startTask(taskId),
    onSuccess: () => {
      setIsStarted(true);
      Alert.alert('Task Started', 'Follow the instructions and submit when done.');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to start task');
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => submitTask(taskId, { completed: true, evidence }),
    onSuccess: () => {
      Alert.alert('Success', 'Task submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit task');
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!task) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text style={TYPOGRAPHY.h1} className="mb-2">{task.title}</Text>
          <View className="flex-row items-center">
            <View className="bg-emerald-100 px-3 py-1 rounded-full mr-3">
              <Text className="text-emerald-700 font-bold">{task.type}</Text>
            </View>
            <Text style={TYPOGRAPHY.h2} className="text-emerald-600">${task.rewardAmount}</Text>
          </View>
        </View>

        <QuickCard style={{ marginBottom: 24 }}>
          <Text style={TYPOGRAPHY.h2} className="mb-4">Instructions</Text>
          <Text style={TYPOGRAPHY.body} className="leading-6 text-gray-700">
            {task.description}
          </Text>
        </QuickCard>

        {isStarted && (
          <View className="mb-8">
            <Text style={TYPOGRAPHY.h2} className="mb-4">Submit Evidence</Text>
            <TextInput
              className="border border-gray-200 rounded-2xl p-4 bg-gray-50 h-32 text-gray-900"
              placeholder="Enter completion details, promo code, or confirmation text..."
              multiline
              textAlignVertical="top"
              value={evidence}
              onChangeText={setEvidence}
            />
          </View>
        )}

        {!isStarted ? (
          <QuickButton
            title="Start Task"
            onPress={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            style={{ height: 56, borderRadius: 16 }}
          />
        ) : (
          <QuickButton
            title="Submit Completion"
            onPress={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || !evidence.trim()}
            style={{ height: 56, borderRadius: 16 }}
          />
        )}
        
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskDetailsScreen;
