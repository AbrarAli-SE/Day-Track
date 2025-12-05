// src/services/syncService.ts

import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
import transactionService from './transactionService';
import offlineStorageService from './offlineStorageService';

class SyncService {
  private isSyncing = false;

  // Check if sync is possible
  async canSync(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected && netInfo.isInternetReachable;
    const isLoggedIn = !!auth().currentUser;
    const syncEnabled = await offlineStorageService.isSyncEnabled();

    return isOnline && isLoggedIn && syncEnabled;
  }

  // Sync all pending transactions
  async syncPendingTransactions(): Promise<{
    success: number;
    failed: number;
    total: number;
  }> {
    if (this.isSyncing) {
      console.log('⏳ Sync already in progress...');
      return { success: 0, failed: 0, total: 0 };
    }

    const canSync = await this.canSync();
    if (!canSync) {
      console.log('❌ Cannot sync: offline, not logged in, or sync disabled');
      return { success: 0, failed: 0, total: 0 };
    }

    this.isSyncing = true;
    console.log('🔄 Starting sync...');

    let successCount = 0;
    let failedCount = 0;

    try {
      const pendingItems = await offlineStorageService.getPendingSync();
      const totalItems = pendingItems.length;

      console.log(`📊 Found ${totalItems} pending items to sync`);

      for (const item of pendingItems) {
        try {
          if (item.type === 'create' && item.data && item.tempId) {
            // Convert date string back to Date object (AsyncStorage serialization)
            const dataWithDate = {
              ...item.data,
              date: typeof item.data.date === 'string' ? new Date(item.data.date) : item.data.date,
            };

            // Create transaction in Firestore
            const transaction = await transactionService.createTransaction(
              dataWithDate
            );
            
            // Mark as synced locally
            await offlineStorageService.markAsSynced(item.tempId, transaction.id);
            successCount++;
            console.log(`✅ Synced create: ${item.tempId}`);
          } else if (item.type === 'update' && item.transactionId && item.data) {
            // Convert date string back to Date object if present
            const dataWithDate = item.data.date
              ? {
                  ...item.data,
                  date: typeof item.data.date === 'string' ? new Date(item.data.date) : item.data.date,
                }
              : item.data;

            // Update transaction in Firestore
            await transactionService.updateTransaction(
              item.transactionId,
              dataWithDate
            );
            successCount++;
            console.log(`✅ Synced update: ${item.transactionId}`);
          } else if (item.type === 'delete' && item.transactionId) {
            // Delete transaction from Firestore
            await transactionService.deleteTransaction(item.transactionId);
            successCount++;
            console.log(`✅ Synced delete: ${item.transactionId}`);
          }
        } catch (error) {
          console.error(`❌ Failed to sync item:`, error);
          failedCount++;
        }
      }

      // Clear synced items from pending queue
      if (successCount > 0) {
        await offlineStorageService.clearPendingSync();
        await offlineStorageService.updateLastSyncTime();
      }

      console.log(
        `✅ Sync complete: ${successCount} success, ${failedCount} failed out of ${totalItems}`
      );

      return { success: successCount, failed: failedCount, total: totalItems };
    } catch (error) {
      console.error('❌ Sync error:', error);
      return { success: successCount, failed: failedCount, total: 0 };
    } finally {
      this.isSyncing = false;
    }
  }

  // Auto-sync when conditions are met
  async autoSync(): Promise<void> {
    const canSync = await this.canSync();
    if (canSync) {
      await this.syncPendingTransactions();
    }
  }

  // Listen for network changes and auto-sync
  startAutoSyncListener(): () => void {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('📶 Internet connected, attempting auto-sync...');
        this.autoSync();
      }
    });

    return unsubscribe;
  }
}

export const syncService = new SyncService();
export default syncService;