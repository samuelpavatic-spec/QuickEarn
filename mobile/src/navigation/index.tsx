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
import ProfileScreen from '../features/profile/ProfileScreen';
import useAuthStore from '../store/useAuthStore';
import { ClipboardList, Wallet, Users, User } from 'lucide-react-native';
import { COLORS } from '../components/design-system/Theme';

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
