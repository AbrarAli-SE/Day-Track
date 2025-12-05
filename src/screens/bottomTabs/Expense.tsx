import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { TransactionCard, AddTransactionModal, ConfirmDialog } from '../../components';
import AnimatedSearchBar from '../../components/AnimatedSearchBar';
import { expenseStyles } from '../../styles/expense/expenseStyles';
import { useDrawer } from '../../navigation/DrawerContext';
import { useTransactions } from '../../hooks/useTransactions';
import { Transaction, CreateTransactionInput, UpdateTransactionInput } from '../../types/expense';

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

const HEADER_HEIGHT = 60;

export default function ExpenseScreen() {
  const navigation = useNavigation<ExpenseScreenNavigationProp>();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedTimeline, setSelectedTimeline] = useState<'today' | '7days' | '30days' | 'month' | 'year'>('30days');
  const scrollY = useRef(new Animated.Value(0)).current;
  const { openDrawer } = useDrawer();

  const {
    filteredTransactions,
    stats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    setFilter,
    searchQuery,
    setSearchQuery,
    searchResults,
    isAuthenticated,
  } = useTransactions();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const getUserName = () => {
    if (!user) return 'Guest User';
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  const getUserPhoto = () => {
    if (user && user.photoURL) {
      return { uri: user.photoURL };
    }
    return require('../../../assets/pic.png');
  };

  const handleTransactionPress = (id: string) => {
    console.log('Transaction pressed:', id);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
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
    setFilter({
      type: selectedType,
      timeline: selectedTimeline,
    });
    closeFilterModal();
  };

  // ✅ Handle add transaction
  const handleAddTransaction = () => {
    if (!isAuthenticated) {
      navigation.navigate('LoginScreen');
      return;
    }
    setEditingTransaction(null);
    setAddModalVisible(true);
  };

  // ✅ Handle edit transaction
  const handleEditTransaction = (id: string) => {
    const transaction = filteredTransactions.find((t) => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setAddModalVisible(true);
    }
  };

  // ✅ Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      const success = await deleteTransaction(transactionToDelete);
      if (success) {
        console.log('✅ Transaction deleted');
      }
    }
    setDeleteConfirmVisible(false);
    setTransactionToDelete(null);
  };

  // ✅ Handle save transaction (add or edit)
  const handleSaveTransaction = async (input: CreateTransactionInput | UpdateTransactionInput) => {
    if (editingTransaction) {
      // Update existing
      await updateTransaction(editingTransaction.id, input);
    } else {
      // Create new
      await createTransaction(input as CreateTransactionInput);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  const renderSearchResult = (item: Transaction) => (
    <TransactionCard
      data={{
        id: item.id,
        title: item.title,
        subtitle: item.category,
        amount: item.type === 'income' ? item.amount : -item.amount,
        type: item.type,
        timestamp: item.date,
        category: item.category,
        transactionMethod: item.paymentMethod,
        notes: item.notes,
      }}
      onPress={handleTransactionPress}
      onEdit={handleEditTransaction}
      onDelete={handleDeleteTransaction}
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
              {/* Profile Avatar */}
              <Image source={getUserPhoto()} style={expenseStyles.avatarImage as any} />
            </TouchableOpacity>

            <View style={expenseStyles.profileTextContainer}>
              <Text style={expenseStyles.helloText}>Hello,</Text>
              <Text style={expenseStyles.nameText}>{getUserName()}</Text>
            </View>
          </View>

          <AnimatedSearchBar
            placeholder="Search transactions..."
            onSearch={handleSearch}
            searchResults={searchResults.map((item) => ({
              id: item.id,
              title: item.title,
              subtitle: item.category,
              amount: item.type === 'income' ? item.amount : -item.amount,
              type: item.type,
              timestamp: item.date,
              category: item.category,
              transactionMethod: item.paymentMethod,
              notes: item.notes,
            }))}
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
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTransactions}
            tintColor="#000000"
          />
        }
      >
        <View style={expenseStyles.topBackground}>
          <View style={expenseStyles.decorativeBlur1} />
          <View style={expenseStyles.decorativeBlur2} />
        </View>

        <View style={{ height: HEADER_HEIGHT }} />

        <View style={expenseStyles.contentContainer}>
          <Text style={expenseStyles.overviewLabel}>Overview</Text>

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
              {isBalanceVisible ? formatCurrency(stats.totalBalance) : 'Rs ****'}
            </Text>

            <View style={expenseStyles.statsRow}>
              <View style={expenseStyles.statItem}>
                <View style={expenseStyles.statIconContainer}>
                  <Ionicons name="trending-down" size={16} color="#FF3B30" />
                </View>
                <View>
                  <Text style={expenseStyles.statAmount}>
                    {formatCurrency(stats.last30DaysExpense)}
                  </Text>
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
                    {formatCurrency(stats.last7DaysIncome)}
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
              onPress={handleAddTransaction}
            >
              <View style={[expenseStyles.actionButtonIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="add-circle-outline" size={22} color="#FF3B30" />
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

          <View style={expenseStyles.transactionList}>
            {filteredTransactions.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Ionicons name="document-text-outline" size={64} color="rgba(0, 0, 0, 0.20)" />
                <Text style={{ marginTop: 16, fontSize: 16, color: 'rgba(0, 0, 0, 0.40)' }}>
                  No transactions yet
                </Text>
                <Text style={{ marginTop: 8, fontSize: 14, color: 'rgba(0, 0, 0, 0.30)' }}>
                  Tap "Add Expense" to get started
                </Text>
              </View>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  data={{
                    id: transaction.id,
                    title: transaction.title,
                    subtitle: transaction.category,
                    amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
                    type: transaction.type,
                    timestamp: transaction.date,
                    category: transaction.category,
                    transactionMethod: transaction.paymentMethod,
                    notes: transaction.notes,
                  }}
                  onPress={handleTransactionPress}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                  style={expenseStyles.transactionCard}
                />
              ))
            )}
          </View>
        </View>

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
          <TouchableOpacity style={expenseStyles.modalContent} activeOpacity={1}>
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
                    selectedType === 'income' && expenseStyles.filterOptionActivePositive,
                  ]}
                  onPress={() => setSelectedType('income')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="trending-up"
                    size={20}
                    color={selectedType === 'income' ? '#FFFFFF' : '#34C759'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterOptionText,
                      selectedType === 'income' && expenseStyles.filterOptionTextActive,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    expenseStyles.filterOption,
                    selectedType === 'expense' && expenseStyles.filterOptionActiveNegative,
                  ]}
                  onPress={() => setSelectedType('expense')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="trending-down"
                    size={20}
                    color={selectedType === 'expense' ? '#FFFFFF' : '#FF3B30'}
                  />
                  <Text
                    style={[
                      expenseStyles.filterOptionText,
                      selectedType === 'expense' && expenseStyles.filterOptionTextActive,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={expenseStyles.filterSection}>
              <Text style={expenseStyles.filterSectionTitle}>Timeline</Text>
              <View style={expenseStyles.filterOptionsColumn}>
                {[
                  { value: 'today', label: 'Today', icon: 'today-outline' },
                  { value: '7days', label: 'Last 7 Days', icon: 'calendar-outline' },
                  { value: '30days', label: 'Last 30 Days', icon: 'calendar-number-outline' },
                  { value: 'month', label: 'This Month', icon: 'calendar-outline' },
                  { value: 'year', label: 'This Year', icon: 'calendar-outline' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      expenseStyles.filterTimelineOption,
                      selectedTimeline === option.value && expenseStyles.filterTimelineOptionActive,
                    ]}
                    onPress={() => setSelectedTimeline(option.value as any)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={option.icon as any}
                      size={20}
                      color={selectedTimeline === option.value ? '#000000' : 'rgba(0, 0, 0, 0.60)'}
                    />
                    <Text
                      style={[
                        expenseStyles.filterTimelineText,
                        selectedTimeline === option.value && expenseStyles.filterTimelineTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {selectedTimeline === option.value && (
                      <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={expenseStyles.modalActions}>
              <TouchableOpacity
                style={expenseStyles.modalResetButton}
                onPress={() => {
                  setSelectedType('all');
                  setSelectedTimeline('30days');
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
        </TouchableOpacity>
      </Modal>

      {/* Add/Edit Transaction Modal */}
      <AddTransactionModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        isLoading={isCreating || isUpdating}
        editTransaction={editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="#FF3B30"
        icon="trash-outline"
        iconColor="#FF3B30"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmVisible(false);
          setTransactionToDelete(null);
        }}
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
}