// src/styles/analyticsStyles.ts

import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

export const analyticsStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background || '#F7FEFF',
    },

    fixedHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: Colors.background || '#F7FEFF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    headerTitle: {
        ...typography.heading2,
        fontSize: 20,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.primaryBlack,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },

    refreshButtonText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },

    scrollView: {
        flex: 1,
        marginTop: 20,
    },

    scrollContent: {
        flexGrow: 1,
    },

    topBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        backgroundColor: 'rgba(225, 239, 210, 0.20)',
    },

    decorativeBlur1: {
        position: 'absolute',
        top: -80,
        right: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(225, 239, 210, 0.4)',
    },

    decorativeBlur2: {
        position: 'absolute',
        top: 60,
        left: -60,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(221, 231, 255, 0.3)',
    },

    contentContainer: {
        paddingHorizontal: 20,
    },

    // Overview Card
    overviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    sectionTitle: {
        ...typography.heading2,
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 16,
    },

    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },

    metricItem: {
        flex: 1,
        minWidth: '45%',
        maxWidth: '48%',
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    metricLabel: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginBottom: 6,
    },

    metricValue: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
    },

    // Insights Card
    insightsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    insightItem: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
        padding: 14,
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primaryBlack,
    },

    insightItemPositive: {
        borderLeftColor: Colors.positiveColor,
        backgroundColor: 'rgba(0, 71, 171, 0.05)',
    },

    insightItemWarning: {
        borderLeftColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.05)',
    },

    insightItemInfo: {
        borderLeftColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.05)',
    },

    insightItemTip: {
        borderLeftColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
    },

    insightIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    insightContent: {
        flex: 1,
    },

    insightTitle: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    insightMessage: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        lineHeight: 18,
    },

    // Category Breakdown
    categoryBreakdownCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    categoryItem: {
        marginBottom: 14,
    },

    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    categoryName: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    categoryPercentage: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.secondaryBlack,
    },

    progressBar: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        backgroundColor: Colors.primaryBlack,
        borderRadius: 4,
    },

    progressFillExpense: {
        backgroundColor: Colors.negativeColor,
    },

    progressFillIncome: {
        backgroundColor: Colors.positiveColor,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },

    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    emptyTitle: {
        ...typography.heading2,
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 8,
    },

    emptySubtitle: {
        ...typography.bodyMedium,
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        textAlign: 'center',
        lineHeight: 20,
    },

    // Loading
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },
});

export default analyticsStyles;