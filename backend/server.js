const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo (in production, use a real database)
let userAnalytics = {};
let backupData = {};

// ==================== MIDDLEWARE ====================

// API Key validation middleware
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or missing API key'
        });
    }

    next();
};

// ==================== ROUTES ====================

// Health check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Day Track API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// ==================== ANALYTICS ENDPOINTS ====================

/**
 * POST /api/analytics/calculate
 * Calculate advanced analytics for transactions
 */
app.post('/api/analytics/calculate', validateApiKey, (req, res) => {
    try {
        const { userId, transactions } = req.body;

        if (!userId || !transactions || !Array.isArray(transactions)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request data'
            });
        }

        // Calculate analytics
        const analytics = calculateAnalytics(transactions);

        // Store analytics for user
        userAnalytics[userId] = {
            ...analytics,
            lastUpdated: new Date().toISOString()
        };

        res.json({
            success: true,
            data: analytics,
            message: 'Analytics calculated successfully'
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate analytics',
            error: error.message
        });
    }
});

/**
 * GET /api/analytics/insights/:userId
 * Get AI-like insights and recommendations
 */
app.get('/api/analytics/insights/:userId', validateApiKey, (req, res) => {
    try {
        const { userId } = req.params;

        const analytics = userAnalytics[userId];

        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: 'No analytics data found for this user'
            });
        }

        // Generate insights
        const insights = generateInsights(analytics);

        res.json({
            success: true,
            data: insights,
            message: 'Insights generated successfully'
        });

    } catch (error) {
        console.error('Insights error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate insights',
            error: error.message
        });
    }
});

// ==================== EXPORT ENDPOINTS ====================

/**
 * POST /api/export/csv
 * Export transactions to CSV format with proper formatting
 */
