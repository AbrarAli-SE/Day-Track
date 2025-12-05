// src/screens/AnalyticsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { analyticsStyles as styles } from '../../styles/expense/analyticsStyles';
import { useTransactions } from '../../hooks/useTransactions';
import backendService from '../../services/backendService';
import Colors from '../../constants/colors';

const HEADER_HEIGHT = 60;

export default function AnalyticsScreen() {
    const navigation = useNavigation();
    const { transactions, isAuthenticated } = useTransactions();
    const [analytics, setAnalytics] = useState<any>(null);
    const [insights, setInsights] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && transactions.length > 0) {
            loadAnalytics();
        }
    }, [transactions, isAuthenticated]);

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            const userId = auth().currentUser?.uid || 'guest';
            const result = await backendService.calculateAnalytics(userId, transactions);

            if (result.success) {
                setAnalytics(result.data);

                // Load insights
                const insightsResult = await backendService.getInsights(userId);
                if (insightsResult.success) {
                    setInsights(insightsResult.data);
                }
            }
        } catch (error) {
            console.error('Failed to load analytics:', error);
            Alert.alert(
                'Offline Mode',
                'Backend analytics unavailable. Please ensure the backend server is running.',
                [{ text: 'OK' }]
            );
            // Fallback to basic calculation
            calculateLocalAnalytics();
        } finally {
            setIsLoading(false);
        }
    };

    const calculateLocalAnalytics = () => {
        let totalIncome = 0;
        let totalExpense = 0;
        const categories: any = {};

        transactions.forEach((t) => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpense += t.amount;
            }

            if (!categories[t.category]) {
                categories[t.category] = { amount: 0, count: 0, type: t.type };
            }
            categories[t.category].amount += t.amount;
            categories[t.category].count += 1;
        });

        const netBalance = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;
        const avgTransaction = transactions.length > 0
            ? (totalIncome + totalExpense) / transactions.length
            : 0;

        setAnalytics({
            totalTransactions: transactions.length,
            totalIncome,
            totalExpense,
            netBalance,
            savingsRate,
            averageTransaction: avgTransaction,
            categoryBreakdown: categories,
        });

        // Generate basic insights
        const basicInsights = [];
        if (savingsRate > 20) {
            basicInsights.push({
                type: 'positive',
                icon: 'trending-up',
                title: 'Great Savings!',
                message: `You're saving ${savingsRate.toFixed(1)}% of your income.`,
            });
        } else if (savingsRate < 0) {
            basicInsights.push({
                type: 'warning',
                icon: 'warning',
                title: 'Spending Alert',
                message: "You're spending more than you earn.",
            });
        }
        setInsights(basicInsights);
    };

    const formatCurrency = (amount: number) => {
        return `Rs ${Math.abs(amount).toLocaleString('en-IN')}`;
    };

    const getInsightStyle = (type: string) => {
        switch (type) {
            case 'positive':
                return styles.insightItemPositive;
            case 'warning':
                return styles.insightItemWarning;
            case 'info':
                return styles.insightItemInfo;
            case 'tip':
                return styles.insightItemTip;
            default:
                return {};
        }
    };

    const getInsightColor = (type: string) => {
        switch (type) {
            case 'positive':
                return Colors.positiveColor;
            case 'warning':
                return '#FF9800';
            case 'info':
                return '#2196F3';
            case 'tip':
                return '#4CAF50';
            default:
                return Colors.primaryBlack;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Fixed Header */}
            <View style={styles.fixedHeader}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.primaryBlack} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Analytics</Text>

                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={loadAnalytics}
                        activeOpacity={0.7}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.refreshButtonText}>Refresh</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Top Background */}
                <View style={styles.topBackground}>
                    <View style={styles.decorativeBlur1} />
                    <View style={styles.decorativeBlur2} />
                </View>

                {/* Spacer for Fixed Header */}
                <View style={{ height: HEADER_HEIGHT }} />

                {/* Content Container */}
                <View style={styles.contentContainer}>
                    {isLoading && !analytics ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primaryBlack} />
                            <Text style={styles.loadingText}>Analyzing your data...</Text>
                        </View>
                    ) : !analytics || analytics.totalTransactions === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="analytics-outline" size={48} color="rgba(0, 0, 0, 0.20)" />
                            </View>
                            <Text style={styles.emptyTitle}>No Data Available</Text>
                            <Text style={styles.emptySubtitle}>
                                Add some transactions to see your analytics
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* Overview Card */}
                            <View style={styles.overviewCard}>
                                <Text style={styles.sectionTitle}>Overview</Text>
                                <View style={styles.metricsGrid}>
                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricLabel}>Total Transactions</Text>
                                        <Text style={styles.metricValue}>{analytics.totalTransactions}</Text>
                                    </View>

                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricLabel}>Average Transaction</Text>
                                        <Text style={styles.metricValue}>
                                            {formatCurrency(analytics.averageTransaction || 0)}
                                        </Text>
                                    </View>

                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricLabel}>Total Income</Text>
                                        <Text style={[styles.metricValue, { color: Colors.positiveColor }]}>
                                            {formatCurrency(analytics.totalIncome)}
                                        </Text>
                                    </View>

                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricLabel}>Total Expense</Text>
                                        <Text style={[styles.metricValue, { color: Colors.negativeColor }]}>
                                            {formatCurrency(analytics.totalExpense)}
                                        </Text>
                                    </View>

                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricLabel}>Net Balance</Text>
                                        <Text
                                            style={[
                                                styles.metricValue,
                                                {
                                                    color:
                                                        analytics.netBalance > 0
                                                            ? Colors.positiveColor
                                                            : analytics.netBalance < 0
                                                                ? Colors.negativeColor
                                                                : Colors.primaryBlack,
                                                },
                                            ]}
                                        >
                                            {formatCurrency(analytics.netBalance)}
                                        </Text>
                                    </View>

                                    <View style={styles.metricItem}>
                                        <Text style={styles.metricLabel}>Savings Rate</Text>
                                        <Text
                                            style={[
                                                styles.metricValue,
                                                {
                                                    color:
                                                        analytics.savingsRate > 0
                                                            ? Colors.positiveColor
                                                            : Colors.negativeColor,
                                                },
                                            ]}
                                        >
                                            {analytics.savingsRate.toFixed(1)}%
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* AI Insights */}
                            {insights.length > 0 && (
                                <View style={styles.insightsCard}>
                                    <Text style={styles.sectionTitle}>💡 AI Insights</Text>
                                    {insights.map((insight, index) => (
                                        <View
                                            key={index}
                                            style={[styles.insightItem, getInsightStyle(insight.type)]}
                                        >
                                            <View style={styles.insightIconContainer}>
                                                <Ionicons
                                                    name={insight.icon}
                                                    size={22}
                                                    color={getInsightColor(insight.type)}
                                                />
                                            </View>
                                            <View style={styles.insightContent}>
                                                <Text style={styles.insightTitle}>{insight.title}</Text>
                                                <Text style={styles.insightMessage}>{insight.message}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Category Breakdown */}
                            {analytics.categoryBreakdown && Object.keys(analytics.categoryBreakdown).length > 0 && (
                                <View style={styles.categoryBreakdownCard}>
                                    <Text style={styles.sectionTitle}>Category Breakdown</Text>
                                    {Object.entries(analytics.categoryBreakdown)
                                        .sort(([, a]: any, [, b]: any) => b.amount - a.amount)
                                        .slice(0, 5)
                                        .map(([category, data]: [string, any]) => {
                                            const total = data.type === 'income' ? analytics.totalIncome : analytics.totalExpense;
                                            const percentage = total > 0 ? (data.amount / total) * 100 : 0;

                                            return (
                                                <View key={category} style={styles.categoryItem}>
                                                    <View style={styles.categoryHeader}>
                                                        <Text style={styles.categoryName}>{category}</Text>
                                                        <Text style={styles.categoryPercentage}>
                                                            {percentage.toFixed(1)}% · {formatCurrency(data.amount)}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.progressBar}>
                                                        <View
                                                            style={[
                                                                styles.progressFill,
                                                                data.type === 'expense'
                                                                    ? styles.progressFillExpense
                                                                    : styles.progressFillIncome,
                                                                { width: `${Math.min(percentage, 100)}%` },
                                                            ]}
                                                        />
                                                    </View>
                                                </View>
                                            );
                                        })}
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* Bottom Padding */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}