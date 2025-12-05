// src/services/payoutService.ts (REPLACE ENTIRE FILE)

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
    Payout,
    CreatePayoutInput,
    UpdatePayoutInput,
    PayoutStats,
} from '../types/payout';

const COLLECTION_NAME = 'payouts';
const PEOPLE_COLLECTION = 'payout_people';

// ✅ Enable offline persistence
firestore()
    .settings({
        persistence: true,
        cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    })
    .then(() => {
        console.log('✅ Firestore (Payouts) persistence enabled');
    })
    .catch((error) => {
        console.error('❌ Firestore persistence error:', error);
    });

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

export interface PersonSummary {
    id: string;
    name: string;
    email?: string;
    pendingBalance: number; // Only pending payouts
    totalTransactions: number; // All transactions including paid
    pendingTransactions: number; // Only pending count
    lastTransactionDate: Date;
}

class PayoutService {
    private get collection() {
        return firestore().collection(COLLECTION_NAME);
    }

    private get peopleCollection() {
        return firestore().collection(PEOPLE_COLLECTION);
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
            notes: data.notes || '', // ✅ Handle undefined
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            paidAt: data.paidAt?.toDate(),
        };
    }

    private documentToPerson(doc: FirebaseFirestoreTypes.DocumentSnapshot): PayoutPerson | null {
        if (!doc.exists) return null;

        const data = doc.data() as any;
        return {
            id: doc.id,
            userId: data.userId,
            name: data.name,
            email: data.email,
            totalOwed: data.totalOwed || 0,
            lastTransactionDate: data.lastTransactionDate.toDate(),
            transactionCount: data.transactionCount || 0,
            createdAt: data.createdAt.toDate(),
        };
    }

    // ✅ Create or get person
    async getOrCreatePerson(name: string, email?: string): Promise<PayoutPerson> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        // Check if person exists
        const snapshot = await this.peopleCollection
            .where('userId', '==', userId)
            .where('name', '==', name.trim())
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const person = this.documentToPerson(snapshot.docs[0]);
            if (person) return person;
        }

        // Create new person
        const now = firestore.Timestamp.now();
        const docData = {
            userId,
            name: name.trim(),
            email: email?.trim() || '',
            totalOwed: 0,
            lastTransactionDate: now,
            transactionCount: 0,
            createdAt: now,
        };

        const docRef = await this.peopleCollection.add(docData);
        const newDoc = await docRef.get();
        const person = this.documentToPerson(newDoc);
        if (!person) throw new Error('Failed to create person');

        console.log('✅ Person created:', person.id);
        return person;
    }

    // ✅ Get all people
    async getPeople(): Promise<PayoutPerson[]> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const snapshot = await this.peopleCollection
            .where('userId', '==', userId)
            .get();

        return snapshot.docs
            .map((doc) => this.documentToPerson(doc))
            .filter((p): p is PayoutPerson => p !== null);
    }

    // ✅ Subscribe to people
    subscribeToPeople(
        callback: (people: PayoutPerson[]) => void,
        onError?: (error: Error) => void
    ): () => void {
        const userId = this.currentUserId;
        if (!userId) {
            onError?.(new Error('User not authenticated'));
            return () => { };
        }

        const unsubscribe = this.peopleCollection
            .where('userId', '==', userId)
            .onSnapshot(
                {
                    includeMetadataChanges: true,
                },
                (snapshot) => {
                    let people = snapshot.docs
                        .map((doc) => this.documentToPerson(doc))
                        .filter((p): p is PayoutPerson => p !== null);

                    // ✅ Sort client-side by last transaction date descending
                    people.sort((a, b) => b.lastTransactionDate.getTime() - a.lastTransactionDate.getTime());

                    const source = snapshot.metadata.fromCache ? '💾 Cache' : '📥 Server';
                    console.log(`${source}: Loaded ${people.length} people`);

                    callback(people);
                },
                (error) => {
                    console.error('❌ People subscription error:', error);
                    onError?.(error);
                }
            );

        return unsubscribe;
    }

    // ✅ Update person balance
    private async updatePersonBalance(personId: string, amount: number, type: 'pay_to' | 'receive_from') {
        const personRef = this.peopleCollection.doc(personId);
        const doc = await personRef.get();

        if (doc.exists()) {
            const currentTotal = doc.data()?.totalOwed || 0;
            const change = type === 'pay_to' ? -amount : amount; // pay_to reduces what they owe me
            const newTotal = currentTotal + change;

            await personRef.update({
                totalOwed: newTotal,
                lastTransactionDate: firestore.Timestamp.now(),
                transactionCount: firestore.FieldValue.increment(1),
            });
        }
    }

    async createPayout(input: CreatePayoutInput): Promise<Payout> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        // Get or create person
        const person = await this.getOrCreatePerson(input.personName, input.personEmail);

        const now = firestore.Timestamp.now();
        const docData: any = {
            userId,
            personId: person.id, // ✅ Link to person
            personName: input.personName.trim(),
            personEmail: input.personEmail?.trim() || '',
            amount: Math.abs(input.amount),
            type: input.type,
            status: 'pending',
            dueDate: firestore.Timestamp.fromDate(input.dueDate),
            createdAt: now,
            updatedAt: now,
        };

        // ✅ Only add notes if it exists
        if (input.notes && input.notes.trim() !== '') {
            docData.notes = input.notes.trim();
        }

        const docRef = await this.collection.add(docData);

        // Update person balance
        await this.updatePersonBalance(person.id, docData.amount, input.type);

        console.log('✅ Payout created:', docRef.id);

        // ✅ Return immediately for optimistic UI
        return {
            id: docRef.id,
            userId,
            personName: input.personName.trim(),
            personEmail: input.personEmail,
            amount: Math.abs(input.amount),
            type: input.type,
            status: 'pending',
            dueDate: input.dueDate,
            notes: input.notes,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
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
        if (input.personEmail !== undefined) updateData.personEmail = input.personEmail?.trim() || '';
        if (input.amount !== undefined) updateData.amount = Math.abs(input.amount);
        if (input.type !== undefined) updateData.type = input.type;
        if (input.status !== undefined) {
            updateData.status = input.status;
            if (input.status === 'paid' || input.status === 'received') {
                updateData.paidAt = firestore.Timestamp.now();
            }
        }
        if (input.dueDate !== undefined) updateData.dueDate = firestore.Timestamp.fromDate(input.dueDate);

        // ✅ Handle notes properly
        if (input.notes !== undefined) {
            if (input.notes && input.notes.trim() !== '') {
                updateData.notes = input.notes.trim();
            } else {
                updateData.notes = firestore.FieldValue.delete();
            }
        }

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
            .onSnapshot(
                {
                    includeMetadataChanges: true,
                },
                (snapshot) => {
                    let payouts = snapshot.docs
                        .map((doc) => this.documentToPayout(doc))
                        .filter((p): p is Payout => p !== null);

                    // ✅ Sort client-side by due date descending (newest first)
                    payouts.sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

                    const source = snapshot.metadata.fromCache ? '💾 Cache' : '📥 Server';
                    console.log(`${source}: Loaded ${payouts.length} payouts`);

                    callback(payouts);
                },
                (error) => {
                    console.error('❌ Payout subscription error:', error);
                    onError?.(error);
                }
            );

        return unsubscribe;
    }

    async getPersonSummaries(): Promise<PersonSummary[]> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        // Get all people
        const people = await this.getPeople();

        // Get all payouts (including paid ones)
        const allPayoutsSnapshot = await this.collection
            .where('userId', '==', userId)
            .get();

        const allPayouts = allPayoutsSnapshot.docs
            .map((doc) => this.documentToPayout(doc))
            .filter((p): p is Payout => p !== null);

        // Group by person
        const summaryMap = new Map<string, PersonSummary>();

        people.forEach((person) => {
            const personPayouts = allPayouts.filter(
                (p) => p.personName === person.name
            );

            // Calculate pending balance only
            let pendingBalance = 0;
            let pendingCount = 0;

            personPayouts.forEach((payout) => {
                if (payout.status === 'pending') {
                    if (payout.type === 'pay_to') {
                        pendingBalance -= payout.amount; // I owe them (negative)
                    } else {
                        pendingBalance += payout.amount; // They owe me (positive)
                    }
                    pendingCount++;
                }
            });

            summaryMap.set(person.id, {
                id: person.id,
                name: person.name,
                email: person.email,
                pendingBalance,
                totalTransactions: personPayouts.length,
                pendingTransactions: pendingCount,
                lastTransactionDate: person.lastTransactionDate,
            });
        });

        // Convert to array and sort by most recent activity (newest first)
        return Array.from(summaryMap.values())
            .filter((s) => s.totalTransactions > 0) // Only show people with transactions
            .sort((a, b) => b.lastTransactionDate.getTime() - a.lastTransactionDate.getTime());
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
            netBalance: totalReceiveFrom - totalPayTo, // ✅ Only pending balance
            pendingPayments,
            pendingReceipts,
            completedCount,
        };
    }
}

export const payoutService = new PayoutService();
export default payoutService;