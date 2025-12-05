// src/components/TaskCard.tsx (REPLACE ENTIRE FILE)

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Task, PRIORITY_COLORS } from '../types/task';
import Colors from '../constants/colors';

interface TaskCardProps {
    task: Task;
    isLast?: boolean;
    onMenuPress?: (taskId: string) => void;
    onTaskPress?: (taskId: string) => void;
    onToggleComplete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    isLast = false,
    onMenuPress,
    onTaskPress,
    onToggleComplete,
}) => {
    const formatTime = (timeString?: string) => {
        if (!timeString) return null;
        return timeString;
    };

    const isOverdue = task.status === 'overdue';
    const priorityColor = PRIORITY_COLORS[task.priority];

    return (
        <View style={[styles.container, isLast && styles.lastCard]}>
            {/* Timeline Connector */}
            {!isLast && <View style={styles.timeline} />}

            {/* Time Badge */}
            <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{formatTime(task.dueTime) || 'All Day'}</Text>
            </View>

            {/* Task Card */}
            <TouchableOpacity
                style={[
                    styles.card,
                    task.completed && styles.cardCompleted,
                    isOverdue && !task.completed && styles.cardOverdue,
                ]}
                onPress={() => onTaskPress?.(task.id)}
                onLongPress={() => onMenuPress?.(task.id)}
                activeOpacity={0.7}
            >
                {/* Priority Indicator */}
                <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />

                <View style={styles.content}>
                    {/* Checkbox */}
                    <TouchableOpacity
                        style={[
                            styles.checkbox,
                            task.completed && styles.checkboxCompleted,
                            { borderColor: task.categoryColor },
                            task.completed && { backgroundColor: task.categoryColor },
                        ]}
                        onPress={() => onToggleComplete?.(task.id)}
                        activeOpacity={0.7}
                    >
                        {task.completed && (
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>

                    {/* Task Info */}
                    <View style={styles.taskInfo}>
                        <Text
                            style={[
                                styles.taskTitle,
                                task.completed && styles.taskTitleCompleted,
                            ]}
                            numberOfLines={2}
                        >
                            {task.title}
                        </Text>

                        {task.description && (
                            <Text style={styles.taskDescription} numberOfLines={1}>
                                {task.description}
                            </Text>
                        )}

                        <View style={styles.taskMeta}>
                            {/* Category */}
                            <View style={[styles.categoryBadge, { backgroundColor: task.categoryColor + '20' }]}>
                                <Ionicons name={task.categoryIcon as any} size={12} color={task.categoryColor} />
                                <Text style={[styles.categoryText, { color: task.categoryColor }]}>
                                    {task.category}
                                </Text>
                            </View>

                            {/* Recurrence Indicator */}
                            {task.recurrence !== 'none' && (
                                <View style={styles.recurrenceIndicator}>
                                    <Ionicons name="repeat" size={12} color={Colors.secondaryBlack} />
                                    <Text style={styles.recurrenceText}>{task.recurrence}</Text>
                                </View>
                            )}

                            {/* Overdue Badge */}
                            {isOverdue && !task.completed && (
                                <View style={styles.overdueBadge}>
                                    <Ionicons name="alert-circle" size={12} color={Colors.negativeColor} />
                                    <Text style={styles.overdueText}>Overdue</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Menu Button */}
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => onMenuPress?.(task.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="ellipsis-vertical" size={18} color={Colors.secondaryBlack} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 20,
    },

    lastCard: {
        marginBottom: 0,
    },

    timeline: {
        position: 'absolute',
        left: 16,
        top: 48,
        bottom: -20,
        width: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },

    timeBadge: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 2,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },

    timeText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginLeft: 32,
        marginTop: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
    },

    cardCompleted: {
        opacity: 0.7,
    },

    cardOverdue: {
        borderColor: Colors.negativeColor,
        borderWidth: 1.5,
    },

    priorityIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },

    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        paddingLeft: 20,
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    checkboxCompleted: {
        borderWidth: 0,
    },

    taskInfo: {
        flex: 1,
    },

    taskTitle: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
        lineHeight: 22,
    },

    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: Colors.secondaryBlack,
    },

    taskDescription: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginBottom: 8,
    },

    taskMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },

    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },

    categoryText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
    },

    recurrenceIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },

    recurrenceText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.secondaryBlack,
    },

    overdueBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(226, 0, 0, 0.10)',
    },

    overdueText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.negativeColor,
    },

    menuButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
});

export default TaskCard;