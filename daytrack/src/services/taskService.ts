// src/services/taskService.ts

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
    Task,
    TaskDocument,
    CreateTaskInput,
    UpdateTaskInput,
    TaskStats,
} from '../types/task';
import notificationService from './notificationService';

const COLLECTION_NAME = 'tasks';

// ✅ Enable offline persistence
firestore()
    .settings({
        persistence: true,
        cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    })
    .then(() => {
        console.log('✅ Firestore (Tasks) persistence enabled');
    })
    .catch((error) => {
        console.error('❌ Firestore persistence error:', error);
    });

class TaskService {
    private get collection() {
        return firestore().collection(COLLECTION_NAME);
    }

    private get currentUserId(): string | null {
        return auth().currentUser?.uid || null;
    }

    private documentToTask(doc: FirebaseFirestoreTypes.DocumentSnapshot): Task | null {
        if (!doc.exists) return null;

        const data = doc.data() as TaskDocument;
        return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description,
            category: data.category,
            categoryColor: data.categoryColor,
            categoryIcon: data.categoryIcon,
            priority: data.priority,
            status: data.status,
            dueDate: data.dueDate.toDate(),
            dueTime: data.dueTime,
            completed: data.completed,
            completedAt: data.completedAt?.toDate(),
            recurrence: data.recurrence,
            subtasks: data.subtasks || [],
            reminder: data.reminder?.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
    }

    async createTask(input: CreateTaskInput): Promise<Task> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const now = firestore.Timestamp.now();
        const status = this.calculateStatus(input.dueDate, false);

        const docData: any = {
            userId,
            title: input.title.trim(),
            category: input.category,
            categoryColor: input.categoryColor,
            categoryIcon: input.categoryIcon,
            priority: input.priority,
            status,
            dueDate: firestore.Timestamp.fromDate(input.dueDate),
            completed: false,
            recurrence: input.recurrence,
            subtasks: input.subtasks || [],
            createdAt: now,
            updatedAt: now,
        };

        if (input.description) docData.description = input.description.trim();
        if (input.dueTime) docData.dueTime = input.dueTime;
        if (input.reminder) docData.reminder = firestore.Timestamp.fromDate(input.reminder);

        const docRef = await this.collection.add(docData);
        console.log('✅ Task created:', docRef.id);

        const task: Task = {
            id: docRef.id,
            userId,
            title: input.title.trim(),
            description: input.description,
            category: input.category,
            categoryColor: input.categoryColor,
            categoryIcon: input.categoryIcon,
            priority: input.priority,
            status,
            dueDate: input.dueDate,
            dueTime: input.dueTime,
            completed: false,
            recurrence: input.recurrence,
            subtasks: input.subtasks || [],
            reminder: input.reminder,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // ✅ Schedule notifications for the new task
        notificationService.scheduleAllNotifications(task);

        return task;
    }

    async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const docRef = this.collection.doc(taskId);
        const doc = await docRef.get();

        if (!doc.exists) throw new Error('Task not found');

        const existingData = doc.data() as TaskDocument;
        if (existingData.userId !== userId) {
            throw new Error('Unauthorized to update this task');
        }

        const updateData: any = { updatedAt: firestore.Timestamp.now() };

        if (input.title !== undefined) updateData.title = input.title.trim();
        if (input.description !== undefined) {
            if (input.description && input.description.trim() !== '') {
                updateData.description = input.description.trim();
            } else {
                updateData.description = firestore.FieldValue.delete();
            }
        }
        if (input.category !== undefined) updateData.category = input.category;
        if (input.categoryColor !== undefined) updateData.categoryColor = input.categoryColor;
        if (input.categoryIcon !== undefined) updateData.categoryIcon = input.categoryIcon;
        if (input.priority !== undefined) updateData.priority = input.priority;
        if (input.dueDate !== undefined) updateData.dueDate = firestore.Timestamp.fromDate(input.dueDate);
        if (input.dueTime !== undefined) updateData.dueTime = input.dueTime;
        if (input.recurrence !== undefined) updateData.recurrence = input.recurrence;
        if (input.subtasks !== undefined) updateData.subtasks = input.subtasks;
        if (input.reminder !== undefined) {
            updateData.reminder = input.reminder ? firestore.Timestamp.fromDate(input.reminder) : firestore.FieldValue.delete();
        }

        if (input.completed !== undefined) {
            updateData.completed = input.completed;
            if (input.completed) {
                updateData.completedAt = firestore.Timestamp.now();
                updateData.status = 'completed';
            } else {
                updateData.completedAt = firestore.FieldValue.delete();
                const dueDate = input.dueDate || existingData.dueDate.toDate();
                updateData.status = this.calculateStatus(dueDate, false);
            }
        }

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();
        const task = this.documentToTask(updatedDoc);
        if (!task) throw new Error('Failed to update task');

        // ✅ Reschedule notifications for updated task
        notificationService.cancelTaskNotifications(taskId);
        notificationService.scheduleAllNotifications(task);

