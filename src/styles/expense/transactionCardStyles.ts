import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

export const transactionCardStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    mainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },

    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },

    icon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },

    textContainer: {
        marginLeft: 14,
        flex: 1,
    },

    title: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack,
    },

    rightContent: {
        alignItems: 'flex-end',
        gap: 4,
    },

    amount: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
    },

    incomeText: {
        color: Colors.positiveColor,
    },

    expenseText: {
        color: Colors.negativeColor,
    },

    chevronIcon: {
        marginTop: 2,
    },

    // Expanded Content Styles
    expandedContent: {
        marginTop: 16,
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        marginBottom: 16,
    },

    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    detailLabel: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    detailValue: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    notesContainer: {
        marginTop: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
    },

    notesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },

    notesText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack,
        lineHeight: 20,
    },

    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.06)',
    },

    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 6,
    },

    editButton: {
        backgroundColor: Colors.positiveColor,
    },

    deleteButton: {
        backgroundColor: Colors.negativeColor,
    },

    actionButtonText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },
});