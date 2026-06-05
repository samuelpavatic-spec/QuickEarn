import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { User, ChevronRight, LogOut, Shield, Bell, HelpCircle, Gift } from 'lucide-react-native';
import useAuthStore from '../../store/useAuthStore';
import { COLORS, TYPOGRAPHY } from '../../components/design-system/Theme';
import { QuickCard } from '../../components/design-system/QuickCard';

const ProfileScreen = () => {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  };

  const MenuItem = ({ icon: Icon, title, onPress, color = '#374151' }) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-gray-50"
    >
      <div className="flex-row items-center">
        <View className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full mr-4">
          <Icon size={20} color={color} />
        </View>
        <Text className="text-base font-medium text-gray-900">{title}</Text>
      </div>
      <ChevronRight size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <View className="w-24 h-24 bg-emerald-50 rounded-full items-center justify-center mb-4 border-4 border-emerald-100">
            <User size={48} color={COLORS.primary} />
          </View>
          <Text style={TYPOGRAPHY.h1} className="mb-1">{user?.fullName || 'User Name'}</Text>
          <Text className="text-gray-500 mb-2">{user?.email || 'user@example.com'}</Text>
          <View className="bg-amber-100 px-3 py-1 rounded-full">
            <Text className="text-amber-800 text-xs font-bold uppercase tracking-wider">Level 1 Earner</Text>
          </View>
        </View>

        <QuickCard style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <View className="p-4 bg-gray-50 border-b border-gray-100">
            <Text className="text-xs font-bold text-gray-400 uppercase">Account Settings</Text>
          </View>
          <View className="px-4">
            <MenuItem icon={User} title="Edit Profile" onPress={() => {}} />
            <MenuItem icon={Bell} title="Notifications" onPress={() => {}} />
            <MenuItem icon={Shield} title="Security" onPress={() => {}} />
          </View>
        </QuickCard>

        <QuickCard style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <View className="p-4 bg-gray-50 border-b border-gray-100">
            <Text className="text-xs font-bold text-gray-400 uppercase">Rewards & Support</Text>
          </View>
          <View className="px-4">
            <MenuItem icon={Gift} title="Redeem Bonus Code" onPress={() => {}} color={COLORS.primary} />
            <MenuItem icon={HelpCircle} title="Help & Support" onPress={() => {}} />
          </View>
        </QuickCard>

        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-50 py-4 rounded-2xl mb-10"
        >
          <LogOut size={20} color="#DC2626" className="mr-2" />
          <Text className="text-red-600 font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
