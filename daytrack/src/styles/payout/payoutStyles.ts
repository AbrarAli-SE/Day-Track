// src/styles/payout/payoutStyles.ts

import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

export const payoutStyles = StyleSheet.create({
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

    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primaryBlack,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
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

    // Stats Cards
    statsContainer: {
        marginBottom: 24,
    },

    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
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

    statCardPay: {
        backgroundColor: '#FFF5F5',
        borderColor: 'rgba(226, 0, 0, 0.15)',
    },

    statCardReceive: {
        backgroundColor: '#F0F7FF',
        borderColor: 'rgba(0, 71, 171, 0.15)',
    },

    statCardNet: {
        backgroundColor: '#F5F5F5',
    },

    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },

    statAmount: {
        ...typography.heading2,
        fontSize: 24,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    statLabel: {
        ...typography.bodySmall,
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    sectionTitle: {
        ...typography.heading2,
        fontSize: 20,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    filterTabs: {
        flexDirection: 'row',
        gap: 8,
    },

    filterTab: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },

    filterTabActive: {
        backgroundColor: Colors.primaryBlack,
    },

    filterTabText: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.secondaryBlack,
    },

    filterTabTextActive: {
        color: '#FFFFFF',
    },

    // Payout Card
    payoutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    payoutCardOverdue: {
        borderColor: Colors.negativeColor,
        borderWidth: 2,
    },

    payoutCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },

    payoutCardLeft: {
        flex: 1,
    },

    payoutPersonName: {
        ...typography.bodyLarge,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    payoutEmail: {
        ...typography.bodySmall,
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    payoutAmount: {
        ...typography.heading2,
        fontSize: 20,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
    },

    payoutAmountPay: {
        color: Colors.negativeColor,
    },

    payoutAmountReceive: {
        color: Colors.positiveColor,
    },

    payoutDetails: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },

    payoutDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    payoutDetailText: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    payoutStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },

    payoutStatusText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.secondaryBlack,
    },

    payoutActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.06)',
    },

    payoutActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },

    markPaidButton: {
        backgroundColor: 'rgba(0, 71, 171, 0.10)',
    },

    editButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },

    deleteButton: {
        backgroundColor: 'rgba(226, 0, 0, 0.08)',
    },

    payoutActionText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
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
    personSummarySection: {
        marginBottom: 20,
    },

    personSummaryHeader: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 12,
        paddingHorizontal: 20,
    },

    personCardsScroll: {
        paddingHorizontal: 20,
    },

    personSummaryCard: {
        width: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        shadowColor: Colors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    personSummaryAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primaryBlack,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    personSummaryAvatarText: {
        fontSize: 20,
        fontFamily: 'YaldeviColombo-Bold',
        color: '#FFFFFF',
    },

    personSummaryName: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    personSummaryBalance: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-Bold',
        marginBottom: 2,
    },

    personSummaryLabel: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginBottom: 8,
    },

    personSummaryCount: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    personSummaryCountNumber: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },
});

export default payoutStyles;