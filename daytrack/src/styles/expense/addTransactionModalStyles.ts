// src/styles/expense/addTransactionModalStyles.ts

import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

// @ts-ignore - gap property works in React Native but TypeScript types not updated yet
export const addTransactionModalStyles = StyleSheet.create({
    // Modal Container
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },

    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 8,
        maxHeight: '92%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },

    // Drag Handle
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },

    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    },

    headerTitle: {
        ...typography.heading2,
        fontSize: 22,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Content
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

    // Type Toggle
    typeToggleContainer: {
        marginBottom: 24,
    },

    typeToggleLabel: {
        ...typography.bodyMedium,
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 12,
    },

    typeToggleRow: {
        flexDirection: 'row',
        gap: 12,
    },

    typeToggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        borderWidth: 2,
        borderColor: 'transparent',
    },

    typeToggleButtonActive: {
        backgroundColor: '#FFFFFF',
        borderColor: Colors.primaryBlack,
        shadowColor: Colors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    typeToggleButtonExpense: {
        borderColor: Colors.negativeColor,
        backgroundColor: 'rgba(226, 0, 0, 0.08)',
    },

    typeToggleButtonIncome: {
        borderColor: Colors.positiveColor,
        backgroundColor: 'rgba(0, 71, 171, 0.08)',
    },

    typeToggleText: {
        ...typography.bodyMedium,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Medium',
        color: 'rgba(0, 0, 0, 0.60)',
    },

    typeToggleTextActive: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Form Section
    formSection: {
        marginBottom: 24,
    },

    formLabel: {
        ...typography.bodyMedium,
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 10,
    },

    formLabelRequired: {
        color: Colors.negativeColor,
    },

    // Amount Input
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    amountInputFocused: {
        borderColor: Colors.primaryBlack,
        backgroundColor: '#FFFFFF',
    },

    amountInputError: {
        borderColor: Colors.negativeColor,
    },

    currencyLabel: {
        ...typography.bodyLarge,
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: 'rgba(0, 0, 0, 0.40)',
        marginRight: 8,
    },

    amountInput: {
        flex: 1,
        ...typography.heading1,
        fontSize: 32,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
        paddingVertical: 12,
    },

    // Text Input
    textInputContainer: {
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    textInputFocused: {
        borderColor: Colors.primaryBlack,
        backgroundColor: '#FFFFFF',
    },

    textInputError: {
        borderColor: Colors.negativeColor,
    },

    textInput: {
        ...typography.bodyMedium,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.primaryBlack,
        padding: 0,
    },

    textInputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },

    // Error Text
    errorText: {
        ...typography.bodySmall,
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.negativeColor,
        marginTop: 6,
        marginLeft: 4,
    },

    // Category Grid
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    categoryItem: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#F7F8FA',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    categoryItemActive: {
        backgroundColor: '#FFFFFF',
        borderColor: Colors.primaryBlack,
        shadowColor: Colors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },

    categoryName: {
        ...typography.bodySmall,
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Medium',
        color: 'rgba(0, 0, 0, 0.60)',
        textAlign: 'center',
    },

    categoryNameActive: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Payment Method Picker
    paymentMethodList: {
        gap: 10,
    },

    paymentMethodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    paymentMethodItemActive: {
        backgroundColor: '#FFFFFF',
        borderColor: Colors.primaryBlack,
    },

    paymentMethodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    paymentMethodIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    paymentMethodText: {
        ...typography.bodyMedium,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Regular',
        color: 'rgba(0, 0, 0, 0.60)',
    },

    paymentMethodTextActive: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Date Picker
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    datePickerButtonActive: {
        borderColor: Colors.primaryBlack,
        backgroundColor: '#FFFFFF',
    },

    datePickerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    datePickerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    datePickerText: {
        ...typography.bodyMedium,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Regular',
        color: 'rgba(0, 0, 0, 0.60)',
    },

    datePickerTextSelected: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Action Buttons
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.08)',
        backgroundColor: '#FFFFFF',
    },

    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelButtonText: {
        ...typography.bodyLarge,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    saveButton: {
        flex: 2,
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: Colors.primaryBlack,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },

    saveButtonDisabled: {
        backgroundColor: 'rgba(0, 0, 0, 0.20)',
    },

    saveButtonText: {
        ...typography.bodyLarge,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },

    // Loading
    loadingContainer: {
        paddingVertical: 4,
    },
});

export default addTransactionModalStyles;