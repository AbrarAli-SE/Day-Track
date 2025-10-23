import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TransactionCard, TransactionData } from '../../components';
import AnimatedSearchBar from '../../components/AnimatedSearchBar';
import { expenseStyles } from '../../styles/expense/expenseStyles';
import { useDrawer } from '../../navigation/DrawerContext';

type RootStackParamList = {
  Splash: undefined;
  OnboardingPages: undefined;
  LoginScreen: undefined;
  MainScreen: undefined;
  ComingSoon: undefined;
};

type BottomTabParamList = {
  Home: undefined;
  Expense: undefined;
  Todo: undefined;
};

type ExpenseScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Expense'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const SAMPLE_TX: TransactionData[] = [
  {
    id: '1',
    title: 'Shopping',
    subtitle: '15 Transaction · Today',
    amount: -5000,
    type: 'expense',
    timestamp: new Date(),
    category: 'Shopping',
    transactionMethod: 'Credit Card',
    notes: 'Monthly groceries and household items',
  },
  {
    id: '2',
    title: 'Shameel',
    subtitle: '15 Transaction · Today',
    amount: 4000,
    type: 'income',
    timestamp: new Date(),
    category: 'Transfer',
    transactionMethod: 'Bank Transfer',
    notes: 'Payment received for project work',
  },
  {
    id: '3',
    title: 'Shopping',
    subtitle: '15 Transaction · Today',
    amount: -5000,
    type: 'expense',
    timestamp: new Date(),
    category: 'Shopping',
    transactionMethod: 'Debit Card',
    notes: 'Electronics purchase',
  },
  {
    id: '4',
    title: 'Shameel',
    subtitle: '15 Transaction · Today',
    amount: 4000,
    type: 'income',
    timestamp: new Date(),
    category: 'Transfer',
    transactionMethod: 'Bank Transfer',
    notes: 'Payment received for project work',
  },
  {
    id: '5',
    title: 'Shopping',
    subtitle: '15 Transaction · Today',
    amount: -5000,
    type: 'expense',
    timestamp: new Date(),
    category: 'Shopping',
    transactionMethod: 'Debit Card',
    notes: 'Electronics purchase',
  },
];

const HEADER_HEIGHT = 60;

