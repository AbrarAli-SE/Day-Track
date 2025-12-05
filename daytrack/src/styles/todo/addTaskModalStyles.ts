// src/styles/todo/addTaskModalStyles.ts

import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

export const addTaskModalStyles = StyleSheet.create({
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

    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },

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

    // Priority Selection
    priorityRow: {
        flexDirection: 'row',
        gap: 12,
    },

    priorityButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F7F8FA',
        borderWidth: 2,
        borderColor: 'transparent',
    },

    priorityButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: Colors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    priorityText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Medium',
        color: 'rgba(0, 0, 0, 0.60)',
    },

    priorityTextActive: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Date & Time Picker
    dateTimeRow: {
        flexDirection: 'row',
        gap: 12,
    },

    dateTimeButton: {
        flex: 1,
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

    dateTimeButtonActive: {
        borderColor: Colors.primaryBlack,
        backgroundColor: '#FFFFFF',
    },

    dateTimeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    dateTimeIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    dateTimeTextContainer: {
        flex: 1,
    },

    dateTimeLabel: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    dateTimeValue: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Recurrence
    recurrenceOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    recurrenceChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F7F8FA',
        borderWidth: 2,
        borderColor: 'transparent',
    },

    recurrenceChipActive: {
        backgroundColor: '#FFFFFF',
        borderColor: Colors.primaryBlack,
    },

    recurrenceText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Medium',
        color: 'rgba(0, 0, 0, 0.60)',
    },

    recurrenceTextActive: {
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    // Reminder Toggle
    reminderToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    reminderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    reminderIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 152, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    reminderTextContainer: {
        flex: 1,
    },

    reminderTitle: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    reminderSubtitle: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
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
});

export default addTaskModalStyles;