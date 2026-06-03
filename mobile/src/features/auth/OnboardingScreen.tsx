import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 items-center justify-center">
        {/* Modern Illustration Placeholder */}
        <View className="w-72 h-72 bg-emerald-50 rounded-3xl mb-12 items-center justify-center border border-emerald-100">
          <View className="w-48 h-48 bg-emerald-500 rounded-2xl rotate-12 absolute opacity-20" />
          <View className="w-48 h-48 bg-emerald-500 rounded-2xl -rotate-6 items-center justify-center shadow-lg">
             <Text className="text-white text-6xl font-bold">$</Text>
          </View>
        </View>

        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-gray-900 text-center mb-4 leading-tight">
            Earn Money{'\n'}Anytime, Anywhere
          </Text>
          <Text className="text-lg text-gray-500 text-center px-2">
            Complete simple micro-tasks and get paid instantly to your favorite wallet.
          </Text>
        </View>

        <TouchableOpacity
          className="bg-emerald-500 w-full h-16 rounded-2xl items-center justify-center shadow-md active:bg-emerald-600"
          onPress={() => navigation.navigate('Auth')}
        >
          <Text className="text-white text-xl font-bold">Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="mt-6"
          onPress={() => navigation.navigate('Auth')}
        >
          <Text className="text-gray-400 font-medium">Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