        console.log('✅ Task updated:', task.id);
        return task;
    }

    async deleteTask(taskId: string): Promise<void> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const docRef = this.collection.doc(taskId);
        const doc = await docRef.get();

        if (!doc.exists) throw new Error('Task not found');

        const data = doc.data() as TaskDocument;
        if (data.userId !== userId) {
            throw new Error('Unauthorized to delete this task');
        }

        await docRef.delete();
        
        // ✅ Cancel notifications for deleted task
        notificationService.cancelTaskNotifications(taskId);
        console.log('✅ Task deleted:', taskId);
    }

    async toggleTaskCompletion(taskId: string): Promise<Task> {
        const userId = this.currentUserId;
        if (!userId) throw new Error('User not authenticated');

        const docRef = this.collection.doc(taskId);
        const doc = await docRef.get();

        if (!doc.exists) throw new Error('Task not found');

        const data = doc.data() as TaskDocument;
        if (data.userId !== userId) {
            throw new Error('Unauthorized to update this task');
        }

        const newCompleted = !data.completed;
        const updateData: any = {
            completed: newCompleted,
            updatedAt: firestore.Timestamp.now(),
        };

        if (newCompleted) {
            updateData.completedAt = firestore.Timestamp.now();
            updateData.status = 'completed';
        } else {
            updateData.completedAt = firestore.FieldValue.delete();
            updateData.status = this.calculateStatus(data.dueDate.toDate(), false);
        }

        await docRef.update(updateData);
        const updatedDoc = await docRef.get();
        const task = this.documentToTask(updatedDoc);
        if (!task) throw new Error('Failed to toggle task');

        // ✅ Cancel/reschedule notifications based on completion
        if (task.completed) {
            notificationService.cancelTaskNotifications(taskId);
        } else {
            notificationService.scheduleAllNotifications(task);
        }

        console.log('✅ Task toggled:', task.id, 'Completed:', task.completed);
        return task;
    }

    subscribeToTasks(
        callback: (tasks: Task[]) => void,
        onError?: (error: Error) => void
    ): () => void {
        const userId = this.currentUserId;
        if (!userId) {
            onError?.(new Error('User not authenticated'));
            return () => { };
        }

        const unsubscribe = this.collection
            .where('userId', '==', userId)
            .orderBy('dueDate', 'asc')
            .onSnapshot(
                {
                    includeMetadataChanges: true,
                },
                (snapshot) => {
                    const tasks = snapshot.docs
                        .map((doc) => this.documentToTask(doc))
                        .filter((t): t is Task => t !== null);

                    // Update status for all tasks
                    tasks.forEach((task) => {
                        if (!task.completed && task.status !== 'overdue') {
                            const newStatus = this.calculateStatus(task.dueDate, task.completed);
                            if (newStatus !== task.status) {
                                this.collection.doc(task.id).update({ status: newStatus });
                            }
                        }
                    });

                    const source = snapshot.metadata.fromCache ? '💾 Cache' : '📥 Server';
                    console.log(`${source}: Loaded ${tasks.length} tasks`);

                    callback(tasks);
                },
                (error) => {
                    console.error('❌ Task subscription error:', error);
                    onError?.(error);
                }
            );

        return unsubscribe;
    }

    calculateStats(tasks: Task[]): TaskStats {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.completed).length;
        const pendingTasks = tasks.filter((t) => !t.completed && t.status === 'pending').length;
        const overdueTasks = tasks.filter((t) => t.status === 'overdue').length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        const todayTasks = tasks.filter(
            (t) => t.dueDate >= todayStart && t.dueDate < todayEnd
        );
        const todayCompleted = todayTasks.filter((t) => t.completed).length;

        // Calculate week streak
        const weekStreak = this.calculateWeekStreak(tasks);

        return {
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            completionRate,
            todayTasks: todayTasks.length,
            todayCompleted,
            weekStreak,
        };
    }

    private calculateWeekStreak(tasks: Task[]): number {
        const completedTasks = tasks
            .filter((t) => t.completed && t.completedAt)
            .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());

        if (completedTasks.length === 0) return 0;

        let streak = 0;
        const now = new Date();
        let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(checkDate);
            const dayEnd = new Date(checkDate);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const hasCompletedTask = completedTasks.some(
                (t) => t.completedAt! >= dayStart && t.completedAt! < dayEnd
            );

            if (hasCompletedTask) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    private calculateStatus(dueDate: Date, completed: boolean): 'pending' | 'completed' | 'overdue' {
        if (completed) return 'completed';

        const now = new Date();
        const dueDateEnd = new Date(dueDate);
        dueDateEnd.setHours(23, 59, 59, 999);

        if (now > dueDateEnd) return 'overdue';
        return 'pending';
    }

    searchTasks(tasks: Task[], query: string): Task[] {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase().trim();
        return tasks.filter(
            (t) =>
                t.title.toLowerCase().includes(lowerQuery) ||
                t.description?.toLowerCase().includes(lowerQuery) ||
                t.category.toLowerCase().includes(lowerQuery)
        );
    }
}

export const taskService = new TaskService();
export default taskService;