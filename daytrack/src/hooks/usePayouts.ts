// src/hooks/usePayouts.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import auth from '@react-native-firebase/auth';
import payoutService from '../services/payoutService';
import {
    Payout,
    CreatePayoutInput,
    UpdatePayoutInput,
    PayoutStats,
} from '../types/payout';

interface UsePayoutsReturn {
    payouts: Payout[];
    stats: PayoutStats;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
    createPayout: (input: CreatePayoutInput) => Promise<Payout | null>;
    updatePayout: (id: string, input: UpdatePayoutInput) => Promise<Payout | null>;
    deletePayout: (id: string) => Promise<boolean>;
    markAsPaid: (id: string) => Promise<boolean>;
    isAuthenticated: boolean;
}

const DEFAULT_STATS: PayoutStats = {
    totalPayTo: 0,
    totalReceiveFrom: 0,
    netBalance: 0,
    pendingPayments: 0,
    pendingReceipts: 0,
    completedCount: 0,
};

export function usePayouts(): UsePayoutsReturn {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth().currentUser);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            if (!user) {
                setPayouts([]);
                setIsLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setPayouts([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const unsubscribe = payoutService.subscribeToPayouts(
            (fetchedPayouts) => {
                setPayouts(fetchedPayouts);
                setIsLoading(false);
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
            }
        );

        return unsubscribe;
    }, [isAuthenticated]);

    const stats = useMemo(() => {
        if (payouts.length === 0) return DEFAULT_STATS;
        return payoutService.calculateStats(payouts);
    }, [payouts]);

    const createPayout = useCallback(
        async (input: CreatePayoutInput): Promise<Payout | null> => {
            if (!isAuthenticated) {
                setError('Please login to add payouts');
                return null;
            }

            setIsCreating(true);
            setError(null);

            try {
                const payout = await payoutService.createPayout(input);
                return payout;
            } catch (err: any) {
                setError(err.message || 'Failed to create payout');
                return null;
            } finally {
                setIsCreating(false);
            }
        },
        [isAuthenticated]
    );

    const updatePayout = useCallback(
        async (id: string, input: UpdatePayoutInput): Promise<Payout | null> => {
            if (!isAuthenticated) {
                setError('Please login to update payouts');
                return null;
            }

            setIsUpdating(true);
            setError(null);

            try {
                const payout = await payoutService.updatePayout(id, input);
                return payout;
            } catch (err: any) {
                setError(err.message || 'Failed to update payout');
                return null;
            } finally {
                setIsUpdating(false);
            }
        },
        [isAuthenticated]
    );

    const deletePayout = useCallback(
        async (id: string): Promise<boolean> => {
            if (!isAuthenticated) {
                setError('Please login to delete payouts');
                return false;
            }

            setIsDeleting(true);
            setError(null);

            try {
                await payoutService.deletePayout(id);
                return true;
            } catch (err: any) {
                setError(err.message || 'Failed to delete payout');
                return false;
            } finally {
                setIsDeleting(false);
            }
        },
        [isAuthenticated]
    );

    const markAsPaid = useCallback(
        async (id: string): Promise<boolean> => {
            const payout = payouts.find((p) => p.id === id);
            if (!payout) return false;

            const status = payout.type === 'pay_to' ? 'paid' : 'received';
            const result = await updatePayout(id, { status });
            return !!result;
        },
        [payouts, updatePayout]
    );

    return {
        payouts,
        stats,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        createPayout,
        updatePayout,
        deletePayout,
        markAsPaid,
        isAuthenticated,
    };
}

export default usePayouts;