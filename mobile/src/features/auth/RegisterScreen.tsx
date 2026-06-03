import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { register } from './api';
import useAuthStore from '../../store/useAuthStore';

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !country) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        fullName,
        email,
        password,
        country,
        referralCode,
      });
      setAuth(response.token, response.user);
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Failed to register. Please try again.';
      Alert.alert('Registration Failed', message);
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="py-10">
            <Text className="text-4xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-lg text-gray-600">Start your earning journey today</Text>
          </View>

          <View className="space-y-4 mb-8">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Full Name</Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-xl px-4 bg-gray-50 text-gray-900"
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

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

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Country</Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-xl px-4 bg-gray-50 text-gray-900"
                placeholder="e.g. Nigeria, India, Brazil"
                value={country}
                onChangeText={setCountry}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Referral Code (Optional)</Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-xl px-4 bg-gray-50 text-gray-900"
                placeholder="PROMO2024"
                value={referralCode}
                onChangeText={setReferralCode}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <TouchableOpacity
            className={`h-14 rounded-xl items-center justify-center shadow-sm mb-6 ${
              isLoading ? 'bg-emerald-400' : 'bg-emerald-500'
            }`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-semibold">Register</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center pb-10">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-emerald-600 font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
