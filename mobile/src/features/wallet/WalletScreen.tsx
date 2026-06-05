import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput, RefreshControl, Platform } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPayoutMethods, requestPayout, getPayoutHistory, getCharityOrganizations, getMinecraftProviders } from './api';
import { getMe } from '../auth/api';
import { COLORS, TYPOGRAPHY, SPACING } from '../../components/design-system/Theme';
import { QuickCard } from '../../components/design-system/QuickCard';
import { QuickButton } from '../../components/design-system/QuickButton';
import useAuthStore from '../../store/useAuthStore';
import { Heart, Server, Cpu, Package, PlusCircle, Calendar, ChevronRight, CheckCircle2, Info, Gift, CreditCard, ArrowRight } from 'lucide-react-native';

const WalletScreen = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  // generic flow state
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');

  // stepper state for complex flows
  const [step, setStep] = useState(1);

  // Charity state
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Minecraft state
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
      Alert.alert('Success', 'Request submitted successfully!');
      resetForm();
      refetchHistory();
      refetchUser();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to process request');
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
    setStep(1);
  };

  const minecraftPrice = useMemo(() => {
    if (!selectedProvider) return 0;
    const base = selectedProvider.basePrice;
    const ramPrice = (ram - 1) * 1.5; // $1.5 per extra GB
    const modPrice = parseInt(modCount || '0') * 0.05; // $0.05 per mod
    const addonsPrice = addons.length * 1.0; // $1.00 per addon
    return (base + ramPrice + modPrice + addonsPrice) * duration;
  }, [selectedProvider, ram, modCount, addons, duration]);

  const handleRequest = () => {
    let finalAmount = amount;
    let finalDestination = destination;
    let metadata = {};

    if (selectedMethod === 'Charity Donation') {
      finalDestination = selectedOrg?.name;
      metadata = { organizationId: selectedOrg?.id };
    } else if (selectedMethod === 'Minecraft Hosting') {
      finalAmount = minecraftPrice.toFixed(2);
      metadata = {
        provider: selectedProvider.name,
        ram: `${ram}GB`,
        modCount,
        addons,
        duration: `${duration} month(s)`
      };
    }

    if (parseFloat(finalAmount) > (user?.balance || 0)) {
      Alert.alert('Insufficient Balance', 'You need more funds to complete this action.');
      return;
    }

    if (!finalAmount || !finalDestination) {
      Alert.alert('Missing Info', 'Please fill in all required fields.');
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

  const renderMinecraftStep = () => {
    switch(step) {
      case 1:
        return (
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Step 1: Pick Hosting Provider</Text>
            {providers?.map((p: any) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => { setSelectedProvider(p); setStep(2); }}
                className={`mb-3 p-4 rounded-2xl border-2 flex-row justify-between items-center ${
                  selectedProvider?.id === p.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'
                }`}
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Server size={20} color={COLORS.primary} />
                  </View>
                  <Text className="text-base font-bold text-gray-700">{p.name}</Text>
                </View>
                <Text className="text-emerald-600 font-bold">from ${p.basePrice}/mo</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 2:
        return (
          <View className="mt-4">
            <TouchableOpacity onPress={() => setStep(1)} className="mb-4 flex-row items-center">
               <Text className="text-emerald-600 font-bold">← Back to Providers</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800 mb-2">Step 2: RAM & Duration</Text>
            
            <QuickCard style={{ marginBottom: 20 }}>
               <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <Cpu size={20} color={COLORS.primary} className="mr-2" />
                    <Text className="font-bold text-gray-700">RAM (Memory)</Text>
                  </View>
                  <Text className="text-emerald-600 font-bold text-lg">{ram} GB</Text>
               </View>
               
               <View className="flex-row items-center mb-6">
                  {[1, 2, 4, 6, 8].map(val => (
                    <TouchableOpacity 
                      key={val}
                      onPress={() => setRam(val)}
                      className={`flex-1 h-12 items-center justify-center border ${
                        ram === val ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'
                      } ${val === 1 ? 'rounded-l-xl' : ''} ${val === 8 ? 'rounded-r-xl' : ''}`}
                    >
                      <Text className={ram === val ? 'text-white font-bold' : 'text-gray-500'}>{val}G</Text>
                    </TouchableOpacity>
                  ))}
               </View>

               <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Calendar size={20} color={COLORS.primary} className="mr-2" />
                    <Text className="font-bold text-gray-700">Duration</Text>
                  </View>
                  <Text className="text-emerald-600 font-bold text-lg">{duration} Mo</Text>
               </View>
               <View className="flex-row items-center mt-4">
                  {[1, 3, 6, 12].map(val => (
                    <TouchableOpacity 
                      key={val}
                      onPress={() => setDuration(val)}
                      className={`flex-1 h-12 items-center justify-center border ${
                        duration === val ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-200'
                      } ${val === 1 ? 'rounded-l-xl' : ''} ${val === 12 ? 'rounded-r-xl' : ''}`}
                    >
                      <Text className={duration === val ? 'text-white font-bold' : 'text-gray-500'}>{val}M</Text>
                    </TouchableOpacity>
                  ))}
               </View>
            </QuickCard>

            <QuickButton title="Next: Mods & Add-ons" onPress={() => setStep(3)} />
          </View>
        );
      case 3:
        return (
          <View className="mt-4">
            <TouchableOpacity onPress={() => setStep(2)} className="mb-4 flex-row items-center">
               <Text className="text-emerald-600 font-bold">← Back to Resources</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800 mb-4">Step 3: Mod Count & Extras</Text>
            
            <View className="mb-6">
               <Text className="text-sm font-bold text-gray-600 mb-2">Estimated Mod Count</Text>
               <TextInput
                  className="h-14 border border-gray-200 rounded-xl px-4 bg-gray-50 text-lg font-bold"
                  keyboardType="numeric"
                  value={modCount}
                  onChangeText={setModCount}
               />
            </View>

            <Text className="text-sm font-bold text-gray-600 mb-3">Optional Add-ons</Text>
            <View className="flex-row flex-wrap mb-6">
              {['Dedicated IP', 'Daily Backups', 'MySQL DB', 'Premium Support'].map((addon) => (
                <TouchableOpacity
                  key={addon}
                  onPress={() => {
                    if (addons.includes(addon)) setAddons(addons.filter(a => a !== addon));
                    else setAddons([...addons, addon]);
                  }}
                  className={`mr-2 mb-2 px-4 py-3 rounded-xl border-2 flex-row items-center ${
                    addons.includes(addon) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'
                  }`}
                >
                  <View className={`w-5 h-5 rounded border items-center justify-center mr-2 ${addons.includes(addon) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                    {addons.includes(addon) && <CheckCircle2 size={14} color="white" />}
                  </View>
                  <Text className={addons.includes(addon) ? 'text-emerald-800 font-bold' : 'text-gray-600'}>{addon}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <QuickButton title="Review Order" onPress={() => setStep(4)} />
          </View>
        );
      case 4:
        return (
          <View className="mt-4">
            <TouchableOpacity onPress={() => setStep(3)} className="mb-4 flex-row items-center">
               <Text className="text-emerald-600 font-bold">← Back to Mods</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800 mb-4">Final Step: Summary</Text>

            <QuickCard style={{ backgroundColor: '#F8FAFC', padding: 20, marginBottom: 24 }}>
               <View>
                  <View className="flex-row justify-between mb-3">
                     <Text className="text-gray-500">Provider</Text>
                     <Text className="font-bold text-gray-800">{selectedProvider?.name}</Text>
                  </View>
                  <View className="flex-row justify-between mb-3">
                     <Text className="text-gray-500">Config</Text>
                     <Text className="font-bold text-gray-800">{ram}GB RAM, {modCount} Mods</Text>
                  </View>
                  <View className="flex-row justify-between mb-3">
                     <Text className="text-gray-500">Duration</Text>
                     <Text className="font-bold text-gray-800">{duration} Month(s)</Text>
                  </View>
                  <View className="h-px bg-gray-200 my-2" />
                  <View className="flex-row justify-between items-center mt-1">
                     <Text className="text-lg font-bold text-gray-900">Total Price</Text>
                     <Text className="text-2xl font-black text-emerald-600">${minecraftPrice.toFixed(2)}</Text>
                  </View>
               </View>
            </QuickCard>

            <Text className="text-sm font-bold text-gray-600 mb-2">Server Name / Contact Email</Text>
            <TextInput
               className="h-14 border border-gray-200 rounded-xl px-4 bg-gray-50 mb-6"
               placeholder="e.g. survival-pro / me@example.com"
               value={destination}
               onChangeText={setDestination}
            />

            <QuickButton 
              title="Confirm & Purchase" 
              onPress={handleRequest} 
              disabled={payoutMutation.isPending}
            />
          </View>
        );
    }
  };

  const renderCharityFlow = () => (
    <View className="mt-4">
      <Text className="text-lg font-bold text-gray-800 mb-4">Donate to a Cause</Text>
      
      <QuickCard style={{ backgroundColor: '#FFFBEB', borderColor: '#FEF3C7', marginBottom: 20 }}>
         <View className="flex-row items-center">
            <Info size={18} color="#D97706" className="mr-2" />
            <Text className="text-amber-800 text-xs font-medium flex-1">
               QuickEarn waives all withdrawal fees for charity donations. 100% of your earnings go to the organization.
            </Text>
         </View>
      </QuickCard>

      <Text className="text-sm font-bold text-gray-600 mb-3">Select Organization</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-6">
        {charities?.map((org: any) => (
          <TouchableOpacity
            key={org.id}
            onPress={() => setSelectedOrg(org)}
            className={`mr-3 p-5 rounded-2xl border-2 items-center w-40 ${
              selectedOrg?.id === org.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white'
            }`}
          >
            <View className={`w-14 h-14 rounded-full items-center justify-center mb-3 ${selectedOrg?.id === org.id ? 'bg-emerald-500' : 'bg-emerald-50'}`}>
               <Heart size={28} color={selectedOrg?.id === org.id ? 'white' : COLORS.primary} />
            </View>
            <Text className={`text-sm text-center font-bold mb-1 ${selectedOrg?.id === org.id ? 'text-emerald-800' : 'text-gray-700'}`}>
              {org.name}
            </Text>
            <Text className="text-xs text-gray-400">{org.category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedOrg && (
        <View>
          <View className="mb-4">
            <Text className="text-sm font-bold text-gray-600 mb-2">Donation Amount ($)</Text>
            <TextInput
              className="h-14 border border-gray-200 rounded-xl px-4 bg-gray-50 text-xl font-bold"
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          <QuickButton 
            title={`Donate to ${selectedOrg.name}`} 
            onPress={handleRequest} 
            disabled={payoutMutation.isPending}
          />
        </View>
      )}
    </View>
  );

  const renderGenericFlow = () => (
    <View className="mt-4">
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">Amount ($)</Text>
        <TextInput
          className="h-14 border border-gray-300 rounded-xl px-4 bg-gray-50 text-lg font-bold"
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          {selectedMethod?.includes('Gift Card') ? 'Email for Delivery' : 
           selectedMethod === 'PayPal' ? 'PayPal Email' :
           selectedMethod === 'Visa Prepaid' ? 'Contact Email' : 'Destination Details'}
        </Text>
        <TextInput
          className="h-14 border border-gray-300 rounded-xl px-4 bg-gray-50"
          placeholder="Enter details"
          value={destination}
          onChangeText={setDestination}
        />
      </View>
      <QuickButton
        title="Request Withdrawal"
        onPress={handleRequest}
        disabled={payoutMutation.isPending}
      />
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
          
          <QuickCard style={{ backgroundColor: COLORS.primary, padding: 24, borderRadius: 28, borderWidth: 0 }}>
            <Text className="text-white opacity-80 mb-1">Available Balance</Text>
            <Text className="text-white text-4xl font-black">${user?.balance || '0.00'}</Text>
            <View className="mt-4 flex-row items-center bg-white/20 self-start px-3 py-1 rounded-full">
               <CheckCircle2 size={14} color="white" className="mr-1" />
               <Text className="text-white text-xs font-bold">Verified Account</Text>
            </View>
          </QuickCard>
        </View>

        <View className="mb-8">
          <Text style={TYPOGRAPHY.h2} className="mb-4">Withdraw Funds</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
            {methods?.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => {
                  setSelectedMethod(method.type);
                  setAmount('');
                  setDestination('');
                  setStep(1);
                }}
                className={`mr-3 px-6 py-3 rounded-2xl border-2 flex-row items-center ${
                  selectedMethod === method.type
                    ? 'bg-emerald-500 border-emerald-500 shadow-md'
                    : 'bg-white border-gray-100'
                }`}
              >
                {method.type === 'Charity Donation' && <Heart size={18} color={selectedMethod === method.type ? 'white' : '#E11D48'} className="mr-2" />}
                {method.type === 'Minecraft Hosting' && <Server size={18} color={selectedMethod === method.type ? 'white' : '#10B981'} className="mr-2" />}
                {method.type.includes('Gift Card') && <Gift size={18} color={selectedMethod === method.type ? 'white' : '#6366F1'} className="mr-2" />}
                {method.type === 'Visa Prepaid' && <CreditCard size={18} color={selectedMethod === method.type ? 'white' : '#3B82F6'} className="mr-2" />}
                
                <Text className={`font-bold ${selectedMethod === method.type ? 'text-white' : 'text-gray-600'}`}>
                  {method.type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedMethod === 'Charity Donation' ? renderCharityFlow() : 
           selectedMethod === 'Minecraft Hosting' ? renderMinecraftStep() : 
           selectedMethod ? renderGenericFlow() : (
             <View className="items-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Package size={48} color="#9CA3AF" />
                <Text className="text-gray-400 mt-2 font-medium">Select a method above to continue</Text>
             </View>
           )}
        </View>

        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-6">
             <Text style={TYPOGRAPHY.h2}>Transaction History</Text>
             <TouchableOpacity onPress={refetchHistory} className="flex-row items-center">
                <Text className="text-emerald-600 font-bold mr-1">See All</Text>
                <ArrowRight size={14} color="#10B981" />
             </TouchableOpacity>
          </View>
          
          {loadingHistory ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : history?.length === 0 ? (
            <View className="items-center py-8">
               <Text className="text-gray-400">No transactions found</Text>
            </View>
          ) : (
            history?.map((item) => (
              <View key={item.id} className="flex-row justify-between items-center py-5 border-b border-gray-50">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center mr-4">
                     {item.method === 'Charity Donation' ? <Heart size={22} color="#E11D48" /> : 
                      item.method === 'Minecraft Hosting' ? <Server size={22} color="#10B981" /> :
                      item.method.includes('Gift Card') ? <Gift size={22} color="#6366F1" /> :
                      <Package size={22} color="#6B7280" />}
                  </View>
                  <View>
                    <Text className="font-bold text-gray-900 text-base">{item.method}</Text>
                    <Text className="text-xs text-gray-500 font-medium">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-gray-900 text-base">${parseFloat(item.amount).toFixed(2)}</Text>
                  <View className={`px-2 py-0.5 rounded-md mt-1 ${
                    item.status === 'SUCCESS' ? 'bg-emerald-100' :
                    item.status === 'FAILED' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <Text className={`text-[10px] font-black uppercase ${
                      item.status === 'SUCCESS' ? 'text-emerald-700' :
                      item.status === 'FAILED' ? 'text-red-700' : 'text-amber-700'
                    }`}>{item.status}</Text>
                  </View>
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
