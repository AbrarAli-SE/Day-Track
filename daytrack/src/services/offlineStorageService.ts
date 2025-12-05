// src/services/offlineStorageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from '../types/expense';

const KEYS = {
  TRANSACTIONS: '@daytrack_offline_transactions',
  PENDING_SYNC: '@daytrack_pending_sync',
  SYNC_ENABLED: '@daytrack_sync_enabled',
  LAST_SYNC: '@daytrack_last_sync',
};

interface OfflineTransaction extends CreateTransactionInput {
  tempId: string;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

interface PendingSyncItem {
  type: 'create' | 'update' | 'delete';
  transactionId?: string;
  tempId?: string;
  data?: CreateTransactionInput | UpdateTransactionInput;
}

class OfflineStorageService {
  // Check if cloud sync is enabled
  async isSyncEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(KEYS.SYNC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking sync status:', error);
      return false;
    }
  }

  // Enable/Disable cloud sync
  async setSyncEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SYNC_ENABLED, enabled.toString());
      console.log(`✅ Cloud sync ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error setting sync status:', error);
    }
  }

  // Save transaction offline
  async saveTransactionOffline(
    transaction: CreateTransactionInput
  ): Promise<OfflineTransaction> {
    try {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const offlineTransaction: OfflineTransaction = {
        ...transaction,
        tempId,
        syncStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const existingData = await this.getAllOfflineTransactions();
      existingData.push(offlineTransaction);

      await AsyncStorage.setItem(
        KEYS.TRANSACTIONS,
        JSON.stringify(existingData)
      );

      // Add to pending sync queue
      await this.addToPendingSync({
        type: 'create',
        tempId,
        data: transaction,
      });

      console.log('✅ Transaction saved offline:', tempId);
      return offlineTransaction;
    } catch (error) {
      console.error('Error saving transaction offline:', error);
      throw error;
    }
  }

  // Get all offline transactions
  async getAllOfflineTransactions(): Promise<OfflineTransaction[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
      if (!data) return [];

      const transactions = JSON.parse(data);
      // Convert date strings back to Date objects
      return transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting offline transactions:', error);
      return [];
    }
  }

  // Update offline transaction
  async updateTransactionOffline(
    tempId: string,
    updates: Partial<CreateTransactionInput>
  ): Promise<void> {
    try {
      const transactions = await this.getAllOfflineTransactions();
      const index = transactions.findIndex((t) => t.tempId === tempId);

      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          ...updates,
          updatedAt: new Date(),
          syncStatus: 'pending',
        };

        await AsyncStorage.setItem(
          KEYS.TRANSACTIONS,
          JSON.stringify(transactions)
        );

        await this.addToPendingSync({
          type: 'update',
          tempId,
          data: updates,
        });

        console.log('✅ Transaction updated offline:', tempId);
      }
    } catch (error) {
      console.error('Error updating offline transaction:', error);
      throw error;
    }
  }

  // Delete offline transaction
  async deleteTransactionOffline(tempId: string): Promise<void> {
    try {
      const transactions = await this.getAllOfflineTransactions();
      const filtered = transactions.filter((t) => t.tempId !== tempId);

      await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(filtered));

      await this.addToPendingSync({
        type: 'delete',
        tempId,
      });

      console.log('✅ Transaction deleted offline:', tempId);
    } catch (error) {
      console.error('Error deleting offline transaction:', error);
      throw error;
    }
  }

  // Add to pending sync queue
  private async addToPendingSync(item: PendingSyncItem): Promise<void> {
    try {
      const pending = await this.getPendingSync();
      pending.push(item);
      await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify(pending));
    } catch (error) {
      console.error('Error adding to pending sync:', error);
    }
  }

  // Get pending sync queue
  async getPendingSync(): Promise<PendingSyncItem[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PENDING_SYNC);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting pending sync:', error);
      return [];
    }
  }

  // Clear pending sync queue
  async clearPendingSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.PENDING_SYNC, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing pending sync:', error);
    }
  }

  // Mark transaction as synced
  async markAsSynced(tempId: string, firestoreId?: string): Promise<void> {
    try {
      const transactions = await this.getAllOfflineTransactions();
      const index = transactions.findIndex((t) => t.tempId === tempId);

      if (index !== -1) {
        transactions[index].syncStatus = 'synced';
        await AsyncStorage.setItem(
          KEYS.TRANSACTIONS,
          JSON.stringify(transactions)
        );
      }
    } catch (error) {
      console.error('Error marking as synced:', error);
    }
  }

  // Update last sync time
  async updateLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Error updating last sync time:', error);
    }
  }

  // Get last sync time
  async getLastSyncTime(): Promise<Date | null> {
    try {
      const time = await AsyncStorage.getItem(KEYS.LAST_SYNC);
      return time ? new Date(time) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  // Clear all offline data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.TRANSACTIONS,
        KEYS.PENDING_SYNC,
        KEYS.LAST_SYNC,
      ]);
      console.log('✅ All offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }

  // Get sync statistics
  async getSyncStats(): Promise<{
    total: number;
    pending: number;
    synced: number;
    failed: number;
  }> {
    try {
      const transactions = await this.getAllOfflineTransactions();
      return {
        total: transactions.length,
        pending: transactions.filter((t) => t.syncStatus === 'pending').length,
        synced: transactions.filter((t) => t.syncStatus === 'synced').length,
        failed: transactions.filter((t) => t.syncStatus === 'failed').length,
      };
    } catch (error) {
      console.error('Error getting sync stats:', error);
      return { total: 0, pending: 0, synced: 0, failed: 0 };
    }
  }
}

export const offlineStorageService = new OfflineStorageService();
export default offlineStorageService;