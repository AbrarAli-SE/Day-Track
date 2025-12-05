import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

export const expenseStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background || '#F7FEFF',
    },

    // Fixed Header
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

    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    avatarImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },

    profileTextContainer: {
        marginLeft: 12,
    },

    helloText: {
        ...typography.bodySmall,
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.60)',
    },

    nameText: {
        ...typography.bodyLarge,
        color: Colors.primaryBlack || '#000000',
    },

    // Scrollable Content
    scrollView: {
        flex: 1,
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

    // Overview Section
    overviewLabel: {
        ...typography.heading2,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.60)',
        marginBottom: 16,
        marginTop: 8,
    },

    // Balance Card
    balanceCard: {
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

    // Stats Row
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },

    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 59, 48, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    statAmount: {
        ...typography.statsAmount,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.negativeColor || '#FF3B30',
    },

    statLabel: {
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

    // Action Buttons
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },

    actionButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 8,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    actionButtonIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },

    actionButtonText: {
        ...typography.bodySmall,
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.primaryBlack || '#000000',
        textAlign: 'center',
    },

    // Recent Transactions Header
    recentTransactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    recentTransactionsTitle: {
        ...typography.heading2,
        fontSize: 20,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
    },

    filterButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },

    // Transaction List
    transactionList: {
        gap: 12,
    },

    transactionCard: {
        marginBottom: 0,
    },

    // Filter Modal (same as before)
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingBottom: 32,
        paddingHorizontal: 20,
        maxHeight: '80%',
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },

    modalTitle: {
        ...typography.heading1,
        fontSize: 24,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
    },

    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    filterSection: {
        marginBottom: 24,
    },

    filterSectionTitle: {
        ...typography.bodyLarge,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
        marginBottom: 12,
    },

    filterOptionsRow: {
        flexDirection: 'row',
        gap: 10,
    },

    filterOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },

    filterOptionActive: {
        backgroundColor: Colors.primaryBlack || '#000000',
        borderColor: Colors.primaryBlack || '#000000',
    },

    filterOptionActivePositive: {
        backgroundColor: Colors.positiveColor || '#34C759',
        borderColor: Colors.positiveColor || '#34C759',
    },

    filterOptionActiveNegative: {
        backgroundColor: Colors.negativeColor || '#FF3B30',
        borderColor: Colors.negativeColor || '#FF3B30',
    },

    filterOptionText: {
        ...typography.bodyMedium,
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.primaryBlack || '#000000',
    },

    filterOptionTextActive: {
        color: '#FFFFFF',
    },

    filterOptionsColumn: {
        gap: 10,
    },

    filterTimelineOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },

    filterTimelineOptionActive: {
        backgroundColor: '#FFFFFF',
        borderColor: Colors.primaryBlack || '#000000',
    },

    filterTimelineText: {
        ...typography.bodyMedium,
        flex: 1,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Regular',
        color: 'rgba(0, 0, 0, 0.60)',
    },

    filterTimelineTextActive: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
    },

    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },

    modalResetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
    },

    modalResetButtonText: {
        ...typography.bodyLarge,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
    },

    modalApplyButton: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.primaryBlack || '#000000',
        alignItems: 'center',
    },

    modalApplyButtonText: {
        ...typography.bodyLarge,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },
});