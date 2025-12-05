// src/types/expense.ts

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type TransactionType = 'income' | 'expense';

export type PaymentMethod =
    | 'Cash'
    | 'Credit Card'
    | 'Debit Card'
    | 'Bank Transfer'
    | 'UPI'
    | 'Other';

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: TransactionType | 'both';
}

export interface Transaction {
    id: string;
    userId: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    categoryIcon?: string;
    categoryColor?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

// For Firestore document (with Timestamps)
export interface TransactionDocument {
    userId: string;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    categoryIcon?: string;
    categoryColor?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    date: FirebaseFirestoreTypes.Timestamp;
    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
}

// For creating new transaction
export interface CreateTransactionInput {
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    categoryIcon?: string;
    categoryColor?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    date?: Date;
}

// For updating transaction
export interface UpdateTransactionInput {
    title?: string;
    amount?: number;
    type?: TransactionType;
    category?: string;
    categoryIcon?: string;
    categoryColor?: string;
    paymentMethod?: PaymentMethod;
    notes?: string;
    date?: Date;
}

// Filter options
export interface TransactionFilter {
    type: 'all' | 'income' | 'expense';
    timeline: 'today' | '7days' | '30days' | 'month' | 'year' | 'custom';
    startDate?: Date;
    endDate?: Date;
    category?: string;
}

// Stats interface
export interface TransactionStats {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    last7DaysIncome: number;
    last7DaysExpense: number;
    last30DaysIncome: number;
    last30DaysExpense: number;
}

// Default categories
export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
    { id: '1', name: 'Shopping', icon: 'cart-outline', color: '#C3C6F9', type: 'expense' },
    { id: '2', name: 'Food & Dining', icon: 'restaurant-outline', color: '#FFE8D6', type: 'expense' },
    { id: '3', name: 'Transport', icon: 'car-outline', color: '#D6F5FF', type: 'expense' },
    { id: '4', name: 'Entertainment', icon: 'game-controller-outline', color: '#FFE3F4', type: 'expense' },
    { id: '5', name: 'Bills & Utilities', icon: 'flash-outline', color: '#FFF3E0', type: 'expense' },
    { id: '6', name: 'Health', icon: 'medical-outline', color: '#E8F5E9', type: 'expense' },
    { id: '7', name: 'Education', icon: 'book-outline', color: '#E3F2FD', type: 'expense' },
    { id: '8', name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#E8E8E8', type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
    { id: '9', name: 'Salary', icon: 'wallet-outline', color: '#C8E6C9', type: 'income' },
    { id: '10', name: 'Freelance', icon: 'laptop-outline', color: '#B3E5FC', type: 'income' },
    { id: '11', name: 'Investment', icon: 'trending-up-outline', color: '#DCEDC8', type: 'income' },
    { id: '12', name: 'Transfer', icon: 'swap-horizontal-outline', color: '#FFE3F4', type: 'income' },
    { id: '13', name: 'Gift', icon: 'gift-outline', color: '#F8BBD9', type: 'income' },
    { id: '14', name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#E8E8E8', type: 'income' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
    'Cash',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'UPI',
    'Other',
];