// src/types/payout.ts

export type PayoutType = 'pay_to' | 'receive_from';
export type PayoutStatus = 'pending' | 'paid' | 'received' | 'cancelled';

export interface Payout {
    id: string;
    userId: string;
    personName: string;
    personEmail?: string;
    amount: number;
    type: PayoutType; // 'pay_to' means I need to pay, 'receive_from' means I need to receive
    status: PayoutStatus;
    dueDate: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    paidAt?: Date;
}

export interface CreatePayoutInput {
    personName: string;
    personEmail?: string;
    amount: number;
    type: PayoutType;
    dueDate: Date;
    notes?: string;
}

export interface UpdatePayoutInput {
    personName?: string;
    personEmail?: string;
    amount?: number;
    type?: PayoutType;
    status?: PayoutStatus;
    dueDate?: Date;
    notes?: string;
}

export interface PayoutStats {
    totalPayTo: number; // Total I need to pay to others
    totalReceiveFrom: number; // Total others need to pay me
    netBalance: number; // Negative = I owe, Positive = They owe me
    pendingPayments: number;
    pendingReceipts: number;
    completedCount: number;
}
// src/types/payout.ts (ADD this interface)

export interface PayoutPerson {
    id: string;
    userId: string;
    name: string;
    email?: string;
    totalOwed: number; // Negative = I owe them, Positive = They owe me
    lastTransactionDate: Date;
    transactionCount: number;
    createdAt: Date;
}