app.post('/api/export/csv', validateApiKey, (req, res) => {
    try {
        const { transactions, month, year, userName } = req.body;

        if (!transactions || !Array.isArray(transactions)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transactions data'
            });
        }

        const csv = generateEnhancedCSV(transactions, month, year, userName);

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="transactions_${month}_${year}.csv"`);
        res.send(csv);

    } catch (error) {
        console.error('CSV export error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export CSV',
            error: error.message
        });
    }
});

/**
 * POST /api/export/pdf-data
 * Generate PDF data for mobile rendering
 */
app.post('/api/export/pdf-data', validateApiKey, (req, res) => {
    try {
        const { transactions, month, year, userName, summary } = req.body;

        if (!transactions || !Array.isArray(transactions)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transactions data'
            });
        }

        const pdfData = generatePDFData(transactions, month, year, userName, summary);

        res.json({
            success: true,
            data: pdfData,
            message: 'PDF data generated successfully'
        });

    } catch (error) {
        console.error('PDF data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF data',
            error: error.message
        });
    }
});

/**
 * POST /api/export/summary
 * Generate a monthly summary report
 */
app.post('/api/export/summary', validateApiKey, (req, res) => {
    try {
        const { transactions, month, year } = req.body;

        if (!transactions || !Array.isArray(transactions)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transactions data'
            });
        }

        const summary = generateMonthlySummary(transactions, month, year);

        res.json({
            success: true,
            data: summary,
            message: 'Summary generated successfully'
        });

    } catch (error) {
        console.error('Summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate summary',
            error: error.message
        });
    }
});

// ==================== BACKUP ENDPOINTS ====================

/**
 * POST /api/backup/create
 * Create a backup of user data
 */
app.post('/api/backup/create', validateApiKey, (req, res) => {
    try {
        const { userId, data } = req.body;

        if (!userId || !data) {
            return res.status(400).json({
                success: false,
                message: 'Invalid backup data'
            });
        }

        const backupId = `backup_${userId}_${Date.now()}`;

        backupData[backupId] = {
            userId,
            data,
            createdAt: new Date().toISOString(),
            size: JSON.stringify(data).length
        };

        res.json({
            success: true,
            data: {
                backupId,
                createdAt: backupData[backupId].createdAt,
                size: backupData[backupId].size
            },
            message: 'Backup created successfully'
        });

    } catch (error) {
        console.error('Backup error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create backup',
            error: error.message
        });
    }
});

/**
 * GET /api/backup/list/:userId
 * List all backups for a user
 */
app.get('/api/backup/list/:userId', validateApiKey, (req, res) => {
    try {
        const { userId } = req.params;

        const userBackups = Object.entries(backupData)
            .filter(([_, backup]) => backup.userId === userId)
            .map(([backupId, backup]) => ({
                backupId,
                createdAt: backup.createdAt,
                size: backup.size
            }));

        res.json({
            success: true,
            data: userBackups,
            count: userBackups.length,
            message: 'Backups retrieved successfully'
        });

    } catch (error) {
        console.error('Backup list error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve backups',
            error: error.message
        });
    }
});

// ==================== UTILITY FUNCTIONS ====================

function calculateAnalytics(transactions) {
    const analytics = {
        totalTransactions: transactions.length,
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        averageTransaction: 0,
        categoryBreakdown: {},
        paymentMethodBreakdown: {},
        dailyAverage: 0,
        monthlyTrend: [],
        topExpenseCategory: null,
        topIncomeCategory: null,
        savingsRate: 0
    };

    // Calculate totals and breakdowns
    transactions.forEach(t => {
        const amount = parseFloat(t.amount) || 0;

        if (t.type === 'income') {
            analytics.totalIncome += amount;
        } else {
            analytics.totalExpense += amount;
        }

        // Category breakdown
        if (!analytics.categoryBreakdown[t.category]) {
            analytics.categoryBreakdown[t.category] = {
                amount: 0,
                count: 0,
                type: t.type
            };
        }
        analytics.categoryBreakdown[t.category].amount += amount;
        analytics.categoryBreakdown[t.category].count += 1;

        // Payment method breakdown
        if (!analytics.paymentMethodBreakdown[t.paymentMethod]) {
            analytics.paymentMethodBreakdown[t.paymentMethod] = 0;
        }
        analytics.paymentMethodBreakdown[t.paymentMethod] += amount;
    });

    analytics.netBalance = analytics.totalIncome - analytics.totalExpense;
    analytics.averageTransaction = transactions.length > 0
        ? (analytics.totalIncome + analytics.totalExpense) / transactions.length
        : 0;

    // Calculate savings rate
    if (analytics.totalIncome > 0) {
        analytics.savingsRate = ((analytics.totalIncome - analytics.totalExpense) / analytics.totalIncome) * 100;
    }

    // Find top categories
    const categories = Object.entries(analytics.categoryBreakdown);
    const expenseCategories = categories.filter(([_, data]) => data.type === 'expense');
    const incomeCategories = categories.filter(([_, data]) => data.type === 'income');

    if (expenseCategories.length > 0) {
        analytics.topExpenseCategory = expenseCategories.reduce((max, curr) =>
            curr[1].amount > max[1].amount ? curr : max
        )[0];
    }

    if (incomeCategories.length > 0) {
        analytics.topIncomeCategory = incomeCategories.reduce((max, curr) =>
            curr[1].amount > max[1].amount ? curr : max
        )[0];
    }

    return analytics;
}

function generateInsights(analytics) {
    const insights = [];

    // Savings insight
    if (analytics.savingsRate > 20) {
        insights.push({
            type: 'positive',
            icon: 'trending-up',
            title: 'Great Savings!',
            message: `You're saving ${analytics.savingsRate.toFixed(1)}% of your income. Keep it up!`
        });
    } else if (analytics.savingsRate < 0) {
        insights.push({
            type: 'warning',
            icon: 'warning',
            title: 'Spending Alert',
            message: `You're spending more than you earn. Consider reducing expenses.`
        });
    }

    // Top expense category insight
    if (analytics.topExpenseCategory) {
        const categoryData = analytics.categoryBreakdown[analytics.topExpenseCategory];
        const percentage = (categoryData.amount / analytics.totalExpense) * 100;

        insights.push({
            type: 'info',
            icon: 'pie-chart',
            title: 'Top Expense Category',
            message: `${analytics.topExpenseCategory} accounts for ${percentage.toFixed(1)}% of your expenses.`
        });
    }

    // Budget recommendation
    const monthlyExpense = analytics.totalExpense;
    const recommendedBudget = monthlyExpense * 0.9; // Suggest 10% reduction

    insights.push({
        type: 'tip',
        icon: 'bulb',
        title: 'Budget Suggestion',
        message: `Try to keep expenses under Rs ${recommendedBudget.toFixed(0)} next month.`
    });

    return insights;
}

function generateCSV(transactions) {
    const headers = ['Date', 'Title', 'Category', 'Type', 'Amount', 'Payment Method', 'Notes'];
    const rows = transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.title,
        t.category,
        t.type,
        t.amount,
        t.paymentMethod,
        t.notes || ''
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
}

function generateEnhancedCSV(transactions, month, year, userName) {
    const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
    
    // Calculate summary
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') totalIncome += parseFloat(t.amount) || 0;
        else totalExpense += parseFloat(t.amount) || 0;
    });
    const netSavings = totalIncome - totalExpense;

    // CSV Header with metadata
    let csv = `"Day Track - Transaction Report"\n`;
    csv += `"Month:","${monthName} ${year}"\n`;
    csv += `"Generated for:","${userName || 'User'}"\n`;
    csv += `"Generated on:","${new Date().toLocaleString()}"\n`;
    csv += `\n`;
    
    // Summary section
    csv += `"Summary"\n`;
    csv += `"Total Transactions:","${transactions.length}"\n`;
    csv += `"Total Income:","Rs ${totalIncome.toFixed(2)}"\n`;
    csv += `"Total Expense:","Rs ${totalExpense.toFixed(2)}"\n`;
    csv += `"Net Savings:","Rs ${netSavings.toFixed(2)}"\n`;
    csv += `\n`;
    
    // Transaction details header
    csv += `"Transaction Details"\n`;
    const headers = ['Date', 'Time', 'Title', 'Category', 'Type', 'Amount (Rs)', 'Payment Method', 'Notes'];
    csv += headers.map(h => `"${h}"`).join(',') + '\n';
    
    // Transaction rows
    transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(t => {
            const date = new Date(t.date);
            const dateStr = date.toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            });
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            
            const row = [
                dateStr,
                timeStr,
                t.title,
                t.category,
                t.type === 'income' ? 'Income' : 'Expense',
                (t.type === 'income' ? '+' : '-') + parseFloat(t.amount).toFixed(2),
                t.paymentMethod,
                (t.notes || '').replace(/"/g, '""') // Escape quotes
            ];
            
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });
    
    // Footer
    csv += `\n`;
    csv += `"Report generated by Day Track App"\n`;
    csv += `"https://daytrack.app"\n`;

    return csv;
}

