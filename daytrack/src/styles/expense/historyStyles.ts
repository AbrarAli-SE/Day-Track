// src/styles/historyStyles.ts

import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

export const historyStyles = StyleSheet.create({
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

    exportButton: {
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

    exportButtonText: {
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

    // Month Selector
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    monthButton: {
        padding: 8,
    },

    monthText: {
        ...typography.heading2,
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Summary Card
    summaryCard: {
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

    summaryTitle: {
        ...typography.heading2,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 16,
    },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    },

    summaryRowLast: {
        borderBottomWidth: 0,
        paddingTop: 12,
        marginTop: 4,
    },

    summaryLabel: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    summaryValue: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    summaryNetSavings: {
        fontSize: 20,
        fontFamily: 'YaldeviColombo-Bold',
    },

    // Category Breakdown
    categoryCard: {
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    },

    categoryItemLast: {
        borderBottomWidth: 0,
    },

    categoryLeft: {
        flex: 1,
    },

    categoryName: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    categoryCount: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    categoryAmount: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
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
});

export default historyStyles;