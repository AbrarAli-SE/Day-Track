// src/styles/home/homeStyles.ts

import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import typography from '../constants/typography';

export const homeStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background || '#F7FEFF',
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 100,
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
    },

    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },

    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    greetingContainer: {
        marginLeft: 12,
    },

    greetingText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    userName: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },

    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E20000',
    },

    // Quick Stats
    quickStatsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 16,
    },

    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },

    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    statValue: {
        fontSize: 20,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    statLabel: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    // Balance Card - SAME AS EXPENSE SCREEN
    balanceCardContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },

    balanceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    balanceLabel: {
        ...typography.bodyMedium,
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.60)',
    },

    eyeButton: {
        padding: 4,
    },

    balanceAmount: {
        ...typography.heading1,
        fontSize: 36,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
        marginBottom: 20,
    },

    // Stats Row - SAME AS EXPENSE SCREEN
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    statsStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },

    statsStatIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 59, 48, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    statsStatAmount: {
        ...typography.statsAmount,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.negativeColor || '#FF3B30',
    },

    statsStatLabel: {
        ...typography.statsLabel,
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.50)',
        marginTop: 2,
    },

    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        marginHorizontal: 16,
    },

    // Quick Actions
    quickActionsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },

    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    quickActionButton: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    quickActionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    quickActionText: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Recent Transactions
    recentSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    viewAllText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.positiveColor,
    },

    // Transaction Item
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },

    transactionIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    transactionInfo: {
        flex: 1,
    },

    transactionTitle: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 2,
    },

    transactionCategory: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    transactionAmount: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Bold',
    },

    // Task Item
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },

    taskCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    taskInfo: {
        flex: 1,
    },

    taskTitle: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    taskTime: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    taskCategoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },

    taskCategoryText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 30,
    },

    emptyIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    emptyText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    // Insights Card
    insightsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        borderLeftWidth: 4,
    },

    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    insightIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    insightTitle: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    insightMessage: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        lineHeight: 18,
    },
});

export default homeStyles;