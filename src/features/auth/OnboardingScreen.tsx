import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 items-center justify-center">
        <View className="w-64 h-64 bg-gray-100 rounded-full mb-10 items-center justify-center">
          <Text className="text-gray-400">Illustration Placeholder</Text>
        </View>
        
        <Text className="text-3xl font-bold text-textPrimary text-center mb-4">
          Earn Money Anytime, Anywhere
        </Text>
        <Text className="text-textSecondary text-center mb-10 px-4">
          Complete simple micro-tasks and get paid instantly to your favorite wallet.
        </Text>

        <TouchableOpacity 
          className="bg-primary w-full h-12 rounded-lg items-center justify-center shadow-md mb-4"
          onPress={() => navigation.navigate('Auth')}
        >
          <Text className="text-white text-lg font-medium">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
