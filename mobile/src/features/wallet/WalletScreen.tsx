import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, RefreshControl } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPayoutMethods, requestPayout, getPayoutHistory, getCharityOrganizations, getMinecraftProviders } from './api';
import { getMe } from '../auth/api';
import { COLORS, TYPOGRAPHY } from '../../components/design-system/Theme';
import { QuickCard } from '../../components/design-system/QuickCard';
import { QuickButton } from '../../components/design-system/QuickButton';
import useAuthStore from '../../store/useAuthStore';
import { Heart, Server, Cpu, Package, PlusCircle, Calendar } from 'lucide-react-native';

const WalletScreen = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  // Generic fields
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  // Charity fields
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  // Minecraft fields
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [ram, setRam] = useState(2); // GB
  const [modCount, setModCount] = useState('0');
  const [addons, setAddons] = useState<string[]>([]);
  const [duration, setDuration] = useState(1); // Months

  const { data: methods } = useQuery({
    queryKey: ['payoutMethods'],
    queryFn: getPayoutMethods,
  });

  const { data: charities } = useQuery({
    queryKey: ['charities'],
    queryFn: getCharityOrganizations,
    enabled: selectedMethod === 'Charity Donation',
  });

  const { data: providers } = useQuery({
    queryKey: ['minecraftProviders'],
    queryFn: getMinecraftProviders,
    enabled: selectedMethod === 'Minecraft Hosting',
  });

  const { data: userData, refetch: refetchUser, isRefetching: isRefetchingUser } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  useEffect(() => {
    if (userData) {
      updateUser(userData);
    }
  }, [userData]);

  const { data: history, isLoading: loadingHistory, refetch: refetchHistory, isRefetching: isRefetchingHistory } = useQuery({
    queryKey: ['payoutHistory'],
    queryFn: getPayoutHistory,
  });

  const payoutMutation = useMutation({
    mutationFn: requestPayout,
    onSuccess: () => {
      Alert.alert('Success', 'Payout request submitted!');
      resetForm();
      refetchHistory();
      refetchUser();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to request payout');
    },
  });

  const resetForm = () => {
    setAmount('');
    setDestination('');
    setSelectedMethod(null);
    setSelectedOrg(null);
    setSelectedProvider(null);
    setRam(2);
    setModCount('0');
    setAddons([]);
    setDuration(1);
  };

  const minecraftPrice = useMemo(() => {
    if (!selectedProvider) return 0;
    const base = selectedProvider.basePrice;
    const ramPrice = (ram - 1) * 2; // $2 per extra GB
    const modPrice = parseInt(modCount) * 0.1; // $0.10 per mod
    const addonsPrice = addons.length * 1.5; // $1.50 per addon
    return (base + ramPrice + modPrice + addonsPrice) * duration;
  }, [selectedProvider, ram, modCount, addons, duration]);

  const handleRequest = () => {
    let finalAmount = amount;
    let finalDestination = destination;
    let metadata = {};

    if (selectedMethod === 'Charity Donation') {
      if (!selectedOrg || !amount) {
        Alert.alert('Error', 'Please select an organization and amount');
        return;
      }
      finalDestination = selectedOrg;
    } else if (selectedMethod === 'Minecraft Hosting') {
      if (!selectedProvider || !destination) {
        Alert.alert('Error', 'Please select a provider and enter your email/server name');
        return;
      }
      finalAmount = minecraftPrice.toFixed(2);
      metadata = {
        provider: selectedProvider.name,
        ram,
        modCount,
        addons,
        duration
      };
    } else {
      if (!selectedMethod || !amount || !destination) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    }

    if (parseFloat(finalAmount) > (user?.balance || 0)) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds for this withdrawal.');
      return;
    }

    payoutMutation.mutate({
      method: selectedMethod!,
      amount: finalAmount,
      destination: finalDestination,
      metadata
    });
  };

  const onRefresh = () => {
    refetchUser();
    refetchHistory();
  };

  const renderMinecraftForm = () => (
    <View className="space-y-6 mt-4">
      <View>
        <Text className="text-sm font-bold text-gray-700 mb-3">Select Provider</Text>
        <View className="flex-row flex-wrap">
          {providers?.map((p: any) => (
            <TouchableOpacity
              key={p.id}
              onPress={() => setSelectedProvider(p)}
              className={`mr-2 mb-2 px-4 py-2 rounded-xl border ${
                selectedProvider?.id === p.id ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'
              }`}
            >
              <Text className={selectedProvider?.id === p.id ? 'text-white font-bold' : 'text-gray-600'}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-bold text-gray-700">RAM Allocation</Text>
          <Text className="text-emerald-600 font-bold">{ram} GB</Text>
        </View>
        <View className="flex-row items-center space-x-4">
           <TouchableOpacity onPress={() => setRam(Math.max(1, ram - 1))} className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
             <Text className="text-xl font-bold text-gray-600">-</Text>
           </TouchableOpacity>
           <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
             <View style={{ width: `${(ram / 16) * 100}%` }} className="h-full bg-emerald-500" />
           </View>
           <TouchableOpacity onPress={() => setRam(Math.min(16, ram + 1))} className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
             <Text className="text-xl font-bold text-gray-600">+</Text>
           </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Text className="text-sm font-bold text-gray-700 mb-2">Mod Count</Text>
          <TextInput
            className="h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 text-gray-900"
            keyboardType="numeric"
            value={modCount}
            onChangeText={setModCount}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-gray-700 mb-2">Duration (Mo)</Text>
          <View className="flex-row items-center justify-between border border-gray-200 rounded-xl px-2 h-12 bg-gray-50">
             <TouchableOpacity onPress={() => setDuration(Math.max(1, duration - 1))}><Text className="px-2 font-bold">-</Text></TouchableOpacity>
             <Text className="font-bold">{duration}</Text>
             <TouchableOpacity onPress={() => setDuration(duration + 1)}><Text className="px-2 font-bold">+</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <View>
        <Text className="text-sm font-bold text-gray-700 mb-3">Add-ons</Text>
        <View className="flex-row flex-wrap">
          {['Dedicated IP', 'Daily Backups', 'Premium Support', 'Modpack Install'].map((addon) => (
            <TouchableOpacity
              key={addon}
              onPress={() => {
                if (addons.includes(addon)) setAddons(addons.filter(a => a !== addon));
                else setAddons([...addons, addon]);
              }}
              className={`mr-2 mb-2 px-3 py-2 rounded-lg border flex-row items-center ${
                addons.includes(addon) ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200'
              }`}
            >
              {addons.includes(addon) && <PlusCircle size={14} color={COLORS.primary} className="mr-1" />}
              <Text className={`text-xs ${addons.includes(addon) ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}>
                {addon}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View>
        <Text className="text-sm font-bold text-gray-700 mb-2">Server Name / Email</Text>
        <TextInput
          className="h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 text-gray-900"
          placeholder="e.g. my-awesome-server"
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <QuickCard style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', padding: 16 }}>
         <View className="flex-row justify-between items-center">
            <Text className="font-bold text-gray-700">Estimated Total</Text>
            <Text className="text-2xl font-black text-emerald-600">${minecraftPrice.toFixed(2)}</Text>
         </View>
      </QuickCard>
    </View>
  );

  const renderCharityForm = () => (
    <View className="space-y-4 mt-4">
      <Text className="text-sm font-bold text-gray-700 mb-2">Select Organization</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {charities?.map((org: any) => (
          <TouchableOpacity
            key={org.id}
            onPress={() => setSelectedOrg(org.name)}
            className={`mr-3 p-4 rounded-2xl border items-center w-32 ${
              selectedOrg === org.name ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'
            }`}
          >
            <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${selectedOrg === org.name ? 'bg-white/20' : 'bg-emerald-50'}`}>
               <Heart size={24} color={selectedOrg === org.name ? 'white' : COLORS.primary} />
            </View>
            <Text className={`text-xs text-center font-bold ${selectedOrg === org.name ? 'text-white' : 'text-gray-700'}`}>
              {org.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View>
        <Text className="text-sm font-bold text-gray-700 mb-2">Donation Amount ($)</Text>
        <TextInput
          className="h-12 border border-gray-200 rounded-xl px-4 bg-gray-50 text-gray-900"
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
    </View>
  );

  const renderGenericForm = () => (
    <View className="space-y-4 mt-4">
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
  );

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-2">
            {methods?.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => {
                  setSelectedMethod(method.type);
                  // Reset fields when method changes
                  setAmount('');
                  setDestination('');
                }}
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
          </ScrollView>

          {selectedMethod === 'Charity Donation' ? renderCharityForm() : 
           selectedMethod === 'Minecraft Hosting' ? renderMinecraftForm() : 
           selectedMethod ? renderGenericForm() : null}

          {selectedMethod && (
            <QuickButton
              title={selectedMethod === 'Charity Donation' ? 'Donate Now' : 
                     selectedMethod === 'Minecraft Hosting' ? 'Purchase Server' : 'Request Withdrawal'}
              onPress={handleRequest}
              disabled={payoutMutation.isPending}
              style={{ marginTop: 24, height: 56, borderRadius: 16 }}
            />
          )}
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
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
                     {item.method === 'Charity Donation' ? <Heart size={18} color="#E11D48" /> : 
                      item.method === 'Minecraft Hosting' ? <Server size={18} color="#10B981" /> :
                      <Package size={18} color="#6B7280" />}
                  </View>
                  <View>
                    <Text className="font-bold text-gray-900">{item.method}</Text>
                    <Text className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </View>
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
