import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <Text className="text-3xl font-bold text-textPrimary mb-2">Welcome Back</Text>
        <Text className="text-textSecondary mb-8">Sign in to continue earning</Text>

        {/* Placeholder for form */}
        <View className="space-y-4 mb-6">
          <View className="h-12 border border-gray-300 rounded-lg px-4 justify-center bg-white">
            <Text className="text-gray-400">Email</Text>
          </View>
          <View className="h-12 border border-gray-300 rounded-lg px-4 justify-center bg-white">
            <Text className="text-gray-400">Password</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-primary h-12 rounded-lg items-center justify-center shadow-md mb-4"
          onPress={() => {}}
        >
          <Text className="text-white text-lg font-medium">Login</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-textSecondary">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-primary font-bold">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
