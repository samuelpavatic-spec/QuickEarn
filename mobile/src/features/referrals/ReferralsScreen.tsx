import React from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Share, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getReferralStats, getReferralsList } from './api';
import { COLORS, TYPOGRAPHY } from '../../components/design-system/Theme';
import { QuickCard } from '../../components/design-system/QuickCard';
import { QuickButton } from '../../components/design-system/QuickButton';
import useAuthStore from '../../store/useAuthStore';

const ReferralsScreen = () => {
  const user = useAuthStore((state) => state.user);
  
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['referralStats'],
    queryFn: getReferralStats,
  });

  const { data: referrals, isLoading: loadingList } = useQuery({
    queryKey: ['referralsList'],
    queryFn: getReferralsList,
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join QuickEarn and start earning money today! Use my referral code: ${user?.referralCode}`,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="py-6">
          <Text style={TYPOGRAPHY.h1} className="mb-4">Refer & Earn</Text>
          
          <QuickCard style={{ backgroundColor: '#EEF2FF', padding: 24, borderRadius: 24, borderWidth: 0 }}>
             <Text className="text-blue-600 font-bold mb-2">Your Referral Code</Text>
             <View className="flex-row justify-between items-center bg-white p-4 rounded-xl border border-blue-100 mb-4">
               <Text className="text-2xl font-black text-gray-900 tracking-widest">{user?.referralCode || '-------'}</Text>
             </View>
             <QuickButton 
               title="Share with Friends" 
               onPress={handleShare} 
               style={{ backgroundColor: '#4F46E5' }} 
             />
             <Text className="text-gray-500 mt-4 text-xs italic text-center">
               Earn 10% of your friends' task earnings for life!
             </Text>
          </QuickCard>
        </View>

        <View className="flex-row mb-8">
          <View className="flex-1 mr-2">
             <QuickCard style={{ alignItems: 'center', padding: 16 }}>
               <Text className="text-gray-500 text-xs mb-1">Total Referrals</Text>
               <Text className="text-2xl font-bold text-gray-900">{stats?.totalReferrals || 0}</Text>
             </QuickCard>
          </View>
          <View className="flex-1 ml-2">
             <QuickCard style={{ alignItems: 'center', padding: 16 }}>
               <Text className="text-gray-500 text-xs mb-1">Total Earned</Text>
               <Text className="text-2xl font-bold text-emerald-600">${stats?.totalEarnings || '0.00'}</Text>
             </QuickCard>
          </View>
        </View>

        <View className="mb-10">
          <Text style={TYPOGRAPHY.h2} className="mb-4">Referral History</Text>
          {loadingList ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : referrals?.length === 0 ? (
            <Text className="text-gray-400 text-center py-8 bg-gray-50 rounded-2xl">No referrals yet. Start inviting friends!</Text>
          ) : (
            referrals?.map((ref) => (
              <View key={ref.id} className="flex-row justify-between items-center py-4 border-b border-gray-100">
                <View>
                  <Text className="font-bold text-gray-900">{ref.fullName}</Text>
                  <Text className="text-xs text-gray-500">Joined: {new Date(ref.createdAt).toLocaleDateString()}</Text>
                </View>
                <View className="bg-emerald-50 px-3 py-1 rounded-full">
                  <Text className="text-emerald-700 text-xs font-bold">Active</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralsScreen;
