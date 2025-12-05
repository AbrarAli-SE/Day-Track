// src/services/exportService.ts

import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Platform, Alert } from 'react-native';
import backendService from './backendService';
import { Transaction } from '../types/expense';
import { requestStoragePermission, checkStoragePermission } from '../utils/permissions';

class ExportService {
    // Generate CSV offline (fallback)
    private generateOfflineCSV(
        transactions: Transaction[],
        month: number,
        year: number,
        userName: string
    ): string {
        const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
        
        let csv = `Day Track - Transaction Report\n`;
        csv += `Month: ${monthName} ${year}\n`;
        csv += `User: ${userName}\n\n`;
        
        csv += `Date,Time,Title,Category,Type,Amount,Payment Method,Notes\n`;
        
        transactions
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .forEach(t => {
                const date = t.date.toLocaleDateString();
                const time = t.date.toLocaleTimeString();
                csv += `${date},${time},${t.title},${t.category},${t.type},${t.amount},${t.paymentMethod},"${t.notes || ''}"\n`;
            });
        
        return csv;
    }

    // Generate CSV and save to file
    async exportToCSV(
        transactions: Transaction[],
        month: number,
        year: number,
        userName: string
    ): Promise<boolean> {
        // ✅ Check permission first
        const hasPermission = await checkStoragePermission();
        if (!hasPermission) {
            const granted = await requestStoragePermission();
            if (!granted) {
                Alert.alert('Permission Required', 'Storage permission is needed to export files.');
                return false;
            }
        }

        try {
            console.log('📥 Requesting CSV from backend...');

            const csvContent = await backendService.exportToCSV(
                transactions.map(t => ({
                    ...t,
                    date: t.date.toISOString(),
                })),
                month,
                year,
                userName
            );

            const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
            const fileName = `DayTrack_${monthName}_${year}.csv`;
            const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

            // Write file
            await RNFS.writeFile(filePath, csvContent, 'utf8');
            console.log('✅ CSV file created:', filePath);

            // Share file
            await Share.open({
                title: 'Export Transactions',
                message: `Transaction report for ${monthName} ${year}`,
                url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
                type: 'text/csv',
                subject: `Transaction Report - ${monthName} ${year}`,
                filename: fileName,
            });

            console.log('✅ CSV exported successfully');
            return true;
        } catch (error: any) {
            console.error('❌ CSV export error:', error);
            if (error.message && error.message.includes('User did not share')) {
                // User cancelled share dialog - not an error
                return false;
            }
            
            // Fallback to offline generation
            try {
                console.warn('⚠️ Backend unavailable, using offline CSV generation');
                
                const csvContent = this.generateOfflineCSV(transactions, month, year, userName);
                
                const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
                const fileName = `DayTrack_${monthName}_${year}.csv`;
                const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

                await RNFS.writeFile(filePath, csvContent, 'utf8');
                console.log('✅ Offline CSV file created:', filePath);

                await Share.open({
                    title: 'Export Transactions',
                    message: `Transaction report for ${monthName} ${year}`,
                    url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
                    type: 'text/csv',
                    subject: `Transaction Report - ${monthName} ${year}`,
                    filename: fileName,
                });

                console.log('✅ Offline CSV exported successfully');
                return true;
            } catch (fallbackError: any) {
                console.error('❌ Offline CSV export failed:', fallbackError);
                if (fallbackError.message && fallbackError.message.includes('User did not share')) {
                    return false;
                }
                throw new Error('Failed to export CSV');
            }
        }
    }

