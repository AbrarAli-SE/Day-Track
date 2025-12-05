// src/types/task.ts

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed' | 'overdue';
export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface TaskCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    category: string;
    categoryColor: string;
    categoryIcon: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date;
    dueTime?: string; // Format: "HH:MM AM/PM"
    completed: boolean;
    completedAt?: Date;
    recurrence: RecurrenceType;
    subtasks: Subtask[];
    reminder?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskDocument {
    userId: string;
    title: string;
    description?: string;
    category: string;
    categoryColor: string;
    categoryIcon: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: FirebaseFirestoreTypes.Timestamp;
    dueTime?: string;
    completed: boolean;
    completedAt?: FirebaseFirestoreTypes.Timestamp;
    recurrence: RecurrenceType;
    subtasks: Subtask[];
    reminder?: FirebaseFirestoreTypes.Timestamp;
    createdAt: FirebaseFirestoreTypes.Timestamp;
    updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    category: string;
    categoryColor: string;
    categoryIcon: string;
    priority: TaskPriority;
    dueDate: Date;
    dueTime?: string;
    recurrence: RecurrenceType;
    subtasks?: Subtask[];
    reminder?: Date;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    category?: string;
    categoryColor?: string;
    categoryIcon?: string;
    priority?: TaskPriority;
    dueDate?: Date;
    dueTime?: string;
    completed?: boolean;
    recurrence?: RecurrenceType;
    subtasks?: Subtask[];
    reminder?: Date;
}

export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
    todayTasks: number;
    todayCompleted: number;
    weekStreak: number;
}

export interface TaskFilter {
    category?: string;
    priority?: TaskPriority;
    status?: 'all' | 'pending' | 'completed' | 'overdue';
    date?: Date;
}

// Default categories
export const DEFAULT_TASK_CATEGORIES: TaskCategory[] = [
    { id: '1', name: 'Work', icon: 'briefcase-outline', color: '#0047AB' },
    { id: '2', name: 'Personal', icon: 'person-outline', color: '#FF9800' },
    { id: '3', name: 'Health', icon: 'fitness-outline', color: '#34C759' },
    { id: '4', name: 'Shopping', icon: 'cart-outline', color: '#9C27B0' },
    { id: '5', name: 'Finance', icon: 'wallet-outline', color: '#2196F3' },
    { id: '6', name: 'Study', icon: 'book-outline', color: '#FF6B35' },
];

export const PRIORITY_COLORS = {
    high: '#E20000',
    medium: '#FF9800',
    low: '#34C759',
};