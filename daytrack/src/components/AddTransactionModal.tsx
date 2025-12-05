// src/components/AddTransactionModal.tsx (REPLACE ENTIRE FILE)

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
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {
    TransactionType,
    PaymentMethod,
    CreateTransactionInput,
    UpdateTransactionInput,
    Transaction,
    DEFAULT_EXPENSE_CATEGORIES,
    DEFAULT_INCOME_CATEGORIES,
    PAYMENT_METHODS,
    Category,
} from '../types/expense';
import { addTransactionModalStyles as styles } from '../styles/expense/addTransactionModalStyles';
import Colors from '../constants/colors';

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (transaction: CreateTransactionInput | UpdateTransactionInput) => Promise<void>;
    isLoading?: boolean;
    editTransaction?: Transaction | null; // ✅ Add this for editing
}

const PAYMENT_METHOD_ICONS: { [key in PaymentMethod]: string } = {
    'Cash': 'cash-outline',
    'Credit Card': 'card-outline',
    'Debit Card': 'card-outline',
    'Bank Transfer': 'swap-horizontal-outline',
    'UPI': 'phone-portrait-outline',
    'Other': 'ellipsis-horizontal-outline',
};

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
    visible,
    onClose,
    onSave,
    isLoading = false,
    editTransaction = null, // ✅ Add this
}) => {
    const isEditMode = !!editTransaction; // ✅ Determine mode

    // Form State
    const [transactionType, setTransactionType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');

    // UI State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Refs
    const titleInputRef = useRef<TextInput>(null);
    const notesInputRef = useRef<TextInput>(null);

    // ✅ Load transaction data when editing
    useEffect(() => {
        if (visible) {
            if (isEditMode && editTransaction) {
                loadTransactionData(editTransaction);
            } else {
                resetForm();
            }
        }
    }, [visible, editTransaction]);

    // ✅ Load existing transaction data
    const loadTransactionData = (transaction: Transaction) => {
        setTransactionType(transaction.type);
        setAmount(transaction.amount.toString());
        setTitle(transaction.title);
        setPaymentMethod(transaction.paymentMethod);
        setDate(transaction.date);
        setNotes(transaction.notes || '');

        // Find and set category
        const categories = transaction.type === 'expense'
            ? DEFAULT_EXPENSE_CATEGORIES
            : DEFAULT_INCOME_CATEGORIES;

        const category = categories.find(c => c.name === transaction.category) || categories[0];
        setSelectedCategory(category);

        setErrors({});
        setFocusedInput(null);
    };

    // Auto-select first category when type changes (only in add mode)
    useEffect(() => {
        if (!isEditMode) {
            const categories = transactionType === 'expense'
                ? DEFAULT_EXPENSE_CATEGORIES
                : DEFAULT_INCOME_CATEGORIES;
            setSelectedCategory(categories[0]);
        }
    }, [transactionType, isEditMode]);

    const resetForm = () => {
        setTransactionType('expense');
        setAmount('');
        setTitle('');
        setSelectedCategory(DEFAULT_EXPENSE_CATEGORIES[0]);
        setPaymentMethod('Cash');
        setDate(new Date());
        setNotes('');
        setErrors({});
        setFocusedInput(null);
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!title.trim()) {
            newErrors.title = 'Please enter a title';
        }

        if (!selectedCategory) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        Keyboard.dismiss();

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setErrors({ ...errors, amount: 'Please enter a valid amount' });
            return;
        }

        const transactionData: CreateTransactionInput | UpdateTransactionInput = {
            title: title.trim(),
            amount: parsedAmount,
            type: transactionType,
            category: selectedCategory!.name,
            categoryIcon: selectedCategory!.icon,
            categoryColor: selectedCategory!.color,
            paymentMethod,
            notes: notes.trim() || undefined,
            date,
        };

        try {
            await onSave(transactionData);
            onClose();
        } catch (error) {
            console.error('Failed to save transaction:', error);
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
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        }
    };

    const categories = transactionType === 'expense'
        ? DEFAULT_EXPENSE_CATEGORIES
        : DEFAULT_INCOME_CATEGORIES;

    const canSave = amount && title.trim() && selectedCategory && !isLoading;

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
                    {/* Drag Handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    {/* Header - ✅ Dynamic title */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={22} color={Colors.primaryBlack} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Transaction Type Toggle */}
                        <View style={styles.typeToggleContainer}>
                            <Text style={styles.typeToggleLabel}>Transaction Type</Text>
                            <View style={styles.typeToggleRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.typeToggleButton,
                                        transactionType === 'expense' && styles.typeToggleButtonActive,
                                        transactionType === 'expense' && styles.typeToggleButtonExpense,
                                    ]}
                                    onPress={() => setTransactionType('expense')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="trending-down"
                                        size={20}
                                        color={transactionType === 'expense' ? Colors.negativeColor : 'rgba(0, 0, 0, 0.40)'}
                                    />
                                    <Text
                                        style={[
                                            styles.typeToggleText,
                                            transactionType === 'expense' && styles.typeToggleTextActive,
                                        ]}
                                    >
                                        Expense
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.typeToggleButton,
                                        transactionType === 'income' && styles.typeToggleButtonActive,
                                        transactionType === 'income' && styles.typeToggleButtonIncome,
                                    ]}
                                    onPress={() => setTransactionType('income')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="trending-up"
                                        size={20}
                                        color={transactionType === 'income' ? Colors.positiveColor : 'rgba(0, 0, 0, 0.40)'}
                                    />
                                    <Text
                                        style={[
                                            styles.typeToggleText,
                                            transactionType === 'income' && styles.typeToggleTextActive,
                                        ]}
                                    >
                                        Income
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Amount Input */}
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

                        {/* Title Input */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>
                                Title <Text style={styles.formLabelRequired}>*</Text>
                            </Text>
                            <View
                                style={[
                                    styles.textInputContainer,
                                    focusedInput === 'title' && styles.textInputFocused,
                                    errors.title && styles.textInputError,
                                ]}
                            >
                                <TextInput
                                    ref={titleInputRef}
                                    style={styles.textInput}
                                    placeholder="e.g., Grocery Shopping"
                                    placeholderTextColor="rgba(0, 0, 0, 0.40)"
                                    value={title}
                                    onChangeText={(text) => {
                                        setTitle(text);
                                        if (errors.title) setErrors({ ...errors, title: '' });
                                    }}
                                    onFocus={() => setFocusedInput('title')}
                                    onBlur={() => setFocusedInput(null)}
                                    maxLength={50}
                                />
                            </View>
                            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        </View>

                        {/* Category Selection */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>
                                Category <Text style={styles.formLabelRequired}>*</Text>
                            </Text>
                            <View style={styles.categoryGrid}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.categoryItem,
                                            selectedCategory?.id === category.id && styles.categoryItemActive,
                                        ]}
                                        onPress={() => {
                                            setSelectedCategory(category);
                                            if (errors.category) setErrors({ ...errors, category: '' });
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={[
                                                styles.categoryIconContainer,
                                                { backgroundColor: category.color },
                                            ]}
                                        >
                                            <Ionicons
                                                name={category.icon as any}
                                                size={24}
                                                color={Colors.primaryBlack}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                styles.categoryName,
                                                selectedCategory?.id === category.id && styles.categoryNameActive,
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                        </View>

                        {/* Payment Method */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Payment Method</Text>
                            <View style={styles.paymentMethodList}>
                                {PAYMENT_METHODS.map((method) => (
                                    <TouchableOpacity
                                        key={method}
                                        style={[
                                            styles.paymentMethodItem,
                                            paymentMethod === method && styles.paymentMethodItemActive,
                                        ]}
                                        onPress={() => setPaymentMethod(method)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.paymentMethodLeft}>
                                            <View style={styles.paymentMethodIcon}>
                                                <Ionicons
                                                    name={PAYMENT_METHOD_ICONS[method] as any}
                                                    size={20}
                                                    color={paymentMethod === method ? Colors.primaryBlack : 'rgba(0, 0, 0, 0.40)'}
                                                />
                                            </View>
                                            <Text
                                                style={[
                                                    styles.paymentMethodText,
                                                    paymentMethod === method && styles.paymentMethodTextActive,
                                                ]}
                                            >
                                                {method}
                                            </Text>
                                        </View>
                                        {paymentMethod === method && (
                                            <Ionicons name="checkmark-circle" size={22} color={Colors.positiveColor} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date Picker */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Date</Text>
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
                                    <Text
                                        style={[
                                            styles.datePickerText,
                                            styles.datePickerTextSelected,
                                        ]}
                                    >
                                        {formatDate(date)}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="rgba(0, 0, 0, 0.40)"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Notes Input */}
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

                        {/* Bottom Spacing */}
                        <View style={{ height: 20 }} />
                    </ScrollView>

                    {/* Action Buttons - ✅ Dynamic save text */}
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
                            style={[
                                styles.saveButton,
                                !canSave && styles.saveButtonDisabled,
                            ]}
                            onPress={handleSave}
                            activeOpacity={0.7}
                            disabled={!canSave}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <>
                                    <Ionicons
                                        name={isEditMode ? "checkmark-circle" : "add-circle"}
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                    <Text style={styles.saveButtonText}>
                                        {isEditMode ? 'Update Transaction' : 'Save Transaction'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker Modal */}
                    <DatePicker
                        modal
                        open={showDatePicker}
                        date={date}
                        mode="date"
                        maximumDate={new Date()}
                        onConfirm={(selectedDate) => {
                            setShowDatePicker(false);
                            setDate(selectedDate);
                        }}
                        onCancel={() => setShowDatePicker(false)}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default AddTransactionModal;