    // Generate HTML for PDF rendering
    private generateHTMLReport(pdfData: any): string {
        const { metadata, summary, categories, transactions } = pdfData;

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            padding: 40px 30px;
            background: #ffffff;
            color: #151623;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #151623;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            color: #151623;
        }
        .header p {
            font-size: 14px;
            color: #5E5F60;
            margin: 4px 0;
        }
        .summary {
            background: #F7FEFF;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            border-left: 4px solid #151623;
        }
        .summary h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #151623;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }
        .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        .summary-label {
            font-size: 14px;
            color: #5E5F60;
        }
        .summary-value {
            font-size: 14px;
            font-weight: 600;
            color: #151623;
        }
        .summary-value.positive { color: #0047AB; }
        .summary-value.negative { color: #E20000; }
        .section {
            margin-bottom: 25px;
        }
        .section h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #151623;
            border-bottom: 2px solid #F7FEFF;
            padding-bottom: 8px;
        }
        .category-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
        }
        .category-item {
            background: #F7FEFF;
            padding: 12px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .category-name {
            font-size: 13px;
            color: #151623;
            font-weight: 500;
        }
        .category-amount {
            font-size: 14px;
            font-weight: 600;
            color: #151623;
        }
        .category-count {
            font-size: 11px;
            color: #5E5F60;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background: #151623;
            color: white;
            padding: 10px 8px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
        }
        td {
            padding: 10px 8px;
            border-bottom: 1px solid #F0F0F0;
            font-size: 12px;
            color: #151623;
        }
        tr:hover {
            background: #F7FEFF;
        }
        .amount {
            font-weight: 600;
            text-align: right;
        }
        .amount.income { color: #0047AB; }
        .amount.expense { color: #E20000; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #F0F0F0;
            text-align: center;
            color: #5E5F60;
            font-size: 12px;
        }
        @media print {
            body { padding: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 ${metadata.title}</h1>
        <p>Generated for: <strong>${metadata.userName}</strong></p>
        <p>Date: ${metadata.generatedDate}</p>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <span class="summary-label">Total Transactions:</span>
                <span class="summary-value">${summary.totalTransactions}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Savings Rate:</span>
                <span class="summary-value ${parseFloat(summary.savingsRate) > 0 ? 'positive' : 'negative'}">
                    ${summary.savingsRate}%
                </span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Income:</span>
                <span class="summary-value positive">Rs ${summary.totalIncome}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Expense:</span>
                <span class="summary-value negative">Rs ${summary.totalExpense}</span>
            </div>
            <div class="summary-item" style="grid-column: 1 / -1;">
                <span class="summary-label">Net Savings:</span>
                <span class="summary-value ${parseFloat(summary.netSavings) > 0 ? 'positive' : 'negative'}">
                    Rs ${summary.netSavings}
                </span>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Top Categories</h2>
        <div class="category-list">
            ${categories.slice(0, 6).map((cat: any) => `
                <div class="category-item">
                    <div>
                        <div class="category-name">${cat.name}</div>
                        <div class="category-count">${cat.count} transactions</div>
                    </div>
                    <div class="category-amount ${cat.type}">Rs ${cat.amount}</div>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="section">
        <h2>Transaction Details</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Payment</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map((t: any) => `
                    <tr>
                        <td>${t.date}<br><small style="color: #5E5F60;">${t.time}</small></td>
                        <td><strong>${t.title}</strong>${t.notes ? `<br><small style="color: #5E5F60;">${t.notes}</small>` : ''}</td>
                        <td>${t.category}</td>
                        <td>${t.paymentMethod}</td>
                        <td class="amount ${t.type}">
                            ${t.type === 'income' ? '+' : '-'} Rs ${t.amount}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Generated by <strong>Day Track App</strong></p>
        <p>Your personal finance companion</p>
    </div>
</body>
</html>
    `;
    }

    // Generate PDF (HTML-based)
    async exportToPDF(
        transactions: Transaction[],
        month: number,
        year: number,
        userName: string,
        summary: any
    ): Promise<boolean> {
        // ✅ Check permission first
        const hasPermission = await checkStoragePermission();
        if (!hasPermission) {
            const granted = await requestStoragePermission();
            if (!granted) {
                Alert.alert('Permission Required', 'Storage permission is needed to export files.');
                return false;
            }
        }

        try {
            console.log('📄 Generating PDF data...');

            const result = await backendService.getMonthlySummary(
                transactions.map(t => ({
                    ...t,
                    date: t.date.toISOString(),
                })),
                month,
                year,
                userName,
                summary
            );

            if (!result.success) {
                throw new Error('Failed to generate PDF data');
            }

            const htmlContent = this.generateHTMLReport(result.data);

            const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
            const fileName = `DayTrack_${monthName}_${year}.html`;
            const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

            await RNFS.writeFile(filePath, htmlContent, 'utf8');
            console.log('✅ PDF/HTML file created:', filePath);

            await Share.open({
                title: 'Export Transaction Report',
                message: `Transaction report for ${monthName} ${year}`,
                url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
                type: 'text/html',
                subject: `Transaction Report - ${monthName} ${year}`,
                filename: fileName,
            });

            console.log('✅ PDF exported successfully');
            return true;
        } catch (error: any) {
            console.error('❌ PDF export error:', error);
            if (error.message && error.message.includes('User did not share')) {
                return false;
            }
            throw new Error('Failed to export PDF');
        }
    }
}

export const exportService = new ExportService();
export default exportService;