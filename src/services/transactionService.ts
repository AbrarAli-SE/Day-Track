// src/services/transactionService.ts

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
    Transaction,
    TransactionDocument,
    CreateTransactionInput,
    UpdateTransactionInput,
    TransactionFilter,
    TransactionStats,
} from '../types/expense';

const COLLECTION_NAME = 'transactions';


class TransactionService {
    private get collection() {
        return firestore().collection(COLLECTION_NAME);
    }

    private get currentUserId(): string | null {
        return auth().currentUser?.uid || null;
    }

    // Convert Firestore document to Transaction
    private documentToTransaction(
        doc: FirebaseFirestoreTypes.DocumentSnapshot
    ): Transaction | null {
        if (!doc.exists) return null;

        const data = doc.data() as TransactionDocument;
        return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            amount: data.amount,
            type: data.type,
            category: data.category,
            categoryIcon: data.categoryIcon,
            categoryColor: data.categoryColor,
            paymentMethod: data.paymentMethod,
            notes: data.notes,
            date: data.date.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    }

    // Create a new transaction
    async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
        const userId = this.currentUserId;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const now = firestore.Timestamp.now();
        const transactionDate = input.date
            ? firestore.Timestamp.fromDate(input.date)
            : now;

        const docData: any = {
            userId,
            title: input.title.trim(),
            amount: Math.abs(input.amount), // Store positive, type determines sign
            type: input.type,
            category: input.category,
            categoryIcon: input.categoryIcon,
            categoryColor: input.categoryColor,
            paymentMethod: input.paymentMethod,
            date: transactionDate,
            createdAt: now,
            updatedAt: now,
        };

        // Only add notes if it exists and is not empty
        if (input.notes?.trim()) {
            docData.notes = input.notes.trim();
        }

        const docRef = await this.collection.add(docData);
        const newDoc = await docRef.get();

        const transaction = this.documentToTransaction(newDoc);
        if (!transaction) {
            throw new Error('Failed to create transaction');
        }

