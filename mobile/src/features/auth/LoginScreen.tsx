import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { login } from './api';
import useAuthStore from '../../store/useAuthStore';

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      setAuth(response.token, response.user);
      // Root navigation will handle the switch to 'MainTabs' based on token in RootStack
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Failed to login. Please check your credentials.';
      Alert.alert('Login Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          <View className="mb-10">
            <Text className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-lg text-gray-600">Sign in to continue earning</Text>
          </View>

          <View className="space-y-4 mb-8">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Email Address</Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-xl px-4 bg-gray-50 text-gray-900"
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-xl px-4 bg-gray-50 text-gray-900"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            className={`h-14 rounded-xl items-center justify-center shadow-sm ${
              isLoading ? 'bg-emerald-400' : 'bg-emerald-500'
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-semibold">Login</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-emerald-600 font-bold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
