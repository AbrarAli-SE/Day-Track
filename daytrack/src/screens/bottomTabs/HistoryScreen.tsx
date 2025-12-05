// src/screens/HistoryScreen.tsx

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    Share,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { historyStyles as styles } from '../../styles/expense/historyStyles';
import { useTransactions } from '../../hooks/useTransactions';
import backendService from '../../services/backendService';
import exportService from '../../services/exportService';
import Colors from '../../constants/colors';
import { ExportFormatModal } from '../../components';

const HEADER_HEIGHT = 60;

export default function HistoryScreen() {
    const navigation = useNavigation();
    const { transactions, isAuthenticated } = useTransactions();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [summary, setSummary] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated && transactions.length > 0) {
            loadMonthlySummary();
        }
    }, [selectedMonth, selectedYear, transactions, isAuthenticated]);

    const loadMonthlySummary = async () => {
        setIsLoading(true);
        try {
            // Filter transactions for selected month
            const monthTransactions = transactions.filter((t) => {
                const date = new Date(t.date);
                return (
                    date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
                );
            });

            console.log(`📊 Loading summary for ${monthTransactions.length} transactions`);
            
            // Always use local calculation to avoid backend dependency
            calculateLocalSummary();
            
            // Try backend for enhanced analytics (optional)
            try {
                const result = await backendService.getMonthlySummary(
                    monthTransactions,
                    selectedMonth + 1,
                    selectedYear
                );

                if (result.success && result.data) {
                    console.log('✅ Backend summary received:', result.data);
                }
            } catch (backendError) {
                console.log('ℹ️ Backend unavailable, using local calculation');
            }
        } catch (error) {
            console.error('❌ Failed to load summary:', error);
            // Fallback to local calculation
            calculateLocalSummary();
        } finally {
            setIsLoading(false);
        }
    };

    const calculateLocalSummary = () => {
        const monthTransactions = transactions.filter((t) => {
            const date = new Date(t.date);
            return (
                date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
            );
        });

        let totalIncome = 0;
        let totalExpense = 0;
        const categories: any = {};

        monthTransactions.forEach((t) => {
            // Ensure amount is a valid number
            const amount = Number(t.amount);
            if (isNaN(amount)) {
                console.warn('Invalid amount in transaction:', t);
                return; // Skip invalid transactions
            }
            
            if (t.type === 'income') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }

            if (!categories[t.category]) {
                categories[t.category] = { income: 0, expense: 0, count: 0 };
            }
            if (t.type === 'income') {
                categories[t.category].income += amount;
            } else {
                categories[t.category].expense += amount;
            }
            categories[t.category].count += 1;
        });

        const netSavings = totalIncome - totalExpense;
        const savingsRate =
            totalIncome > 0 ? ((netSavings / totalIncome) * 100) : 0;

        setSummary({
            month: selectedMonth + 1,
            year: selectedYear,
            totalTransactions: monthTransactions.length,
            totalIncome: Number(totalIncome.toFixed(2)) || 0,
            totalExpense: Number(totalExpense.toFixed(2)) || 0,
            netSavings: Number(netSavings.toFixed(2)) || 0,
            savingsRate: Number(savingsRate.toFixed(1)) || 0,
            categories,
        });
    };

    const handlePreviousMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
            if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
            } else {
                setSelectedMonth(selectedMonth + 1);
            }
        }
    };

    const handleExport = async () => {
        if (!summary || summary.totalTransactions === 0) {
            Alert.alert('No Data', 'No transactions to export for this month.');
            return;
        }

        // ✅ Permission is now handled in exportService, so just show modal
        setShowExportModal(true);
    };

    const handleExportFormat = async (format: 'csv' | 'pdf') => {
        try {
            const monthTransactions = transactions.filter((t) => {
                const date = new Date(t.date);
                return (
                    date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
                );
            });

            if (monthTransactions.length === 0) {
                Alert.alert('No Data', 'No transactions found for this month.');
                return;
            }

            const userName = auth().currentUser?.displayName || 
                             auth().currentUser?.email?.split('@')[0] || 
                             'User';

            setIsLoading(true);

            let success = false;
            if (format === 'csv') {
                success = await exportService.exportToCSV(
                    monthTransactions,
                    selectedMonth + 1,
                    selectedYear,
                    userName
                );
            } else {
                success = await exportService.exportToPDF(
                    monthTransactions,
                    selectedMonth + 1,
                    selectedYear,
                    userName,
                    summary
                );
            }

            if (success) {
                Alert.alert(
                    'Export Successful',
                    `Your ${format.toUpperCase()} file has been created and is ready to share!`,
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            console.error('Export error:', error);
            Alert.alert(
                'Export Failed',
                error.message || 'Failed to export data. Please ensure backend is running.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number | undefined) => {
        const validAmount = Number(amount);
        if (isNaN(validAmount)) {
            return 'Rs 0';
        }
        return `Rs ${Math.abs(validAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getMonthName = () => {
        return new Date(selectedYear, selectedMonth).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
        });
    };

    const canGoNext = () => {
        const now = new Date();
        return (
            selectedYear < now.getFullYear() ||
            (selectedYear === now.getFullYear() && selectedMonth < now.getMonth())
        );
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

                    <Text style={styles.headerTitle}>History</Text>

                    <TouchableOpacity
                        style={styles.exportButton}
                        onPress={handleExport}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="download-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.exportButtonText}>Export</Text>
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
                    {/* Month Selector */}
                    <View style={styles.monthSelector}>
                        <TouchableOpacity
                            style={styles.monthButton}
                            onPress={handlePreviousMonth}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="chevron-back" size={24} color={Colors.primaryBlack} />
                        </TouchableOpacity>

                        <Text style={styles.monthText}>{getMonthName()}</Text>

                        <TouchableOpacity
                            style={styles.monthButton}
                            onPress={handleNextMonth}
                            activeOpacity={0.7}
                            disabled={!canGoNext()}
                        >
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color={canGoNext() ? Colors.primaryBlack : 'rgba(0, 0, 0, 0.20)'}
                            />
                        </TouchableOpacity>
                    </View>

                    {isLoading ? (
                        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={Colors.primaryBlack} />
                            <Text style={{ marginTop: 12, color: Colors.secondaryBlack }}>
                                Loading summary...
                            </Text>
                        </View>
                    ) : !summary || summary.totalTransactions === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="calendar-outline" size={48} color="rgba(0, 0, 0, 0.20)" />
                            </View>
                            <Text style={styles.emptyTitle}>No Transactions</Text>
                            <Text style={styles.emptySubtitle}>
                                No transactions found for {getMonthName()}
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* Summary Card */}
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>Monthly Summary</Text>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Total Transactions</Text>
                                    <Text style={styles.summaryValue}>{summary.totalTransactions}</Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Total Income</Text>
                                    <Text style={[styles.summaryValue, { color: Colors.positiveColor }]}>
                                        {formatCurrency(summary.totalIncome || 0)}
                                    </Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Total Expense</Text>
                                    <Text style={[styles.summaryValue, { color: Colors.negativeColor }]}>
                                        {formatCurrency(summary.totalExpense || 0)}
                                    </Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Savings Rate</Text>
                                    <Text
                                        style={[
                                            styles.summaryValue,
                                            {
                                                color:
                                                    (summary.savingsRate || 0) > 0
                                                        ? Colors.positiveColor
                                                        : Colors.negativeColor,
                                            },
                                        ]}
                                    >
                                        {Number(summary.savingsRate || 0).toFixed(1)}%
                                    </Text>
                                </View>

                                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                                    <Text style={[styles.summaryLabel, { fontSize: 16, fontFamily: 'YaldeviColombo-SemiBold' }]}>
                                        Net Savings
                                    </Text>
                                    <Text
                                        style={[
                                            styles.summaryValue,
                                            styles.summaryNetSavings,
                                            {
                                                color:
                                                    (summary.netSavings || 0) > 0
                                                        ? Colors.positiveColor
                                                        : (summary.netSavings || 0) < 0
                                                            ? Colors.negativeColor
                                                            : Colors.primaryBlack,
                                            },
                                        ]}
                                    >
                                        {formatCurrency(summary.netSavings || 0)}
                                    </Text>
                                </View>
                            </View>

                            {/* Category Breakdown */}
                            {summary.categories && Object.keys(summary.categories).length > 0 && (
                                <View style={styles.categoryCard}>
                                    <Text style={styles.summaryTitle}>Category Breakdown</Text>

                                    {Object.entries(summary.categories).map(([category, data]: [string, any], index, arr) => (
                                    <View
                                        key={category}
                                        style={[
                                            styles.categoryItem,
                                            index === arr.length - 1 && styles.categoryItemLast,
                                        ]}
                                    >
                                        <View style={styles.categoryLeft}>
                                            <Text style={styles.categoryName}>{category}</Text>
                                            <Text style={styles.categoryCount}>{data.count} transactions</Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.categoryAmount,
                                                {
                                                    color:
                                                        data.income > data.expense
                                                            ? Colors.positiveColor
                                                            : Colors.negativeColor,
                                                },
                                            ]}
                                        >
                                            {formatCurrency(data.income > 0 ? data.income : data.expense)}
                                        </Text>
                                    </View>
                                ))}
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* Bottom Padding */}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Export Format Modal */}
            <ExportFormatModal
                visible={showExportModal}
                onClose={() => setShowExportModal(false)}
                onSelectFormat={handleExportFormat}
            />
        </SafeAreaView>
    );
}