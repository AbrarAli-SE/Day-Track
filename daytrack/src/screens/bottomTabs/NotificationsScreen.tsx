import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { notificationStyles } from '../../styles/todo/notificationStyles';

const NOTIFICATIONS = [
    {
        id: '1',
        type: 'task',
        title: 'Task Reminder',
        message: 'Team Meeting starts in 30 minutes',
        time: '5 min ago',
        icon: 'time-outline',
        color: '#0047AB',
        unread: true,
    },
    {
        id: '2',
        type: 'achievement',
        title: 'Achievement Unlocked! 🎉',
        message: 'You completed 7 days streak',
        time: '1 hour ago',
        icon: 'trophy-outline',
        color: '#FF9800',
        unread: true,
    },
    {
        id: '3',
        type: 'task',
        title: 'Task Completed',
        message: 'Morning Workout marked as done',
        time: '2 hours ago',
        icon: 'checkmark-circle-outline',
        color: '#34C759',
        unread: false,
    },
    {
        id: '4',
        type: 'reminder',
        title: 'Upcoming Deadline',
        message: 'Client Presentation is due tomorrow',
        time: '3 hours ago',
        icon: 'alert-circle-outline',
        color: '#E20000',
        unread: false,
    },
    {
        id: '5',
        type: 'task',
        title: 'New Task Assigned',
        message: 'Review project documentation',
        time: 'Yesterday',
        icon: 'document-text-outline',
        color: '#9C27B0',
        unread: false,
    },
];

export default function NotificationsScreen() {
    const navigation = useNavigation<any>();
    const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

    return (
        <SafeAreaView style={notificationStyles.container}>
            {/* Header */}
            <View style={notificationStyles.header}>
                <TouchableOpacity
                    style={notificationStyles.backButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#151623" />
                </TouchableOpacity>

                <View style={notificationStyles.headerCenter}>
                    <Text style={notificationStyles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <View style={notificationStyles.headerBadge}>
                            <Text style={notificationStyles.headerBadgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={notificationStyles.clearButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('ComingSoon')}
                >
                    <Text style={notificationStyles.clearText}>Clear All</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={notificationStyles.filterTabs}>
                <TouchableOpacity style={notificationStyles.filterTabActive} activeOpacity={0.7}>
                    <Text style={notificationStyles.filterTabTextActive}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={notificationStyles.filterTab} activeOpacity={0.7}>
                    <Text style={notificationStyles.filterTabText}>Unread</Text>
                </TouchableOpacity>
                <TouchableOpacity style={notificationStyles.filterTab} activeOpacity={0.7}>
                    <Text style={notificationStyles.filterTabText}>Tasks</Text>
                </TouchableOpacity>
            </View>

            {/* Notifications List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={notificationStyles.scrollContent}
            >
                {NOTIFICATIONS.map((notification) => (
                    <TouchableOpacity
                        key={notification.id}
                        style={[
                            notificationStyles.notificationCard,
                            notification.unread && notificationStyles.notificationCardUnread,
                        ]}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('ComingSoon')}
                    >
                        {/* Icon */}
                        <View style={[notificationStyles.notificationIcon, { backgroundColor: `${notification.color}15` }]}>
                            <Ionicons name={notification.icon} size={24} color={notification.color} />
                        </View>

                        {/* Content */}
                        <View style={notificationStyles.notificationContent}>
                            <View style={notificationStyles.notificationHeader}>
                                <Text style={notificationStyles.notificationTitle}>
                                    {notification.title}
                                </Text>
                                {notification.unread && (
                                    <View style={notificationStyles.unreadDot} />
                                )}
                            </View>
                            <Text style={notificationStyles.notificationMessage}>
                                {notification.message}
                            </Text>
                            <Text style={notificationStyles.notificationTime}>
                                {notification.time}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Empty State Message */}
                <View style={notificationStyles.emptyMessage}>
                    <Ionicons name="checkmark-done-circle-outline" size={48} color="rgba(0, 0, 0, 0.15)" />
                    <Text style={notificationStyles.emptyText}>You're all caught up! 🎉</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}