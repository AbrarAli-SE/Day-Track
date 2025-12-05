// src/hooks/useTransactions.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';
import transactionService from '../services/transactionService';
import offlineStorageService from '../services/offlineStorageService';
import syncService from '../services/syncService';
import {
    Transaction,
    CreateTransactionInput,
    UpdateTransactionInput,
    TransactionFilter,
    TransactionStats,
} from '../types/expense';

interface UseTransactionsReturn {
    // Data
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    stats: TransactionStats;

    // Loading & Error states
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;

    // Actions
    createTransaction: (input: CreateTransactionInput) => Promise<Transaction | null>;
    updateTransaction: (id: string, input: UpdateTransactionInput) => Promise<Transaction | null>;
    deleteTransaction: (id: string) => Promise<boolean>;
    refreshTransactions: () => Promise<void>;

    // Filters
    filter: TransactionFilter;
    setFilter: (filter: TransactionFilter) => void;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Transaction[];

    // Auth state
    isAuthenticated: boolean;
}

const DEFAULT_FILTER: TransactionFilter = {
    type: 'all',
    timeline: '30days',
};

const DEFAULT_STATS: TransactionStats = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    last7DaysIncome: 0,
    last7DaysExpense: 0,
    last30DaysIncome: 0,
    last30DaysExpense: 0,
};

export function useTransactions(): UseTransactionsReturn {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<TransactionFilter>(DEFAULT_FILTER);
    const [searchQuery, setSearchQuery] = useState('');

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth().currentUser);

    // Listen to auth changes
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            if (!user) {
                setTransactions([]);
                setIsLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    // Start auto-sync listener
    useEffect(() => {
        const unsubscribeAutoSync = syncService.startAutoSyncListener();

        return () => {
            unsubscribeAutoSync();
        };
    }, []);

    // Subscribe to real-time transactions
    useEffect(() => {
        if (!isAuthenticated) {
            setTransactions([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const unsubscribe = transactionService.subscribeToTransactions(
            (fetchedTransactions) => {
                setTransactions(fetchedTransactions);
                setIsLoading(false);
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
            }
        );

        return unsubscribe;
    }, [isAuthenticated]);

    // Calculate stats from all transactions
    const stats = useMemo(() => {
        if (transactions.length === 0) return DEFAULT_STATS;
        return transactionService.calculateStats(transactions);
    }, [transactions]);

    // Apply filters to transactions
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        // Apply type filter
        if (filter.type !== 'all') {
            result = result.filter((t) => t.type === filter.type);
        }

        // Apply timeline filter
        if (filter.timeline) {
            const now = new Date();
            let startDate: Date;

            switch (filter.timeline) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case '7days':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30days':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                case 'custom':
                    if (filter.startDate && filter.endDate) {
                        result = result.filter(
                            (t) => t.date >= filter.startDate! && t.date <= filter.endDate!
                        );
                    }
                    return result;
                default:
                    return result;
            }

            result = result.filter((t) => t.date >= startDate);
        }

        // Apply category filter
        if (filter.category) {
            result = result.filter((t) => t.category === filter.category);
        }

        return result;
    }, [transactions, filter]);

    // Search results
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return transactionService.searchTransactions(transactions, searchQuery);
    }, [transactions, searchQuery]);

    // Create transaction with offline support
    const createTransaction = useCallback(
        async (input: CreateTransactionInput): Promise<Transaction | null> => {
            setIsCreating(true);
            setError(null);

            try {
                const syncEnabled = await offlineStorageService.isSyncEnabled();
                const netInfo = await NetInfo.fetch();
                const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

                // If sync is enabled, online, and authenticated - save to Firestore
                if (syncEnabled && isOnline && isAuthenticated) {
                    const transaction = await transactionService.createTransaction(input);
                    console.log('✅ Transaction created online');
                    return transaction;
                } else {
                    // Save offline
                    const offlineTransaction = await offlineStorageService.saveTransactionOffline(input);
                    console.log('💾 Transaction saved offline');
                    
                    // Create a Transaction object from offline data
                    const transaction: Transaction = {
                        id: offlineTransaction.tempId,
                        userId: 'offline',
                        title: offlineTransaction.title,
                        amount: offlineTransaction.amount,
                        type: offlineTransaction.type,
                        category: offlineTransaction.category,
                        categoryIcon: offlineTransaction.categoryIcon,
                        categoryColor: offlineTransaction.categoryColor,
                        paymentMethod: offlineTransaction.paymentMethod,
                        notes: offlineTransaction.notes,
                        date: offlineTransaction.date,
                        createdAt: offlineTransaction.createdAt,
                        updatedAt: offlineTransaction.updatedAt,
                    };

                    // Trigger a refresh to show offline data
                    refreshTransactions();
                    
                    return transaction;
                }
            } catch (err: any) {
                const errorMessage = err.message || 'Failed to create transaction';
                setError(errorMessage);
                console.error('❌ Create transaction error:', errorMessage);
                return null;
            } finally {
                setIsCreating(false);
            }
        },
        [isAuthenticated]
    );

    // Update transaction
    const updateTransaction = useCallback(
        async (id: string, input: UpdateTransactionInput): Promise<Transaction | null> => {
            if (!isAuthenticated) {
                setError('Please login to update transactions');
                return null;
            }

            setIsUpdating(true);
            setError(null);

            try {
                const transaction = await transactionService.updateTransaction(id, input);
                console.log('✅ Transaction updated successfully');
                return transaction;
            } catch (err: any) {
                const errorMessage = err.message || 'Failed to update transaction';
                setError(errorMessage);
                console.error('❌ Update transaction error:', errorMessage);
                return null;
            } finally {
                setIsUpdating(false);
            }
        },
        [isAuthenticated]
    );

    // Delete transaction
    const deleteTransaction = useCallback(
        async (id: string): Promise<boolean> => {
            if (!isAuthenticated) {
                setError('Please login to delete transactions');
                return false;
            }

            setIsDeleting(true);
            setError(null);

            try {
                await transactionService.deleteTransaction(id);
                console.log('✅ Transaction deleted successfully');
                return true;
            } catch (err: any) {
                const errorMessage = err.message || 'Failed to delete transaction';
                setError(errorMessage);
                console.error('❌ Delete transaction error:', errorMessage);
                return false;
            } finally {
                setIsDeleting(false);
            }
        },
        [isAuthenticated]
    );

    // Refresh transactions with offline support
    const refreshTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const syncEnabled = await offlineStorageService.isSyncEnabled();
            const netInfo = await NetInfo.fetch();
            const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

            if (syncEnabled && isOnline && isAuthenticated) {
                // Load from Firestore
                const fetchedTransactions = await transactionService.getTransactions();
                setTransactions(fetchedTransactions);
                console.log('📥 Loaded transactions from Firestore');
            } else {
                // Load from offline storage
                const offlineTransactions = await offlineStorageService.getAllTransactions();
                setTransactions(offlineTransactions);
                console.log('💾 Loaded transactions from offline storage');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch transactions');
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    return {
        transactions,
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
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        searchResults,
        isAuthenticated,
    };
}

export default useTransactions;