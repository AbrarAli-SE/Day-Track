// src/services/notificationService.ts

import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';
import { Task } from '../types/task';

class NotificationService {
    constructor() {
        this.configure();
    }

    configure() {
        PushNotification.configure({
            onRegister: function (token) {
                console.log('✅ Notification Token:', token);
            },

            onNotification: function (notification) {
                console.log('📬 Notification:', notification);
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            popInitialNotification: true,
            requestPermissions: Platform.OS === 'ios',
        });

        // Create notification channel for Android
        PushNotification.createChannel(
            {
                channelId: 'task-reminders',
                channelName: 'Task Reminders',
                channelDescription: 'Notifications for task reminders and due dates',
                playSound: true,
                soundName: 'default',
                importance: Importance.HIGH,
                vibrate: true,
            },
            (created) => console.log(`Notification channel created: ${created}`)
        );

        PushNotification.createChannel(
            {
                channelId: 'task-due',
                channelName: 'Task Due Dates',
                channelDescription: 'Notifications for tasks that are due',
                playSound: true,
                soundName: 'default',
                importance: Importance.HIGH,
                vibrate: true,
            },
            (created) => console.log(`Due date channel created: ${created}`)
        );
    }

    async requestPermission(): Promise<boolean> {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 33) {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } catch (err) {
                    console.warn('Notification permission error:', err);
                    return false;
                }
            }
            return true; // Android < 13 doesn't need runtime permission
        }

        // iOS - already requested in configure
        return true;
    }

    // Schedule reminder notification
    scheduleTaskReminder(task: Task) {
        if (!task.reminder) return;

        const notificationId = `reminder_${task.id}`;
        const reminderDate = new Date(task.reminder);

        // Don't schedule if reminder is in the past
        if (reminderDate <= new Date()) {
            console.warn('⚠️ Reminder date is in the past:', reminderDate);
            return;
        }

        PushNotification.localNotificationSchedule({
            channelId: 'task-reminders',
            id: notificationId,
            title: '🔔 Task Reminder',
            message: task.title,
            date: reminderDate,
            allowWhileIdle: true,
            playSound: true,
            soundName: 'default',
            vibrate: true,
            vibration: 300,
            userInfo: {
                taskId: task.id,
                type: 'reminder',
            },
            smallIcon: 'ic_notification',
            largeIcon: 'ic_launcher',
            bigText: task.description || task.title,
            subText: `Category: ${task.category}`,
            priority: 'high',
            importance: 'high',
        });

        console.log(`✅ Scheduled reminder for: ${task.title} at ${reminderDate}`);
    }

    // Schedule due date notification (1 hour before)
    scheduleDueDateNotification(task: Task) {
        const dueDate = new Date(task.dueDate);

        // If task has specific time, use it
        if (task.dueTime) {
            const timeMatch = task.dueTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = parseInt(timeMatch[2]);
                const period = timeMatch[3].toUpperCase();

                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;

                dueDate.setHours(hours, minutes, 0, 0);
            }
        } else {
            // Default to 9 AM if no time specified
            dueDate.setHours(9, 0, 0, 0);
        }

        // Schedule 1 hour before
        const notificationDate = new Date(dueDate.getTime() - 60 * 60 * 1000);

        // Don't schedule if notification time is in the past
        if (notificationDate <= new Date()) {
            console.warn('⚠️ Due date notification time is in the past');
            return;
        }

        const notificationId = `due_${task.id}`;

        PushNotification.localNotificationSchedule({
            channelId: 'task-due',
            id: notificationId,
            title: '⏰ Task Due Soon',
            message: `"${task.title}" is due in 1 hour`,
            date: notificationDate,
            allowWhileIdle: true,
            playSound: true,
            soundName: 'default',
            vibrate: true,
            vibration: 300,
            userInfo: {
                taskId: task.id,
                type: 'due',
            },
            smallIcon: 'ic_notification',
            largeIcon: 'ic_launcher',
            bigText: task.description || `Don't forget: ${task.title}`,
            subText: `Due: ${task.dueTime || 'today'}`,
            priority: 'high',
            importance: 'high',
            color: '#E20000',
        });

        console.log(`✅ Scheduled due date notification for: ${task.title}`);
    }

    // Schedule overdue notification (on due date/time)
    scheduleOverdueNotification(task: Task) {
        const dueDate = new Date(task.dueDate);

        if (task.dueTime) {
            const timeMatch = task.dueTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (timeMatch) {
                let hours = parseInt(timeMatch[1]);
                const minutes = parseInt(timeMatch[2]);
                const period = timeMatch[3].toUpperCase();

                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;

                dueDate.setHours(hours, minutes, 0, 0);
            }
        } else {
            dueDate.setHours(23, 59, 0, 0); // End of day
        }

        if (dueDate <= new Date()) return;

        const notificationId = `overdue_${task.id}`;

        PushNotification.localNotificationSchedule({
            channelId: 'task-due',
            id: notificationId,
            title: '🚨 Task Overdue',
            message: `"${task.title}" is now overdue!`,
            date: dueDate,
            allowWhileIdle: true,
            playSound: true,
            soundName: 'default',
            vibrate: true,
            vibration: 500,
            userInfo: {
                taskId: task.id,
                type: 'overdue',
            },
            smallIcon: 'ic_notification',
            largeIcon: 'ic_launcher',
            priority: 'high',
            importance: 'high',
            color: '#E20000',
        });

        console.log(`✅ Scheduled overdue notification for: ${task.title}`);
    }

    // Schedule all notifications for a task
    scheduleAllNotifications(task: Task) {
        if (task.completed) {
            this.cancelTaskNotifications(task.id);
            return;
        }

        // Schedule reminder if set
        if (task.reminder) {
            this.scheduleTaskReminder(task);
        }

        // Schedule due date notifications
        this.scheduleDueDateNotification(task);
        this.scheduleOverdueNotification(task);
    }

    // Cancel all notifications for a task
    cancelTaskNotifications(taskId: string) {
        PushNotification.cancelLocalNotification(`reminder_${taskId}`);
        PushNotification.cancelLocalNotification(`due_${taskId}`);
        PushNotification.cancelLocalNotification(`overdue_${taskId}`);
        console.log(`🗑️ Cancelled notifications for task: ${taskId}`);
    }

    // Cancel all notifications
    cancelAllNotifications() {
        PushNotification.cancelAllLocalNotifications();
        console.log('🗑️ Cancelled all notifications');
    }

    // Get all scheduled notifications
    getScheduledNotifications(): Promise<any[]> {
        return new Promise((resolve) => {
            PushNotification.getScheduledLocalNotifications((notifications) => {
                resolve(notifications);
            });
        });
    }

    // Send immediate notification (for testing)
    sendImmediateNotification(title: string, message: string) {
        PushNotification.localNotification({
            channelId: 'task-reminders',
            title,
            message,
            playSound: true,
            soundName: 'default',
            importance: 'high',
            priority: 'high',
        });
    }
}

export const notificationService = new NotificationService();
export default notificationService;