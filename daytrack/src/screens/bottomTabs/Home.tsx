import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { homeStyles as styles } from '../../styles/homeStyles';
import { useDrawer } from '../../navigation/DrawerContext';
import { useTransactions } from '../../hooks/useTransactions';
import { useTasks } from '../../hooks/useTasks';
import { usePayouts } from '../../hooks/usePayouts';
import Colors from '../../constants/colors';


export default function Home() {
  const navigation = useNavigation<any>();
  const { openDrawer } = useDrawer();
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);


  const { stats: expenseStats, transactions, refreshTransactions } = useTransactions();
  const { stats: taskStats, tasks, refreshTasks } = useTasks();
  const { stats: payoutStats } = usePayouts();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshTransactions(), refreshTasks()]);
    setRefreshing(false);
  };

  const getUserName = () => {
    if (!user) return 'Guest';
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  const getUserPhoto = () => {
    if (user && user.photoURL) {
      return { uri: user.photoURL };
    }
    return require('../../../assets/pic.png');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatCurrency = (amount: number) => {
    return `Rs ${Math.abs(amount).toLocaleString('en-IN')}`;
  };

  // Get recent transactions (last 3)
  const recentTransactions = transactions.slice(0, 3);

  // Get today's tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = tasks
    .filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow && !task.completed;
    })
    .slice(0, 3);

  // Calculate total balance including payouts
  const totalBalance = expenseStats.totalBalance + payoutStats.netBalance;

  // Generate insights
  const getInsights = () => {
    const insights = [];

    // Savings insight
    if (expenseStats.savingsRate > 20) {
      insights.push({
        type: 'positive',
        icon: 'trending-up',
        color: Colors.positiveColor,
        title: 'Great Savings! 💰',
        message: `You're saving ${expenseStats.savingsRate.toFixed(0)}% of your income this month.`,
      });
    } else if (expenseStats.savingsRate < 0) {
      insights.push({
        type: 'warning',
        icon: 'alert-circle',
        color: '#FF9800',
        title: 'Spending Alert ⚠️',
        message: 'Your expenses exceed income this month. Consider reducing spending.',
      });
    }

    // Task completion
    if (taskStats.todayCompleted === taskStats.todayTasks && taskStats.todayTasks > 0) {
      insights.push({
        type: 'success',
        icon: 'checkmark-circle',
        color: '#34C759',
        title: 'All Done! 🎉',
        message: `You completed all ${taskStats.todayTasks} tasks today. Excellent work!`,
      });
    } else if (taskStats.todayTasks > 0) {
      insights.push({
        type: 'info',
        icon: 'time',
        color: '#0047AB',
        title: 'Tasks Pending 📝',
        message: `You have ${taskStats.todayTasks - taskStats.todayCompleted} tasks remaining today.`,
      });
    }

    // Payout reminder
    if (payoutStats.pendingPayments > 0) {
      insights.push({
        type: 'reminder',
        icon: 'wallet',
        color: '#9C27B0',
        title: 'Payment Reminder 💳',
        message: `You have ${payoutStats.pendingPayments} pending payment${payoutStats.pendingPayments > 1 ? 's' : ''} totaling ${formatCurrency(payoutStats.totalPayTo)}.`,
      });
    }

    return insights.slice(0, 2); // Show max 2 insights
  };

  const insights = getInsights();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#000000" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.profileSection}>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={openDrawer}
                activeOpacity={0.8}
              >
                <Image source={getUserPhoto()} style={styles.avatarImage} />
              </TouchableOpacity>

              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{getGreeting()},</Text>
                <Text style={styles.userName}>{getUserName()}</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => navigation.navigate('Notifications')}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications-outline" size={22} color={Colors.primaryBlack} />
                {taskStats.todayTasks > 0 && <View style={styles.notificationDot} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Balance Card - EXACTLY SAME AS EXPENSE SCREEN */}
        <View style={styles.balanceCardContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity
                onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="rgba(0, 0, 0, 0.60)"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.balanceAmount}>
              {isBalanceVisible ? formatCurrency(totalBalance) : 'Rs ****'}
            </Text>

            {isBalanceVisible && (
              <Text style={{ fontSize: 11, color: Colors.secondaryBlack, marginTop: 4, marginBottom: 16 }}>
                Transactions: {formatCurrency(expenseStats.totalBalance)} | Payouts: {formatCurrency(payoutStats.netBalance)}
              </Text>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statsStatItem}>
                <View style={styles.statsStatIconContainer}>
                  <Ionicons name="trending-down" size={16} color="#FF3B30" />
                </View>
                <View>
                  <Text style={styles.statsStatAmount}>
                    {isBalanceVisible ? formatCurrency(expenseStats.last30DaysExpense) : '****'}
                  </Text>
                  <Text style={styles.statsStatLabel}>30 Days Expense</Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statsStatItem}>
                <View
                  style={[
                    styles.statsStatIconContainer,
                    { backgroundColor: 'rgba(52, 199, 89, 0.12)' },
                  ]}
                >
                  <Ionicons name="trending-up" size={16} color="#34C759" />
                </View>
                <View>
                  <Text style={[styles.statsStatAmount, { color: '#34C759' }]}>
                    {isBalanceVisible ? formatCurrency(expenseStats.last7DaysIncome) : '****'}
                  </Text>
                  <Text style={styles.statsStatLabel}>7 Days Income</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStatsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: 'rgba(0, 71, 171, 0.12)' },
                ]}
              >
                <Ionicons name="checkmark-done" size={20} color={Colors.positiveColor} />
              </View>
              <Text style={styles.statValue}>
                {taskStats.todayCompleted}/{taskStats.todayTasks}
              </Text>
              <Text style={styles.statLabel}>Tasks Today</Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: 'rgba(226, 0, 0, 0.12)' },
                ]}
              >
                <Ionicons name="trending-down" size={20} color={Colors.negativeColor} />
              </View>
              <Text style={styles.statValue}>
                {formatCurrency(expenseStats.last7DaysExpense)}
              </Text>
              <Text style={styles.statLabel}>Week Expense</Text>
            </View>

            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: 'rgba(255, 152, 0, 0.12)' },
                ]}
              >
                <Ionicons name="wallet" size={20} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{payoutStats.pendingPayments + payoutStats.pendingReceipts}</Text>
              <Text style={styles.statLabel}>Pending Payouts</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Expense')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: '#FFEBEE' },
                ]}
              >
                <Ionicons name="add-circle" size={22} color="#E20000" />
              </View>
              <Text style={styles.quickActionText}>Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Todo')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: '#E3F2FD' },
                ]}
              >
                <Ionicons name="add-circle" size={22} color="#2196F3" />
              </View>
              <Text style={styles.quickActionText}>Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PayoutScreen')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: '#F3E5F5' },
                ]}
              >
                <Ionicons name="people" size={22} color="#9C27B0" />
              </View>
              <Text style={styles.quickActionText}>Payouts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AnalyticsScreen')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: '#FFF3E0' },
                ]}
              >
                <Ionicons name="stats-chart" size={22} color="#FF9800" />
              </View>
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Insights */}
        {insights.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Insights</Text>
            {insights.map((insight, index) => (
              <View
                key={index}
                style={[
                  styles.insightsCard,
                  { borderLeftColor: insight.color },
                ]}
              >
                <View style={styles.insightHeader}>
                  <View
                    style={[
                      styles.insightIconContainer,
                      { backgroundColor: insight.color + '20' },
                    ]}
                  >
                    <Ionicons name={insight.icon as any} size={18} color={insight.color} />
                  </View>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                </View>
                <Text style={styles.insightMessage}>{insight.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Expense')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.positiveColor} />
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={28} color="rgba(0, 0, 0, 0.20)" />
              </View>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionItem}
                onPress={() => navigation.navigate('Expense')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.transactionIconContainer,
                    {
                      backgroundColor:
                        transaction.type === 'income'
                          ? 'rgba(0, 71, 171, 0.12)'
                          : 'rgba(226, 0, 0, 0.12)',
                    },
                  ]}
                >
                  <Ionicons
                    name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={transaction.type === 'income' ? Colors.positiveColor : Colors.negativeColor}
                  />
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionCategory}>{transaction.category}</Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        transaction.type === 'income'
                          ? Colors.positiveColor
                          : Colors.negativeColor,
                    },
                  ]}
                >
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Today's Tasks */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Todo')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.positiveColor} />
            </TouchableOpacity>
          </View>

          {todayTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="checkmark-done-outline" size={28} color="rgba(0, 0, 0, 0.20)" />
              </View>
              <Text style={styles.emptyText}>
                {taskStats.todayCompleted === taskStats.todayTasks && taskStats.todayTasks > 0
                  ? 'All tasks completed! 🎉'
                  : 'No tasks for today'}
              </Text>
            </View>
          ) : (
            todayTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => navigation.navigate('Todo')}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.taskCheckbox,
                    { borderColor: task.categoryColor },
                  ]}
                >
                  {task.completed && (
                    <Ionicons name="checkmark" size={16} color={task.categoryColor} />
                  )}
                </View>

                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskTime}>
                    {task.dueTime || 'All day'} · {task.category}
                  </Text>
                </View>

                <View
                  style={[
                    styles.taskCategoryBadge,
                    { backgroundColor: task.categoryColor + '20' },
                  ]}
                >
                  <Text style={[styles.taskCategoryText, { color: task.categoryColor }]}>
                    {task.priority.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}