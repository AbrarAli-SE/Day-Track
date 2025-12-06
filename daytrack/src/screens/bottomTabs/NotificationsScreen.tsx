// src/screens/Notifications.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { notificationStyles } from '../../styles/todo/notificationStyles';
import { useTransactions } from '../../hooks/useTransactions';
import { useTasks } from '../../hooks/useTasks';
import { usePayouts } from '../../hooks/usePayouts';
import Colors from '../../constants/colors';

interface Notification {
    id: string;
    type: 'task' | 'expense' | 'payout' | 'achievement' | 'reminder';
    title: string;
    message: string;
    time: string;
    icon: string;
    color: string;
    unread: boolean;
    actionScreen?: string;
}

export default function NotificationsScreen() {
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread' | 'tasks' | 'expense'>('all');
    const [readNotifications, setReadNotifications] = useState<string[]>([]);

    // Get data from hooks
    const { transactions, stats: expenseStats, refreshTransactions } = useTransactions();
    const { tasks, stats: taskStats, refreshTasks } = useTasks();
    const { payouts, stats: payoutStats } = usePayouts();

    // Helper function - MOVED BEFORE useMemo
    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        if (days === 1) return 'Yesterday';
        return `${days}d ago`;
    };

    const formatCurrency = (amount: number) => {
        return `Rs ${Math.abs(amount).toLocaleString('en-IN')}`;
    };

    // Generate dynamic notifications
    const notifications = useMemo(() => {
        const notifs: Notification[] = [];
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. Pending tasks for today
        const pendingTodayTasks = tasks.filter((task) => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= today && taskDate < tomorrow && !task.completed;
        });

        if (pendingTodayTasks.length > 0) {
            notifs.push({
                id: 'pending-tasks-today',
                type: 'task',
                title: `📋 ${pendingTodayTasks.length} Task${pendingTodayTasks.length > 1 ? 's' : ''} Today`,
                message: pendingTodayTasks.length === 1
                    ? `Don't forget: "${pendingTodayTasks[0].title}"`
                    : `You have ${pendingTodayTasks.length} pending tasks for today`,
                time: 'Now',
                icon: 'time-outline',
                color: Colors.positiveColor,
                unread: !readNotifications.includes('pending-tasks-today'),
                actionScreen: 'Todo',
            });
        }

        // 2. High priority tasks
        const highPriorityTasks = tasks.filter(
            (task) => task.priority === 'high' && !task.completed
        );

        if (highPriorityTasks.length > 0) {
            notifs.push({
                id: 'high-priority-tasks',
                type: 'reminder',
                title: '🔴 High Priority Tasks',
                message: `${highPriorityTasks.length} high priority task${highPriorityTasks.length > 1 ? 's' : ''} need your attention`,
                time: 'Important',
                icon: 'alert-circle-outline',
                color: Colors.negativeColor,
                unread: !readNotifications.includes('high-priority-tasks'),
                actionScreen: 'Todo',
            });
        }

        // 3. Tasks due tomorrow
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        const tasksDueTomorrow = tasks.filter((task) => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= tomorrow && taskDate < dayAfterTomorrow && !task.completed;
        });

        if (tasksDueTomorrow.length > 0) {
            notifs.push({
                id: 'tasks-tomorrow',
                type: 'task',
                title: '📆 Upcoming Tomorrow',
                message: `${tasksDueTomorrow.length} task${tasksDueTomorrow.length > 1 ? 's' : ''} due tomorrow`,
                time: 'Tomorrow',
                icon: 'calendar-outline',
                color: '#FF9800',
                unread: !readNotifications.includes('tasks-tomorrow'),
                actionScreen: 'Todo',
            });
        }

        // 4. Pending payouts (Pay To)
        if (payoutStats.pendingPayments > 0) {
            notifs.push({
                id: 'pending-payments',
                type: 'payout',
                title: '💳 Payments Due',
                message: `You owe ${formatCurrency(payoutStats.totalPayTo)} to ${payoutStats.pendingPayments} ${payoutStats.pendingPayments > 1 ? 'people' : 'person'}`,
                time: 'Action needed',
                icon: 'wallet-outline',
                color: '#9C27B0',
                unread: !readNotifications.includes('pending-payments'),
                actionScreen: 'PayoutScreen',
            });
        }

        // 5. Pending receipts (Receive From)
        if (payoutStats.pendingReceipts > 0) {
            notifs.push({
                id: 'pending-receipts',
                type: 'payout',
                title: '💰 Receivables',
                message: `${formatCurrency(payoutStats.totalReceiveFrom)} expected from ${payoutStats.pendingReceipts} ${payoutStats.pendingReceipts > 1 ? 'people' : 'person'}`,
                time: 'Follow up',
                icon: 'cash-outline',
                color: '#34C759',
                unread: !readNotifications.includes('pending-receipts'),
                actionScreen: 'PayoutScreen',
            });
        }

        // 6. Weekly expense insight
        if (expenseStats.last7DaysExpense > 0) {
            const avgDaily = expenseStats.last7DaysExpense / 7;
            notifs.push({
                id: 'weekly-expense',
                type: 'expense',
                title: '📊 Weekly Spending',
                message: `You spent ${formatCurrency(expenseStats.last7DaysExpense)} this week (${formatCurrency(avgDaily)}/day avg)`,
                time: 'This week',
                icon: 'trending-down',
                color: '#FF6B6B',
                unread: !readNotifications.includes('weekly-expense'),
                actionScreen: 'Expense',
            });
        }

        // 7. Task streak achievement
        if (taskStats.weekStreak >= 3) {
            notifs.push({
                id: 'streak-achievement',
                type: 'achievement',
                title: '🔥 Streak Achievement!',
                message: `${taskStats.weekStreak} day streak! Keep up the amazing work!`,
                time: 'Achievement',
                icon: 'trophy-outline',
                color: '#FF9800',
                unread: !readNotifications.includes('streak-achievement'),
            });
        }

        // 8. All tasks completed today
        if (taskStats.todayCompleted === taskStats.todayTasks && taskStats.todayTasks > 0) {
            notifs.push({
                id: 'all-completed',
                type: 'achievement',
                title: '🎉 All Done Today!',
                message: `Congratulations! You completed all ${taskStats.todayTasks} tasks today.`,
                time: 'Today',
                icon: 'checkmark-circle-outline',
                color: '#34C759',
                unread: !readNotifications.includes('all-completed'),
            });
        }

        // 9. Savings rate insight
        if (expenseStats.savingsRate > 0) {
            const savingsColor = expenseStats.savingsRate > 20 ? '#34C759' :
                expenseStats.savingsRate > 0 ? '#FF9800' : Colors.negativeColor;
            notifs.push({
                id: 'savings-rate',
                type: 'expense',
                title: expenseStats.savingsRate > 20 ? '💪 Great Savings!' : '💡 Savings Tip',
                message: expenseStats.savingsRate > 20
                    ? `You're saving ${expenseStats.savingsRate.toFixed(0)}% of your income!`
                    : `Your savings rate is ${expenseStats.savingsRate.toFixed(0)}%. Try to save more!`,
                time: 'This month',
                icon: 'pie-chart-outline',
                color: savingsColor,
                unread: !readNotifications.includes('savings-rate'),
                actionScreen: 'AnalyticsScreen',
            });
        }

        // 10. Recent large transaction
        const recentLargeTransaction = transactions
            .filter((t) => {
                const txDate = new Date(t.date);
                const threeDaysAgo = new Date();
                threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
                return txDate >= threeDaysAgo && t.amount > 5000;
            })
            .slice(0, 1)[0];

        if (recentLargeTransaction) {
            notifs.push({
                id: `large-tx-${recentLargeTransaction.id}`,
                type: 'expense',
                title: `💸 Large ${recentLargeTransaction.type === 'expense' ? 'Expense' : 'Income'}`,
                message: `${recentLargeTransaction.title}: ${formatCurrency(recentLargeTransaction.amount)}`,
                time: getTimeAgo(recentLargeTransaction.date), // Now getTimeAgo is defined above
                icon: recentLargeTransaction.type === 'expense' ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline',
                color: recentLargeTransaction.type === 'expense' ? Colors.negativeColor : Colors.positiveColor,
                unread: !readNotifications.includes(`large-tx-${recentLargeTransaction.id}`),
                actionScreen: 'Expense',
            });
        }

        return notifs;
    }, [tasks, transactions, payouts, taskStats, expenseStats, payoutStats, readNotifications]);

    // Filter notifications
    const filteredNotifications = useMemo(() => {
        switch (filter) {
            case 'unread':
                return notifications.filter((n) => n.unread);
            case 'tasks':
                return notifications.filter((n) => n.type === 'task' || n.type === 'reminder');
            case 'expense':
                return notifications.filter((n) => n.type === 'expense' || n.type === 'payout');
            default:
                return notifications;
        }
    }, [notifications, filter]);

    const unreadCount = notifications.filter((n) => n.unread).length;

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([refreshTransactions(), refreshTasks()]);
        setRefreshing(false);
    };

    const handleNotificationPress = (notification: Notification) => {
        // Mark as read
        if (!readNotifications.includes(notification.id)) {
            setReadNotifications([...readNotifications, notification.id]);
        }

        // Navigate if action screen exists
        if (notification.actionScreen) {
            navigation.navigate(notification.actionScreen);
        }
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Notifications',
            'Mark all notifications as read?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    onPress: () => {
                        setReadNotifications(notifications.map((n) => n.id));
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={notificationStyles.container}>
            {/* Header */}
            <View style={notificationStyles.header}>
                <TouchableOpacity
                    style={notificationStyles.backButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#151623" />
                </TouchableOpacity>

                <View style={notificationStyles.headerCenter}>
                    <Text style={notificationStyles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={notificationStyles.headerBadge}>
                            <Text style={notificationStyles.headerBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={notificationStyles.clearButton}
                    activeOpacity={0.7}
                    onPress={handleClearAll}
                >
                    <Text style={notificationStyles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={notificationStyles.filterTabs}>
                {(['all', 'unread', 'tasks', 'expense'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={filter === tab ? notificationStyles.filterTabActive : notificationStyles.filterTab}
                        activeOpacity={0.7}
                        onPress={() => setFilter(tab)}
                    >
                        <Text
                            style={
                                filter === tab
                                    ? notificationStyles.filterTabTextActive
                                    : notificationStyles.filterTabText
                            }
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Notifications List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={notificationStyles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#000" />
                }
            >
                {filteredNotifications.length === 0 ? (
                    <View style={notificationStyles.emptyMessage}>
                        <Ionicons name="notifications-off-outline" size={48} color="rgba(0, 0, 0, 0.15)" />
                        <Text style={notificationStyles.emptyText}>
                            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                        </Text>
                    </View>
                ) : (
                    filteredNotifications.map((notification) => (
                        <TouchableOpacity
                            key={notification.id}
                            style={[
                                notificationStyles.notificationCard,
                                notification.unread && notificationStyles.notificationCardUnread,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => handleNotificationPress(notification)}
                        >
                            {/* Icon */}
                            <View
                                style={[
                                    notificationStyles.notificationIcon,
                                    { backgroundColor: `${notification.color}15` },
                                ]}
                            >
                                <Ionicons name={notification.icon as any} size={24} color={notification.color} />
                            </View>

                            {/* Content */}
                            <View style={notificationStyles.notificationContent}>
                                <View style={notificationStyles.notificationHeader}>
                                    <Text style={notificationStyles.notificationTitle}>
                                        {notification.title}
                                    </Text>
                                    {notification.unread && <View style={notificationStyles.unreadDot} />}
                                </View>
                                <Text style={notificationStyles.notificationMessage}>
                                    {notification.message}
                                </Text>
                                <Text style={notificationStyles.notificationTime}>{notification.time}</Text>
                            </View>

                            {/* Arrow if actionable */}
                            {notification.actionScreen && (
                                <Ionicons name="chevron-forward" size={20} color="rgba(0, 0, 0, 0.30)" />
                            )}
                        </TouchableOpacity>
                    ))
                )}

                {filteredNotifications.length > 0 && (
                    <View style={notificationStyles.emptyMessage}>
                        <Ionicons name="checkmark-done-circle-outline" size={48} color="rgba(0, 0, 0, 0.15)" />
                        <Text style={notificationStyles.emptyText}>You're all caught up! 🎉</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}