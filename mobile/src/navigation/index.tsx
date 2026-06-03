import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types';
import OnboardingScreen from '../features/auth/OnboardingScreen';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import useAuthStore from '../store/useAuthStore';

// Placeholder main screens
import { View, Text } from 'react-native';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-xl font-bold text-gray-900">{name}</Text>
  </View>
);

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Tasks" component={() => <PlaceholderScreen name="Tasks" />} />
    <Tab.Screen name="Wallet" component={() => <PlaceholderScreen name="Wallet" />} />
    <Tab.Screen name="Referrals" component={() => <PlaceholderScreen name="Referrals" />} />
    <Tab.Screen name="Profile" component={() => <PlaceholderScreen name="Profile" />} />
  </Tab.Navigator>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  const token = useAuthStore((state) => state.token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
