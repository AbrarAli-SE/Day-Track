import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface TaskCardProps {
    task: {
        id: string;
        title: string;
        time: string;
        done: boolean;
        category: string;
        color: string;
    };
    isLast: boolean;
    onMenuPress: (id: string) => void;
    onTaskPress: () => void;
}

export default function TaskCard({ task, isLast, onMenuPress, onTaskPress }: TaskCardProps) {
    return (
        <View style={styles.taskItemContainer}>
            {/* Timeline Line */}
            {!isLast && <View style={styles.timelineLine} />}

            {/* Task Card */}
            <TouchableOpacity
                style={[
                    styles.taskCard,
                    task.done && styles.taskCardDone,
                    { borderLeftColor: task.color },
                ]}
                activeOpacity={0.7}
                onPress={onTaskPress}
            >
                {/* Time Badge */}
                <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={14} color="#5E5F60" />
                    <Text style={styles.timeText}>{task.time}</Text>
                </View>

                {/* Task Content */}
                <View style={styles.taskContent}>
                    <View style={styles.taskLeft}>
                        {/* Checkbox */}
                        <TouchableOpacity
                            style={styles.taskCheckbox}
                            activeOpacity={0.7}
                            onPress={onTaskPress}
                        >
                            {task.done ? (
                                <View style={[styles.checkboxFilled, { backgroundColor: task.color }]}>
                                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                                </View>
                            ) : (
                                <View style={[styles.checkboxEmpty, { borderColor: task.color }]} />
                            )}
                        </TouchableOpacity>

                        {/* Task Info */}
                        <View style={styles.taskInfo}>
                            <Text style={[
                                styles.taskTitle,
                                task.done && styles.taskTitleDone,
                            ]}>
                                {task.title}
                            </Text>
                            <View style={styles.taskMeta}>
                                <View style={[styles.categoryDot, { backgroundColor: task.color }]} />
                                <Text style={styles.taskCategory}>{task.category}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Task Actions */}
                    <TouchableOpacity
                        style={styles.taskMoreButton}
                        activeOpacity={0.7}
                        onPress={() => onMenuPress(task.id)}
                    >
                        <Ionicons name="ellipsis-horizontal" size={20} color="#5E5F60" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    taskItemContainer: {
        position: 'relative',
        marginBottom: 16,
    },

    timelineLine: {
        position: 'absolute',
        left: 8,
        top: 50,
        width: 2,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
    },

    taskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
    },

    taskCardDone: {
        opacity: 0.6,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },

    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },

    timeText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#5E5F60',
    },

    taskContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    taskLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    taskCheckbox: {
        marginRight: 12,
    },

    checkboxEmpty: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
    },

    checkboxFilled: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    taskInfo: {
        flex: 1,
    },

    taskTitle: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
        marginBottom: 6,
    },

    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: '#5E5F60',
    },

    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    categoryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },

    taskCategory: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: '#5E5F60',
    },

    taskMoreButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});