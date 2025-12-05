// src/components/AddPayoutModal.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {
    PayoutType,
    CreatePayoutInput,
    UpdatePayoutInput,
    Payout,
} from '../types/payout';
import { addPayoutModalStyles as styles } from '../styles/payout/addPayoutModalStyles';
import Colors from '../constants/colors';

interface AddPayoutModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (payout: CreatePayoutInput | UpdatePayoutInput) => Promise<void>;
    isLoading?: boolean;
    editPayout?: Payout | null;
}

export const AddPayoutModal: React.FC<AddPayoutModalProps> = ({
    visible,
    onClose,
    onSave,
    isLoading = false,
    editPayout = null,
}) => {
    const isEditMode = !!editPayout;

    const [payoutType, setPayoutType] = useState<PayoutType>('pay_to');
    const [amount, setAmount] = useState('');
    const [personName, setPersonName] = useState('');
    const [personEmail, setPersonEmail] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const nameInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const notesInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) {
            if (isEditMode && editPayout) {
                loadPayoutData(editPayout);
            } else {
                resetForm();
            }
        }
    }, [visible, editPayout]);

    const loadPayoutData = (payout: Payout) => {
        setPayoutType(payout.type);
        setAmount(payout.amount.toString());
        setPersonName(payout.personName);
        setPersonEmail(payout.personEmail || '');
        setDueDate(payout.dueDate);
        setNotes(payout.notes || '');
        setErrors({});
        setFocusedInput(null);
    };

    const resetForm = () => {
        setPayoutType('pay_to');
        setAmount('');
        setPersonName('');
        setPersonEmail('');
        setDueDate(new Date());
        setNotes('');
        setErrors({});
        setFocusedInput(null);
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!personName.trim()) {
            newErrors.personName = 'Please enter person name';
        }

        if (personEmail && !personEmail.includes('@')) {
            newErrors.personEmail = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        Keyboard.dismiss();

        const payoutData: CreatePayoutInput | UpdatePayoutInput = {
            personName: personName.trim(),
            personEmail: personEmail.trim() || undefined,
            amount: parseFloat(amount),
            type: payoutType,
            dueDate,
            notes: notes.trim() || undefined,
        };

        try {
            await onSave(payoutData);
            onClose();
        } catch (error) {
            console.error('Failed to save payout:', error);
        }
    };

    const handleAmountChange = (text: string) => {
        const cleanText = text.replace(/[^0-9.]/g, '');
        const parts = cleanText.split('.');
        if (parts.length > 2) return;

        setAmount(cleanText);
        if (errors.amount) {
            setErrors({ ...errors, amount: '' });
        }
    };

    const formatDate = (date: Date): string => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        }
    };

    const canSave = amount && personName.trim() && !isLoading;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => {
                    Keyboard.dismiss();
                    onClose();
                }}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => Keyboard.dismiss()}
                >
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            {isEditMode ? 'Edit Payout' : 'Add Payout'}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={22} color={Colors.primaryBlack} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Payout Type Toggle */}
                        <View style={styles.typeToggleContainer}>
                            <Text style={styles.typeToggleLabel}>Payout Type</Text>
                            <View style={styles.typeToggleRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.typeToggleButton,
                                        payoutType === 'pay_to' && styles.typeToggleButtonActive,
                                        payoutType === 'pay_to' && styles.typeToggleButtonPayTo,
                                    ]}
                                    onPress={() => setPayoutType('pay_to')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="arrow-up-circle"
                                        size={20}
                                        color={payoutType === 'pay_to' ? Colors.negativeColor : 'rgba(0, 0, 0, 0.40)'}
                                    />
                                    <Text
                                        style={[
                                            styles.typeToggleText,
                                            payoutType === 'pay_to' && styles.typeToggleTextActive,
                                        ]}
                                    >
                                        I Need to Pay
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.typeToggleButton,
                                        payoutType === 'receive_from' && styles.typeToggleButtonActive,
                                        payoutType === 'receive_from' && styles.typeToggleButtonReceive,
                                    ]}
                                    onPress={() => setPayoutType('receive_from')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="arrow-down-circle"
                                        size={20}
                                        color={payoutType === 'receive_from' ? Colors.positiveColor : 'rgba(0, 0, 0, 0.40)'}
                                    />
                                    <Text
                                        style={[
                                            styles.typeToggleText,
                                            payoutType === 'receive_from' && styles.typeToggleTextActive,
                                        ]}
                                    >
                                        I Will Receive
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Amount */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>
                                Amount <Text style={styles.formLabelRequired}>*</Text>
                            </Text>
                            <View
                                style={[
                                    styles.amountInputContainer,
                                    focusedInput === 'amount' && styles.amountInputFocused,
                                    errors.amount && styles.amountInputError,
                                ]}
                            >
                                <Text style={styles.currencyLabel}>Rs</Text>
                                <TextInput
                                    style={styles.amountInput}
                                    placeholder="0"
                                    placeholderTextColor="rgba(0, 0, 0, 0.20)"
                                    keyboardType="decimal-pad"
                                    value={amount}
                                    onChangeText={handleAmountChange}
                                    onFocus={() => setFocusedInput('amount')}
                                    onBlur={() => setFocusedInput(null)}
                                    maxLength={10}
                                />
                            </View>
                            {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
                        </View>

                        {/* Person Name */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>
                                Person Name <Text style={styles.formLabelRequired}>*</Text>
                            </Text>
                            <View
                                style={[
                                    styles.textInputContainer,
                                    focusedInput === 'name' && styles.textInputFocused,
                                    errors.personName && styles.textInputError,
                                ]}
                            >
                                <TextInput
                                    ref={nameInputRef}
                                    style={styles.textInput}
                                    placeholder="e.g., John Doe"
                                    placeholderTextColor="rgba(0, 0, 0, 0.40)"
                                    value={personName}
                                    onChangeText={(text) => {
                                        setPersonName(text);
                                        if (errors.personName) setErrors({ ...errors, personName: '' });
                                    }}
                                    onFocus={() => setFocusedInput('name')}
                                    onBlur={() => setFocusedInput(null)}
                                    maxLength={50}
                                />
                            </View>
                            {errors.personName && <Text style={styles.errorText}>{errors.personName}</Text>}
                        </View>

                        {/* Email (Optional) */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Email (Optional)</Text>
                            <View
                                style={[
                                    styles.textInputContainer,
                                    focusedInput === 'email' && styles.textInputFocused,
                                    errors.personEmail && styles.textInputError,
                                ]}
                            >
                                <TextInput
                                    ref={emailInputRef}
                                    style={styles.textInput}
                                    placeholder="e.g., john@example.com"
                                    placeholderTextColor="rgba(0, 0, 0, 0.40)"
                                    value={personEmail}
                                    onChangeText={(text) => {
                                        setPersonEmail(text);
                                        if (errors.personEmail) setErrors({ ...errors, personEmail: '' });
                                    }}
                                    onFocus={() => setFocusedInput('email')}
                                    onBlur={() => setFocusedInput(null)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    maxLength={100}
                                />
                            </View>
                            {errors.personEmail && <Text style={styles.errorText}>{errors.personEmail}</Text>}
                        </View>

                        {/* Due Date */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Due Date</Text>
                            <TouchableOpacity
                                style={[
                                    styles.datePickerButton,
                                    showDatePicker && styles.datePickerButtonActive,
                                ]}
                                onPress={() => setShowDatePicker(true)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.datePickerLeft}>
                                    <View style={styles.datePickerIconContainer}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            color={Colors.primaryBlack}
                                        />
                                    </View>
                                    <Text style={[styles.datePickerText, styles.datePickerTextSelected]}>
                                        {formatDate(dueDate)}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="rgba(0, 0, 0, 0.40)" />
                            </TouchableOpacity>
                        </View>

                        {/* Notes */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Notes (Optional)</Text>
                            <View
                                style={[
                                    styles.textInputContainer,
                                    focusedInput === 'notes' && styles.textInputFocused,
                                ]}
                            >
                                <TextInput
                                    ref={notesInputRef}
                                    style={[styles.textInput, styles.textInputMultiline]}
                                    placeholder="Add any additional notes..."
                                    placeholderTextColor="rgba(0, 0, 0, 0.40)"
                                    value={notes}
                                    onChangeText={setNotes}
                                    onFocus={() => setFocusedInput('notes')}
                                    onBlur={() => setFocusedInput(null)}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={200}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        <View style={{ height: 20 }} />
                    </ScrollView>

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                            disabled={isLoading}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            activeOpacity={0.7}
                            disabled={!canSave}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <>
                                    <Ionicons
                                        name={isEditMode ? 'checkmark-circle' : 'add-circle'}
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                    <Text style={styles.saveButtonText}>
                                        {isEditMode ? 'Update Payout' : 'Save Payout'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <DatePicker
                        modal
                        open={showDatePicker}
                        date={dueDate}
                        mode="date"
                        minimumDate={new Date()}
                        onConfirm={(selectedDate) => {
                            setShowDatePicker(false);
                            setDueDate(selectedDate);
                        }}
                        onCancel={() => setShowDatePicker(false)}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default AddPayoutModal;