function generatePDFData(transactions, month, year, userName, summary) {
    const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
    
    // Calculate summary if not provided
    if (!summary) {
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach(t => {
            if (t.type === 'income') totalIncome += parseFloat(t.amount) || 0;
            else totalExpense += parseFloat(t.amount) || 0;
        });
        
        summary = {
            totalTransactions: transactions.length,
            totalIncome,
            totalExpense,
            netSavings: totalIncome - totalExpense,
            savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0
        };
    }

    // Group by category
    const categories = {};
    transactions.forEach(t => {
        if (!categories[t.category]) {
            categories[t.category] = { income: 0, expense: 0, count: 0 };
        }
        if (t.type === 'income') {
            categories[t.category].income += parseFloat(t.amount) || 0;
        } else {
            categories[t.category].expense += parseFloat(t.amount) || 0;
        }
        categories[t.category].count += 1;
    });

    return {
        metadata: {
            title: `Transaction Report - ${monthName} ${year}`,
            userName: userName || 'User',
            month: monthName,
            year,
            generatedDate: new Date().toLocaleString()
        },
        summary: {
            totalTransactions: summary.totalTransactions,
            totalIncome: summary.totalIncome.toFixed(2),
            totalExpense: summary.totalExpense.toFixed(2),
            netSavings: summary.netSavings.toFixed(2),
            savingsRate: summary.savingsRate.toFixed(1)
        },
        categories: Object.entries(categories)
            .sort(([, a], [, b]) => (b.income + b.expense) - (a.income + a.expense))
            .map(([name, data]) => ({
                name,
                amount: (data.income + data.expense).toFixed(2),
                count: data.count,
                type: data.income > data.expense ? 'income' : 'expense'
            })),
        transactions: transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(t => ({
                date: new Date(t.date).toLocaleDateString('en-US', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                }),
                time: new Date(t.date).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }),
                title: t.title,
                category: t.category,
                type: t.type,
                amount: parseFloat(t.amount).toFixed(2),
                paymentMethod: t.paymentMethod,
                notes: t.notes || ''
            }))
    };
}

function generateMonthlySummary(transactions, month, year) {
    const summary = {
        month,
        year,
        totalTransactions: transactions.length,
        totalIncome: 0,
        totalExpense: 0,
        categories: {},
        dailyBreakdown: {}
    };

    transactions.forEach(t => {
        const amount = parseFloat(t.amount) || 0;

        if (t.type === 'income') {
            summary.totalIncome += amount;
        } else {
            summary.totalExpense += amount;
        }

        // Category summary
        if (!summary.categories[t.category]) {
            summary.categories[t.category] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
            summary.categories[t.category].income += amount;
        } else {
            summary.categories[t.category].expense += amount;
        }

        // Daily breakdown
        const day = new Date(t.date).getDate();
        if (!summary.dailyBreakdown[day]) {
            summary.dailyBreakdown[day] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
            summary.dailyBreakdown[day].income += amount;
        } else {
            summary.dailyBreakdown[day].expense += amount;
        }
    });

    summary.netSavings = summary.totalIncome - summary.totalExpense;
    summary.savingsRate = summary.totalIncome > 0
        ? ((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100
        : 0;

    return summary;
}

// ==================== SCHEDULED TASKS ====================

// Daily analytics cleanup (runs at midnight)
cron.schedule('0 0 * * *', () => {
    console.log('🧹 Running daily cleanup...');

    // Clean old analytics (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    Object.keys(userAnalytics).forEach(userId => {
        const lastUpdated = new Date(userAnalytics[userId].lastUpdated);
        if (lastUpdated < thirtyDaysAgo) {
            delete userAnalytics[userId];
        }
    });

    console.log('✅ Cleanup complete');
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== START SERVER ====================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║     🚀 Day Track Backend API Running       ║
║                                            ║
║     Port: ${PORT}                             ║
║     Environment: ${process.env.NODE_ENV}               ║
║     Time: ${new Date().toLocaleString()}           ║
║     Local: http://localhost:${PORT}                   ║
║     Network: http://192.168.100.6:${PORT}             ║
║                                            ║
╚════════════════════════════════════════════╝

✅ Server is ready to accept connections from Android devices!
    `);
});