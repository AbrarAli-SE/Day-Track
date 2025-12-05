// src/components/AddTaskModal.tsx

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
    Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {
    TaskPriority,
    RecurrenceType,
    CreateTaskInput,
    UpdateTaskInput,
    Task,
    DEFAULT_TASK_CATEGORIES,
    PRIORITY_COLORS,
} from '../types/task';
import { addTaskModalStyles as styles } from '../styles/todo/addTaskModalStyles';
import Colors from '../constants/colors';

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (task: CreateTaskInput | UpdateTaskInput) => Promise<void>;
    isLoading?: boolean;
    editTask?: Task | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
    visible,
    onClose,
    onSave,
    isLoading = false,
    editTask = null,
}) => {
    const isEditMode = !!editTask;

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_TASK_CATEGORIES[0]);
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [dueDate, setDueDate] = useState(new Date());
    const [dueTime, setDueTime] = useState('');
    const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderDate, setReminderDate] = useState<Date | undefined>();

    // UI State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showReminderPicker, setShowReminderPicker] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Refs
    const titleInputRef = useRef<TextInput>(null);
    const descInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) {
            if (isEditMode && editTask) {
                loadTaskData(editTask);
            } else {
                resetForm();
            }
        }
    }, [visible, editTask]);

    const loadTaskData = (task: Task) => {
        setTitle(task.title);
        setDescription(task.description || '');

        const category = DEFAULT_TASK_CATEGORIES.find(c => c.name === task.category) || DEFAULT_TASK_CATEGORIES[0];
        setSelectedCategory(category);

        setPriority(task.priority);
        setDueDate(task.dueDate);
        setDueTime(task.dueTime || '');
        setRecurrence(task.recurrence);

        if (task.reminder) {
            setReminderEnabled(true);
            setReminderDate(task.reminder);
        } else {
            setReminderEnabled(false);
            setReminderDate(undefined);
        }

        setErrors({});
        setFocusedInput(null);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSelectedCategory(DEFAULT_TASK_CATEGORIES[0]);
        setPriority('medium');

        // Set due date to today
        const today = new Date();
        setDueDate(today);
        setDueTime('');

        setRecurrence('none');
        setReminderEnabled(false);
        setReminderDate(undefined);
        setErrors({});
        setFocusedInput(null);
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Please enter a task title';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        Keyboard.dismiss();

        const taskData: CreateTaskInput | UpdateTaskInput = {
            title: title.trim(),
            description: description.trim() || undefined,
            category: selectedCategory.name,
            categoryColor: selectedCategory.color,
            categoryIcon: selectedCategory.icon,
            priority,
            dueDate,
            dueTime: dueTime || undefined,
            recurrence,
            reminder: reminderEnabled ? reminderDate : undefined,
        };

        try {
            await onSave(taskData);
            onClose();
        } catch (error) {
            console.error('Failed to save task:', error);
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

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleTimeSelect = (selectedDate: Date) => {
        setShowTimePicker(false);
        const timeString = formatTime(selectedDate);
        setDueTime(timeString);
    };

    const handleReminderToggle = (value: boolean) => {
        setReminderEnabled(value);
        if (value && !reminderDate) {
            // Set default reminder to 30 minutes before due date
            const defaultReminder = new Date(dueDate);
            defaultReminder.setMinutes(defaultReminder.getMinutes() - 30);
            setReminderDate(defaultReminder);
        }
    };

    const canSave = title.trim() && !isLoading;

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
                            {isEditMode ? 'Edit Task' : 'Add New Task'}
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
                        {/* Title Input */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>
                                Task Title <Text style={styles.formLabelRequired}>*</Text>
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
                                    placeholder="e.g., Complete project report"
                                    placeholderTextColor="rgba(0, 0, 0, 0.40)"
                                    value={title}
                                    onChangeText={(text) => {
                                        setTitle(text);
                                        if (errors.title) setErrors({ ...errors, title: '' });
                                    }}
                                    onFocus={() => setFocusedInput('title')}
                                    onBlur={() => setFocusedInput(null)}
                                    maxLength={100}
                                />
                            </View>
                            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        </View>

                        {/* Description */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Description (Optional)</Text>
                            <View
                                style={[
                                    styles.textInputContainer,
                                    focusedInput === 'description' && styles.textInputFocused,
                                ]}
                            >
                                <TextInput
                                    ref={descInputRef}
                                    style={[styles.textInput, styles.textInputMultiline]}
                                    placeholder="Add task details..."
                                    placeholderTextColor="rgba(0, 0, 0, 0.40)"
                                    value={description}
                                    onChangeText={setDescription}
                                    onFocus={() => setFocusedInput('description')}
                                    onBlur={() => setFocusedInput(null)}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={300}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        {/* Category Selection */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Category</Text>
                            <View style={styles.categoryGrid}>
                                {DEFAULT_TASK_CATEGORIES.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.categoryItem,
                                            selectedCategory.id === category.id && styles.categoryItemActive,
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={[
                                                styles.categoryIconContainer,
                                                { backgroundColor: category.color + '20' },
                                            ]}
                                        >
                                            <Ionicons
                                                name={category.icon as any}
                                                size={24}
                                                color={category.color}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                styles.categoryName,
                                                selectedCategory.id === category.id && styles.categoryNameActive,
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Priority */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Priority</Text>
                            <View style={styles.priorityRow}>
                                {(['high', 'medium', 'low'] as TaskPriority[]).map((p) => (
                                    <TouchableOpacity
                                        key={p}
                                        style={[
                                            styles.priorityButton,
                                            priority === p && styles.priorityButtonActive,
                                            priority === p && { borderColor: PRIORITY_COLORS[p] },
                                        ]}
                                        onPress={() => setPriority(p)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name="flag"
                                            size={18}
                                            color={priority === p ? PRIORITY_COLORS[p] : 'rgba(0, 0, 0, 0.40)'}
                                        />
                                        <Text
                                            style={[
                                                styles.priorityText,
                                                priority === p && styles.priorityTextActive,
                                            ]}
                                        >
                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Date & Time */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Due Date & Time</Text>
                            <View style={styles.dateTimeRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.dateTimeButton,
                                        showDatePicker && styles.dateTimeButtonActive,
                                    ]}
                                    onPress={() => setShowDatePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.dateTimeLeft}>
                                        <View style={styles.dateTimeIconContainer}>
                                            <Ionicons name="calendar-outline" size={18} color={Colors.primaryBlack} />
                                        </View>
                                        <View style={styles.dateTimeTextContainer}>
                                            <Text style={styles.dateTimeLabel}>Date</Text>
                                            <Text style={styles.dateTimeValue}>{formatDate(dueDate)}</Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.40)" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.dateTimeButton,
                                        showTimePicker && styles.dateTimeButtonActive,
                                    ]}
                                    onPress={() => setShowTimePicker(true)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.dateTimeLeft}>
                                        <View style={styles.dateTimeIconContainer}>
                                            <Ionicons name="time-outline" size={18} color={Colors.primaryBlack} />
                                        </View>
                                        <View style={styles.dateTimeTextContainer}>
                                            <Text style={styles.dateTimeLabel}>Time</Text>
                                            <Text style={styles.dateTimeValue}>
                                                {dueTime || 'No time'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="rgba(0, 0, 0, 0.40)" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Recurrence */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Repeat</Text>
                            <View style={styles.recurrenceOptions}>
                                {(['none', 'daily', 'weekly', 'monthly'] as RecurrenceType[]).map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        style={[
                                            styles.recurrenceChip,
                                            recurrence === r && styles.recurrenceChipActive,
                                        ]}
                                        onPress={() => setRecurrence(r)}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            style={[
                                                styles.recurrenceText,
                                                recurrence === r && styles.recurrenceTextActive,
                                            ]}
                                        >
                                            {r === 'none' ? 'Does not repeat' : r.charAt(0).toUpperCase() + r.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Reminder */}
                        <View style={styles.formSection}>
                            <Text style={styles.formLabel}>Reminder</Text>
                            <TouchableOpacity
                                style={styles.reminderToggle}
                                activeOpacity={1}
                                onPress={() => setShowReminderPicker(true)}
                                disabled={!reminderEnabled}
                            >
                                <View style={styles.reminderLeft}>
                                    <View style={styles.reminderIconContainer}>
                                        <Ionicons name="notifications-outline" size={22} color="#FF9800" />
                                    </View>
                                    <View style={styles.reminderTextContainer}>
                                        <Text style={styles.reminderTitle}>Set Reminder</Text>
                                        <Text style={styles.reminderSubtitle}>
                                            {reminderEnabled && reminderDate
                                                ? `${formatDate(reminderDate)} at ${formatTime(reminderDate)}`
                                                : 'Get notified before task'}
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={reminderEnabled}
                                    onValueChange={handleReminderToggle}
                                    trackColor={{ false: '#E0E0E0', true: '#FF9800' + '40' }}
                                    thumbColor={reminderEnabled ? '#FF9800' : '#f4f3f4'}
                                />
                            </TouchableOpacity>
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
                                        {isEditMode ? 'Update Task' : 'Create Task'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker */}
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

                    {/* Time Picker */}
                    <DatePicker
                        modal
                        open={showTimePicker}
                        date={dueDate}
                        mode="time"
                        onConfirm={handleTimeSelect}
                        onCancel={() => setShowTimePicker(false)}
                    />

                    {/* Reminder Picker */}
                    <DatePicker
                        modal
                        open={showReminderPicker}
                        date={reminderDate || dueDate}
                        mode="datetime"
                        maximumDate={dueDate}
                        onConfirm={(selectedDate) => {
                            setShowReminderPicker(false);
                            setReminderDate(selectedDate);
                        }}
                        onCancel={() => setShowReminderPicker(false)}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default AddTaskModal;