export default function ExpenseScreen() {
  const navigation = useNavigation<ExpenseScreenNavigationProp>();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'positive' | 'negative'>('all');
  const [selectedTimeline, setSelectedTimeline] = useState<'1day' | '7days' | 'month' | 'custom'>('7days');
  const [searchResults, setSearchResults] = useState<TransactionData[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { openDrawer } = useDrawer();
  const handleTransactionPress = (id: string) => {
    console.log('Transaction pressed:', id);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const handleSearch = (text: string) => {
    console.log('Searching for:', text);

    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = SAMPLE_TX.filter((transaction) =>
      transaction.title.toLowerCase().includes(text.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(text.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(text.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const navigateToComingSoon = () => {
    navigation.navigate('ComingSoon');
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const applyFilters = () => {
    console.log('Filters applied:', selectedType, selectedTimeline);
    closeFilterModal();
  };

  const renderSearchResult = (item: TransactionData) => (
    <TransactionCard
      data={item}
      onPress={handleTransactionPress}
      style={{ marginBottom: 12 }}
    />
  );

  return (
    <SafeAreaView style={expenseStyles.safeArea}>
      {/* Fixed Header */}
      <View style={expenseStyles.fixedHeader}>
        <View style={expenseStyles.header}>
          <View style={expenseStyles.profile}>
            <TouchableOpacity
              style={expenseStyles.avatarContainer}
              onPress={openDrawer}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../../assets/pic.png')}
                style={expenseStyles.avatarImage}
              />
            </TouchableOpacity>

            <View style={expenseStyles.profileTextContainer}>
              <Text style={expenseStyles.helloText}>Hello,</Text>
              <Text style={expenseStyles.nameText}>Abrar Ali</Text>
            </View>
          </View>

          {/* Animated Search Bar */}
          <AnimatedSearchBar
            placeholder="Search transactions..."
            onSearch={handleSearch}
            searchResults={searchResults}
            renderSearchResult={renderSearchResult}
          />
        </View>

      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={expenseStyles.scrollView}
        contentContainerStyle={expenseStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Top Background */}
        <View style={expenseStyles.topBackground}>
          <View style={expenseStyles.decorativeBlur1} />
          <View style={expenseStyles.decorativeBlur2} />
        </View>

        {/* Spacer for Fixed Header */}
        <View style={{ height: HEADER_HEIGHT }} />

        {/* Content Container */}
        <View style={expenseStyles.contentContainer}>
          {/* Overview Label */}
          <Text style={expenseStyles.overviewLabel}>Overview</Text>

          {/* Balance Card */}
          <View style={expenseStyles.balanceCard}>
            <View style={expenseStyles.balanceHeader}>
              <Text style={expenseStyles.balanceLabel}>Current Balance</Text>
              <TouchableOpacity
                onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                style={expenseStyles.eyeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="rgba(0, 0, 0, 0.60)"
                />
              </TouchableOpacity>
            </View>

            <Text style={expenseStyles.balanceAmount}>
              {isBalanceVisible ? '₹ 5,000' : '₹ ****'}
            </Text>

            {/* Stats Row */}
            <View style={expenseStyles.statsRow}>
              <View style={expenseStyles.statItem}>
                <View style={expenseStyles.statIconContainer}>
                  <Ionicons name="trending-down" size={16} color="#FF3B30" />
                </View>
                <View>
                  <Text style={expenseStyles.statAmount}>₹ 78,900</Text>
                  <Text style={expenseStyles.statLabel}>30 Days Expense</Text>
                </View>
              </View>

              <View style={expenseStyles.statDivider} />

              <View style={expenseStyles.statItem}>
                <View
                  style={[
                    expenseStyles.statIconContainer,
                    { backgroundColor: 'rgba(52, 199, 89, 0.12)' },
                  ]}
                >
                  <Ionicons name="trending-up" size={16} color="#34C759" />
                </View>
                <View>
                  <Text style={[expenseStyles.statAmount, { color: '#34C759' }]}>
                    ₹ 1,500
                  </Text>
                  <Text style={expenseStyles.statLabel}>7 Days Income</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={expenseStyles.actionButtonsContainer}>
            <TouchableOpacity
              style={expenseStyles.actionButton}
              activeOpacity={0.8}
              onPress={navigateToComingSoon}
            >
              <View style={[expenseStyles.actionButtonIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="wallet-outline" size={22} color="#2196F3" />
              </View>
              <Text style={expenseStyles.actionButtonText}>Payouts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={expenseStyles.actionButton}
              activeOpacity={0.8}
              onPress={navigateToComingSoon}
            >
              <View style={[expenseStyles.actionButtonIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="remove-circle-outline" size={22} color="#FF3B30" />
              </View>
              <Text style={expenseStyles.actionButtonText}>Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={expenseStyles.actionButton}
              activeOpacity={0.8}
              onPress={navigateToComingSoon}
            >
              <View style={[expenseStyles.actionButtonIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="time-outline" size={22} color="#9C27B0" />
              </View>
              <Text style={expenseStyles.actionButtonText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={expenseStyles.actionButton}
              activeOpacity={0.8}
              onPress={navigateToComingSoon}
            >
              <View style={[expenseStyles.actionButtonIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="stats-chart-outline" size={22} color="#FF9800" />
              </View>
              <Text style={expenseStyles.actionButtonText}>Analytics</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Transactions Header */}
          <View style={expenseStyles.recentTransactionsHeader}>
            <Text style={expenseStyles.recentTransactionsTitle}>Recent Transactions</Text>
            <TouchableOpacity
              style={expenseStyles.filterButton}
              activeOpacity={0.7}
              onPress={openFilterModal}
            >
              <Ionicons name="filter-outline" size={18} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Transaction List */}
          <View style={expenseStyles.transactionList}>
            {SAMPLE_TX.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                data={transaction}
                onPress={handleTransactionPress}
                style={expenseStyles.transactionCard}
              />
            ))}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeFilterModal}
      >
        <TouchableOpacity
          style={expenseStyles.modalOverlay}
          activeOpacity={1}
          onPress={closeFilterModal}
        >
          <TouchableOpacity
            style={expenseStyles.modalContent}
            activeOpacity={1}
          >
            <View style={expenseStyles.modalHeader}>
              <Text style={expenseStyles.modalTitle}>Filter Transactions</Text>
              <TouchableOpacity
                onPress={closeFilterModal}
                style={expenseStyles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Section 1: Transaction Type */}
            <View style={expenseStyles.filterSection}>
              <Text style={expenseStyles.filterSectionTitle}>Transaction Type</Text>
              <View style={expenseStyles.filterOptionsRow}>
                <TouchableOpacity
                  style={[
                    expenseStyles.filterOption,
                    selectedType === 'all' && expenseStyles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedType('all')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="list-outline"
                    size={20}
                    color={selectedType === 'all' ? '#FFFFFF' : '#000000'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterOptionText,
                      selectedType === 'all' && expenseStyles.filterOptionTextActive,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    expenseStyles.filterOption,
                    selectedType === 'positive' && expenseStyles.filterOptionActivePositive,
                  ]}
                  onPress={() => setSelectedType('positive')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="trending-up"
                    size={20}
                    color={selectedType === 'positive' ? '#FFFFFF' : '#34C759'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterOptionText,
                      selectedType === 'positive' && expenseStyles.filterOptionTextActive,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    expenseStyles.filterOption,
                    selectedType === 'negative' && expenseStyles.filterOptionActiveNegative,
                  ]}
                  onPress={() => setSelectedType('negative')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="trending-down"
                    size={20}
                    color={selectedType === 'negative' ? '#FFFFFF' : '#FF3B30'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterOptionText,
                      selectedType === 'negative' && expenseStyles.filterOptionTextActive,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section 2: Timeline */}
            <View style={expenseStyles.filterSection}>
              <Text style={expenseStyles.filterSectionTitle}>Timeline</Text>
              <View style={expenseStyles.filterOptionsColumn}>
                <TouchableOpacity
                  style={[
                    expenseStyles.filterTimelineOption,
                    selectedTimeline === '1day' && expenseStyles.filterTimelineOptionActive,
                  ]}
                  onPress={() => setSelectedTimeline('1day')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="today-outline"
                    size={20}
                    color={selectedTimeline === '1day' ? '#000000' : 'rgba(0, 0, 0, 0.60)'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterTimelineText,
                      selectedTimeline === '1day' && expenseStyles.filterTimelineTextActive,
                    ]}
                  >
                    Last 1 Day
                  </Text>
                  {selectedTimeline === '1day' && (
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    expenseStyles.filterTimelineOption,
                    selectedTimeline === '7days' && expenseStyles.filterTimelineOptionActive,
                  ]}
                  onPress={() => setSelectedTimeline('7days')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={selectedTimeline === '7days' ? '#000000' : 'rgba(0, 0, 0, 0.60)'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterTimelineText,
                      selectedTimeline === '7days' && expenseStyles.filterTimelineTextActive,
                    ]}
                  >
                    Last 7 Days
                  </Text>
                  {selectedTimeline === '7days' && (
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    expenseStyles.filterTimelineOption,
                    selectedTimeline === 'month' && expenseStyles.filterTimelineOptionActive,
                  ]}
                  onPress={() => setSelectedTimeline('month')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="calendar-number-outline"
                    size={20}
                    color={selectedTimeline === 'month' ? '#000000' : 'rgba(0, 0, 0, 0.60)'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterTimelineText,
                      selectedTimeline === 'month' && expenseStyles.filterTimelineTextActive,
                    ]}
                  >
                    Last Month
                  </Text>
                  {selectedTimeline === 'month' && (
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    expenseStyles.filterTimelineOption,
                    selectedTimeline === 'custom' && expenseStyles.filterTimelineOptionActive,
                  ]}
                  onPress={() => setSelectedTimeline('custom')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="options-outline"
                    size={20}
                    color={selectedTimeline === 'custom' ? '#000000' : 'rgba(0, 0, 0, 0.60)'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterTimelineText,
                      selectedTimeline === 'custom' && expenseStyles.filterTimelineTextActive,
                    ]}
                  >
                    Custom Range
                  </Text>
                  {selectedTimeline === 'custom' && (
                    <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={expenseStyles.modalActions}>
              <TouchableOpacity
                style={expenseStyles.modalResetButton}
                onPress={() => {
                  setSelectedType('all');
                  setSelectedTimeline('7days');
                }}
                activeOpacity={0.8}
              >
                <Text style={expenseStyles.modalResetButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={expenseStyles.modalApplyButton}
                onPress={applyFilters}
                activeOpacity={0.8}
              >
                <Text style={expenseStyles.modalApplyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity >
      </Modal >
    </SafeAreaView >
  );
}