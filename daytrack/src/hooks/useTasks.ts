// src/hooks/useTasks.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import auth from '@react-native-firebase/auth';
import taskService from '../services/taskService';
import {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
    TaskStats,
    TaskFilter,
} from '../types/task';

interface UseTasksReturn {
    tasks: Task[];
    filteredTasks: Task[];
    stats: TaskStats;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
    createTask: (input: CreateTaskInput) => Promise<Task | null>;
    updateTask: (id: string, input: UpdateTaskInput) => Promise<Task | null>;
    deleteTask: (id: string) => Promise<boolean>;
    toggleTaskCompletion: (id: string) => Promise<boolean>;
    refreshTasks: () => Promise<void>;
    filter: TaskFilter;
    setFilter: (filter: TaskFilter) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Task[];
    isAuthenticated: boolean;
}

const DEFAULT_STATS: TaskStats = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    todayTasks: 0,
    todayCompleted: 0,
    weekStreak: 0,
};

export function useTasks(): UseTasksReturn {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<TaskFilter>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth().currentUser);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            if (!user) {
                setTasks([]);
                setIsLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setTasks([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        const unsubscribe = taskService.subscribeToTasks(
            (fetchedTasks) => {
                setTasks(fetchedTasks);
                setIsLoading(false);
            },
            (err) => {
                setError(err.message);
                setIsLoading(false);
            }
        );

        return unsubscribe;
    }, [isAuthenticated]);

    const stats = useMemo(() => {
        if (tasks.length === 0) return DEFAULT_STATS;
        return taskService.calculateStats(tasks);
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        let result = [...tasks];

        if (filter.category && filter.category !== 'All') {
            result = result.filter((t) => t.category === filter.category);
        }

        if (filter.priority) {
            result = result.filter((t) => t.priority === filter.priority);
        }

        if (filter.status && filter.status !== 'all') {
            if (filter.status === 'completed') {
                result = result.filter((t) => t.completed);
            } else if (filter.status === 'pending') {
                result = result.filter((t) => !t.completed && t.status === 'pending');
            } else if (filter.status === 'overdue') {
                result = result.filter((t) => t.status === 'overdue');
            }
        }

        if (filter.date) {
            const filterDate = new Date(filter.date);
            const filterStart = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
            const filterEnd = new Date(filterStart);
            filterEnd.setDate(filterEnd.getDate() + 1);

            result = result.filter((t) => t.dueDate >= filterStart && t.dueDate < filterEnd);
        }

        return result;
    }, [tasks, filter]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return taskService.searchTasks(tasks, searchQuery);
    }, [tasks, searchQuery]);

    const createTask = useCallback(
        async (input: CreateTaskInput): Promise<Task | null> => {
            if (!isAuthenticated) {
                setError('Please login to add tasks');
                return null;
            }

            setIsCreating(true);
            setError(null);

            try {
                const task = await taskService.createTask(input);
                return task;
            } catch (err: any) {
                setError(err.message || 'Failed to create task');
                return null;
            } finally {
                setIsCreating(false);
            }
        },
        [isAuthenticated]
    );

    const updateTask = useCallback(
        async (id: string, input: UpdateTaskInput): Promise<Task | null> => {
            if (!isAuthenticated) {
                setError('Please login to update tasks');
                return null;
            }

            setIsUpdating(true);
            setError(null);

            try {
                const task = await taskService.updateTask(id, input);
                return task;
            } catch (err: any) {
                setError(err.message || 'Failed to update task');
                return null;
            } finally {
                setIsUpdating(false);
            }
        },
        [isAuthenticated]
    );

    const deleteTask = useCallback(
        async (id: string): Promise<boolean> => {
            if (!isAuthenticated) {
                setError('Please login to delete tasks');
                return false;
            }

            setIsDeleting(true);
            setError(null);

            try {
                await taskService.deleteTask(id);
                return true;
            } catch (err: any) {
                setError(err.message || 'Failed to delete task');
                return false;
            } finally {
                setIsDeleting(false);
            }
        },
        [isAuthenticated]
    );

    const toggleTaskCompletion = useCallback(
        async (id: string): Promise<boolean> => {
            if (!isAuthenticated) {
                setError('Please login to update tasks');
                return false;
            }

            try {
                await taskService.toggleTaskCompletion(id);
                return true;
            } catch (err: any) {
                setError(err.message || 'Failed to toggle task');
                return false;
            }
        },
        [isAuthenticated]
    );

    const refreshTasks = useCallback(async () => {
        // Tasks are already real-time, but this can force a re-render
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    return {
        tasks,
        filteredTasks,
        stats,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        refreshTasks,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        searchResults,
        isAuthenticated,
    };
}

export default useTasks;