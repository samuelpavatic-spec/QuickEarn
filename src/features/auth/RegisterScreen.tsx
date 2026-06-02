import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12">
        <Text className="text-3xl font-bold text-textPrimary mb-2">Create Account</Text>
        <Text className="text-textSecondary mb-8">Start your earning journey today</Text>

        <View className="space-y-4 mb-6">
          <View className="h-12 border border-gray-300 rounded-lg px-4 justify-center bg-white">
            <Text className="text-gray-400">Full Name</Text>
          </View>
          <View className="h-12 border border-gray-300 rounded-lg px-4 justify-center bg-white">
            <Text className="text-gray-400">Email</Text>
          </View>
          <View className="h-12 border border-gray-300 rounded-lg px-4 justify-center bg-white">
            <Text className="text-gray-400">Password</Text>
          </View>
          <View className="h-12 border border-gray-300 rounded-lg px-4 justify-center bg-white">
            <Text className="text-gray-400">Country</Text>
          </View>
          <View className="h-12 border border-gray-300 rounded-lg px-4 justify-center bg-white">
            <Text className="text-gray-400">Referral Code (Optional)</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-primary h-12 rounded-lg items-center justify-center shadow-md mb-4"
          onPress={() => {}}
        >
          <Text className="text-white text-lg font-medium">Register</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mb-10">
          <Text className="text-textSecondary">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-primary font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
