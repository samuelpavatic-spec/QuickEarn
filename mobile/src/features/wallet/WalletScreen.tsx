import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPayoutMethods, requestPayout, getPayoutHistory } from './api';
import { getMe } from '../auth/api';
import { COLORS, TYPOGRAPHY } from '../../components/design-system/Theme';
import { QuickCard } from '../../components/design-system/QuickCard';
import { QuickButton } from '../../components/design-system/QuickButton';
import useAuthStore from '../../store/useAuthStore';

const WalletScreen = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  const { data: userData, refetch: refetchUser, isRefetching: isRefetchingUser } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  useEffect(() => {
    if (userData) {
      updateUser(userData);
    }
  }, [userData]);

  const { data: methods, isLoading: loadingMethods } = useQuery({
    queryKey: ['payoutMethods'],
    queryFn: getPayoutMethods,
  });

  const { data: history, isLoading: loadingHistory, refetch: refetchHistory, isRefetching: isRefetchingHistory } = useQuery({
    queryKey: ['payoutHistory'],
    queryFn: getPayoutHistory,
  });

  const payoutMutation = useMutation({
    mutationFn: requestPayout,
    onSuccess: () => {
      Alert.alert('Success', 'Payout request submitted!');
      setAmount('');
      setDestination('');
      setSelectedMethod(null);
      refetchHistory();
      refetchUser();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to request payout');
    },
  });

  const handleRequest = () => {
    if (!selectedMethod || !amount || !destination) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    payoutMutation.mutate({
      method: selectedMethod,
      amount: amount,
      destination,
    });
  };

  const onRefresh = () => {
    refetchUser();
    refetchHistory();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetchingUser || isRefetchingHistory} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <View className="py-6">
          <Text style={TYPOGRAPHY.h1} className="mb-4">My Wallet</Text>
          
          <QuickCard style={{ backgroundColor: COLORS.primary, padding: 24, borderRadius: 24, borderWidth: 0 }}>
            <Text className="text-white opacity-80 mb-1">Available Balance</Text>
            <Text className="text-white text-4xl font-bold">${user?.balance || '0.00'}</Text>
          </QuickCard>
        </View>

        <View className="mb-8">
          <Text style={TYPOGRAPHY.h2} className="mb-4">Withdraw Funds</Text>
          
          <Text className="text-sm font-medium text-gray-700 mb-2">Select Method</Text>
          <View className="flex-row flex-wrap mb-4">
            {methods?.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedMethod(method.type)}
                className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                  selectedMethod === method.type
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={selectedMethod === method.type ? 'text-white font-bold' : 'text-gray-600'}>
                  {method.type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Amount ($)</Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-xl px-4 bg-gray-50 text-gray-900"
                placeholder="0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">Destination (Phone/Email/Wallet)</Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-xl px-4 bg-gray-50 text-gray-900"
                placeholder="Enter details"
                value={destination}
                onChangeText={setDestination}
              />
            </View>
          </View>

          <QuickButton
            title="Request Withdrawal"
            onPress={handleRequest}
            disabled={payoutMutation.isPending}
            style={{ marginTop: 24, height: 56, borderRadius: 16 }}
          />
        </View>

        <View className="mb-10">
          <Text style={TYPOGRAPHY.h2} className="mb-4">Payout History</Text>
          {loadingHistory ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : history?.length === 0 ? (
            <Text className="text-gray-400 text-center py-4">No history found</Text>
          ) : (
            history?.map((item) => (
              <View key={item.id} className="flex-row justify-between items-center py-4 border-b border-gray-100">
                <View>
                  <Text className="font-bold text-gray-900">{item.method}</Text>
                  <Text className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-gray-900">${item.amount}</Text>
                  <Text className={`text-xs ${
                    item.status === 'SUCCESS' ? 'text-emerald-500' :
                    item.status === 'FAILED' ? 'text-red-500' : 'text-amber-500'
                  }`}>{item.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;