        console.log('✅ Transaction created:', transaction.id);
        return transaction;
    }

    // Update an existing transaction
    async updateTransaction(
        transactionId: string,
        input: UpdateTransactionInput
    ): Promise<Transaction> {
        const userId = this.currentUserId;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const docRef = this.collection.doc(transactionId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error('Transaction not found');
        }

        const existingData = doc.data() as TransactionDocument;
        if (existingData.userId !== userId) {
            throw new Error('Unauthorized to update this transaction');
        }

        const updateData: Partial<TransactionDocument> = {
            updatedAt: firestore.Timestamp.now(),
        };

        if (input.title !== undefined) updateData.title = input.title.trim();
        if (input.amount !== undefined) updateData.amount = Math.abs(input.amount);
        if (input.type !== undefined) updateData.type = input.type;
        if (input.category !== undefined) updateData.category = input.category;
        if (input.categoryIcon !== undefined) updateData.categoryIcon = input.categoryIcon;
        if (input.categoryColor !== undefined) updateData.categoryColor = input.categoryColor;
        if (input.paymentMethod !== undefined) updateData.paymentMethod = input.paymentMethod;
        // Only add notes if it exists and is not empty, otherwise remove it
        if (input.notes !== undefined) {
            const trimmedNotes = input.notes?.trim();
            if (trimmedNotes) {
                updateData.notes = trimmedNotes;
            } else {
                updateData.notes = firestore.FieldValue.delete() as any;
            }
        }
        if (input.date !== undefined) updateData.date = firestore.Timestamp.fromDate(input.date);

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();

        const transaction = this.documentToTransaction(updatedDoc);
        if (!transaction) {
            throw new Error('Failed to update transaction');
        }

        console.log('✅ Transaction updated:', transaction.id);
        return transaction;
    }

    // Delete a transaction
    async deleteTransaction(transactionId: string): Promise<void> {
        const userId = this.currentUserId;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const docRef = this.collection.doc(transactionId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new Error('Transaction not found');
        }

        const data = doc.data() as TransactionDocument;
        if (data.userId !== userId) {
            throw new Error('Unauthorized to delete this transaction');
        }

        await docRef.delete();
        console.log('✅ Transaction deleted:', transactionId);
    }

    // Get a single transaction
    async getTransaction(transactionId: string): Promise<Transaction | null> {
        const doc = await this.collection.doc(transactionId).get();
        return this.documentToTransaction(doc);
    }

    // Get all transactions for current user with optional filters
    async getTransactions(filter?: TransactionFilter): Promise<Transaction[]> {
        const userId = this.currentUserId;
        if (!userId) {
            throw new Error('User not authenticated');
        }

        let query: FirebaseFirestoreTypes.Query = this.collection
            .where('userId', '==', userId)
            .orderBy('date', 'desc');

        // Apply type filter
        if (filter?.type && filter.type !== 'all') {
            query = query.where('type', '==', filter.type);
        }

        // Apply category filter
        if (filter?.category) {
            query = query.where('category', '==', filter.category);
        }

        const snapshot = await query.get();
        let transactions = snapshot.docs
            .map((doc) => this.documentToTransaction(doc))
            .filter((t): t is Transaction => t !== null);

        // Apply timeline filter (client-side for flexibility)
        if (filter?.timeline) {
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
                        transactions = transactions.filter(
                            (t) => t.date >= filter.startDate! && t.date <= filter.endDate!
                        );
                    }
                    return transactions;
                default:
                    return transactions;
            }

            transactions = transactions.filter((t) => t.date >= startDate);
        }

        return transactions;
    }

    // Real-time listener for transactions
    subscribeToTransactions(
        callback: (transactions: Transaction[]) => void,
        onError?: (error: Error) => void,
        filter?: TransactionFilter
    ): () => void {
        const userId = this.currentUserId;
        if (!userId) {
            onError?.(new Error('User not authenticated'));
            return () => { };
        }

        let query: FirebaseFirestoreTypes.Query = this.collection
            .where('userId', '==', userId)
            .orderBy('date', 'desc');

        if (filter?.type && filter.type !== 'all') {
            query = query.where('type', '==', filter.type);
        }

        const unsubscribe = query.onSnapshot(
            (snapshot) => {
                let transactions = snapshot.docs
                    .map((doc) => this.documentToTransaction(doc))
                    .filter((t): t is Transaction => t !== null);

                // Apply timeline filter client-side
                if (filter?.timeline) {
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
                        default:
                            callback(transactions);
                            return;
                    }

                    transactions = transactions.filter((t) => t.date >= startDate);
                }

                callback(transactions);
            },
            (error) => {
                console.error('❌ Transaction subscription error:', error);
                onError?.(error);
            }
        );

        return unsubscribe;
    }

    // Calculate transaction statistics
    calculateStats(transactions: Transaction[]): TransactionStats {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        let totalIncome = 0;
        let totalExpense = 0;
        let last7DaysIncome = 0;
        let last7DaysExpense = 0;
        let last30DaysIncome = 0;
        let last30DaysExpense = 0;

        transactions.forEach((t) => {
            if (t.type === 'income') {
                totalIncome += t.amount;
                if (t.date >= sevenDaysAgo) last7DaysIncome += t.amount;
                if (t.date >= thirtyDaysAgo) last30DaysIncome += t.amount;
            } else {
                totalExpense += t.amount;
                if (t.date >= sevenDaysAgo) last7DaysExpense += t.amount;
                if (t.date >= thirtyDaysAgo) last30DaysExpense += t.amount;
            }
        });

        return {
            totalBalance: totalIncome - totalExpense,
            totalIncome,
            totalExpense,
            last7DaysIncome,
            last7DaysExpense,
            last30DaysIncome,
            last30DaysExpense,
        };
    }

    // Search transactions
    searchTransactions(transactions: Transaction[], query: string): Transaction[] {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase().trim();
        return transactions.filter(
            (t) =>
                t.title.toLowerCase().includes(lowerQuery) ||
                t.category.toLowerCase().includes(lowerQuery) ||
                t.notes?.toLowerCase().includes(lowerQuery) ||
                t.paymentMethod.toLowerCase().includes(lowerQuery)
        );
    }
}

// Export singleton instance
export const transactionService = new TransactionService();
export default transactionService;