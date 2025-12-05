// src/services/payoutService.ts

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
    Payout,
    CreatePayoutInput,
    UpdatePayoutInput,
    PayoutStats,
} from '../types/payout';

const COLLECTION_NAME = 'payouts';

class PayoutService {
    private get collection() {
        return firestore().collection(COLLECTION_NAME);
    }

    private get currentUserId(): string | null {
        return auth().currentUser?.uid || null;
    }

    private documentToPayout(doc: FirebaseFirestoreTypes.DocumentSnapshot): Payout | null {
        if (!doc.exists) return null;

        const data = doc.data() as any;
        return {
            id: doc.id,
            userId: data.userId,
            personName: data.personName,
            personEmail: data.personEmail,
            amount: data.amount,
            type: data.type,
            status: data.status,
            dueDate: data.dueDate.toDate(),
            notes: data.notes,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            paidAt: data.paidAt?.toDate(),
        };
    }

    async createPayout(input: CreatePayoutInput): Promise<Payout> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const now = firestore.Timestamp.now();
        const docData = {
            userId,
            personName: input.personName.trim(),
            personEmail: input.personEmail?.trim(),
            amount: Math.abs(input.amount),
            type: input.type,
            status: 'pending',
            dueDate: firestore.Timestamp.fromDate(input.dueDate),
            notes: input.notes?.trim(),
            createdAt: now,
            updatedAt: now,
        };

        const docRef = await this.collection.add(docData);
        const newDoc = await docRef.get();
        const payout = this.documentToPayout(newDoc);
        if (!payout) throw new Error('Failed to create payout');

        console.log('✅ Payout created:', payout.id);
        return payout;
    }

    async updatePayout(payoutId: string, input: UpdatePayoutInput): Promise<Payout> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const docRef = this.collection.doc(payoutId);
        const doc = await docRef.get();

        if (!doc.exists) throw new Error('Payout not found');

        const existingData = doc.data() as any;
        if (existingData.userId !== userId) {
            throw new Error('Unauthorized to update this payout');
        }

        const updateData: any = { updatedAt: firestore.Timestamp.now() };

        if (input.personName !== undefined) updateData.personName = input.personName.trim();
        if (input.personEmail !== undefined) updateData.personEmail = input.personEmail?.trim();
        if (input.amount !== undefined) updateData.amount = Math.abs(input.amount);
        if (input.type !== undefined) updateData.type = input.type;
        if (input.status !== undefined) {
            updateData.status = input.status;
            if (input.status === 'paid' || input.status === 'received') {
                updateData.paidAt = firestore.Timestamp.now();
            }
        }
        if (input.dueDate !== undefined) updateData.dueDate = firestore.Timestamp.fromDate(input.dueDate);
        if (input.notes !== undefined) updateData.notes = input.notes?.trim();

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();
        const payout = this.documentToPayout(updatedDoc);
        if (!payout) throw new Error('Failed to update payout');

        console.log('✅ Payout updated:', payout.id);
        return payout;
    }

    async deletePayout(payoutId: string): Promise<void> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const docRef = this.collection.doc(payoutId);
        const doc = await docRef.get();

        if (!doc.exists) throw new Error('Payout not found');

        const data = doc.data() as any;
        if (data.userId !== userId) {
            throw new Error('Unauthorized to delete this payout');
        }

        await docRef.delete();
        console.log('✅ Payout deleted:', payoutId);
    }

    subscribeToPayouts(
        callback: (payouts: Payout[]) => void,
        onError?: (error: Error) => void
    ): () => void {
        const userId = this.currentUserId;
        if (!userId) {
            onError?.(new Error('User not authenticated'));
            return () => { };
        }

        const unsubscribe = this.collection
            .where('userId', '==', userId)
            .orderBy('dueDate', 'asc')
            .onSnapshot(
                (snapshot) => {
                    const payouts = snapshot.docs
                        .map((doc) => this.documentToPayout(doc))
                        .filter((p): p is Payout => p !== null);
                    callback(payouts);
                },
                (error) => {
                    console.error('❌ Payout subscription error:', error);
                    onError?.(error);
                }
            );

        return unsubscribe;
    }

    calculateStats(payouts: Payout[]): PayoutStats {
        let totalPayTo = 0;
        let totalReceiveFrom = 0;
        let pendingPayments = 0;
        let pendingReceipts = 0;
        let completedCount = 0;

        payouts.forEach((p) => {
            if (p.status === 'pending') {
                if (p.type === 'pay_to') {
                    totalPayTo += p.amount;
                    pendingPayments++;
                } else {
                    totalReceiveFrom += p.amount;
                    pendingReceipts++;
                }
            } else if (p.status === 'paid' || p.status === 'received') {
                completedCount++;
            }
        });

        return {
            totalPayTo,
            totalReceiveFrom,
            netBalance: totalReceiveFrom - totalPayTo,
            pendingPayments,
            pendingReceipts,
            completedCount,
        };
    }
}

export const payoutService = new PayoutService();
export default payoutService;