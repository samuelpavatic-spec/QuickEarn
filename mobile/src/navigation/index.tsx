import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, AuthStackParamList, MainTabParamList, TasksStackParamList } from './types';
import OnboardingScreen from '../features/auth/OnboardingScreen';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import TasksScreen from '../features/tasks/TasksScreen';
import TaskDetailsScreen from '../features/tasks/TaskDetailsScreen';
import WalletScreen from '../features/wallet/WalletScreen';
import ReferralsScreen from '../features/referrals/ReferralsScreen';
import useAuthStore from '../store/useAuthStore';
import { ClipboardList, Wallet, Users, User } from 'lucide-react-native';
import { COLORS } from '../components/design-system/Theme';

// Placeholder profile screen
import { View, Text } from 'react-native';
const ProfileScreen = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4">
        <User size={48} color="#9CA3AF" />
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">{user?.fullName}</Text>
      <Text className="text-gray-500 mb-8">{user?.email}</Text>
      
      <TouchableOpacity 
        onPress={logout}
        className="bg-red-50 w-full py-4 rounded-xl items-center"
      >
        <Text className="text-red-600 font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const TasksStack = createNativeStackNavigator<TasksStackParamList>();
const TasksNavigator = () => (
  <TasksStack.Navigator screenOptions={{ headerShown: false }}>
    <TasksStack.Screen name="TaskList" component={TasksScreen} />
    <TasksStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
  </TasksStack.Navigator>
);

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainTabs = () => (
  <Tab.Navigator 
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 10 },
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Tasks') return <ClipboardList size={size} color={color} />;
        if (route.name === 'Wallet') return <Wallet size={size} color={color} />;
        if (route.name === 'Referrals') return <Users size={size} color={color} />;
        if (route.name === 'Profile') return <User size={size} color={color} />;
        return null;
      },
    })}
  >
    <Tab.Screen name="Tasks" component={TasksNavigator} />
    <Tab.Screen name="Wallet" component={WalletScreen} />
    <Tab.Screen name="Referrals" component={ReferralsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const Stack = createNativeStackNavigator<RootStackParamList>();

import { TouchableOpacity } from 'react-native';

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
