// daytrack/src/services/backendService.ts

import axios from 'axios';
import { Transaction } from '../types/expense';

// Backend API URL - Updated with your actual IP address
// Your WiFi IP: 192.168.100.6
const BASE_URL = __DEV__
    ? 'http://192.168.100.6:3000/api'  // ✅ Updated to your actual IP
    : 'https://your-production-api.com/api';

const API_KEY = 'daytrack_secret_key_2024';

class BackendService {
    private axios = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
        },
        timeout: 10000,
    });

    // Calculate advanced analytics
    async calculateAnalytics(userId: string, transactions: Transaction[]) {
        try {
            const response = await this.axios.post('/analytics/calculate', {
                userId,
                transactions: transactions.map(t => ({
                    ...t,
                    date: t.date.toISOString(),
                })),
            });

            return response.data;
        } catch (error: any) {
            console.error('Analytics API error:', error.message);
            throw error;
        }
    }

    // Get AI insights
    async getInsights(userId: string) {
        try {
            const response = await this.axios.get(`/analytics/insights/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error('Insights API error:', error.message);
            throw error;
        }
    }

    // Export to CSV with enhanced data
    async exportToCSV(transactions: any[], month?: number, year?: number, userName?: string) {
        try {
            const response = await this.axios.post(
                '/export/csv',
                {
                    transactions: transactions.map(t => ({
                        ...t,
                        date: t.date?.toISOString ? t.date.toISOString() : t.date,
                    })),
                    month,
                    year,
                    userName,
                },
                {
                    responseType: 'text',
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('CSV export error:', error.message);
            throw error;
        }
    }

    // Get monthly summary with PDF data
    async getMonthlySummary(
        transactions: any[],
        month: number,
        year: number,
        userName?: string,
        summary?: any
    ) {
        try {
            const response = await this.axios.post('/export/pdf-data', {
                transactions: transactions.map(t => ({
                    ...t,
                    date: t.date?.toISOString ? t.date.toISOString() : t.date,
                })),
                month,
                year,
                userName,
                summary,
            });

            return response.data;
        } catch (error: any) {
            console.error('PDF data error:', error.message);
            throw error;
        }
    }

    // Create backup
    async createBackup(userId: string, data: any) {
        try {
            const response = await this.axios.post('/backup/create', {
                userId,
                data,
            });

            return response.data;
        } catch (error: any) {
            console.error('Backup API error:', error.message);
            throw error;
        }
    }

    // List backups
    async listBackups(userId: string) {
        try {
            const response = await this.axios.get(`/backup/list/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error('Backup list error:', error.message);
            throw error;
        }
    }

    // Health check
    async checkHealth() {
        try {
            const response = await this.axios.get('/', {
                baseURL: BASE_URL.replace('/api', ''),
            });
            return response.data;
        } catch (error: any) {
            console.error('Health check error:', error.message);
            return null;
        }
    }
}

export const backendService = new BackendService();
export default backendService;