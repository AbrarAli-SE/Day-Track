import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TaskCard from '../../components/TaskCard';
import { todoStyles } from '../../styles/todo/todoStyles';
import { useDrawer } from '../../navigation/DrawerContext';

// Sample Data
const TASKS = [
  { id: '1', title: 'Morning Workout', time: '06:00 AM', done: true, category: 'Health', color: '#34C759' },
  { id: '2', title: 'Team Meeting', time: '10:00 AM', done: false, category: 'Work', color: '#0047AB' },
  { id: '3', title: 'Client Presentation', time: '02:00 PM', done: false, category: 'Work', color: '#0047AB' },
  { id: '4', title: 'Buy Groceries', time: '05:00 PM', done: false, category: 'Personal', color: '#FF9800' },
  { id: '5', title: 'Read Book', time: '08:00 PM', done: false, category: 'Personal', color: '#FF9800' },
];

const CATEGORIES = [
  { name: 'All', icon: 'grid-outline', color: '#151623', count: 12 },
  { name: 'Work', icon: 'briefcase-outline', color: '#0047AB', count: 5 },
  { name: 'Personal', icon: 'person-outline', color: '#FF9800', count: 4 },
  { name: 'Health', icon: 'fitness-outline', color: '#34C759', count: 3 },
];

const DATES = [
  { day: 'Mon', date: 18, isToday: false },
  { day: 'Tue', date: 19, isToday: false },
  { day: 'Wed', date: 20, isToday: true },
  { day: 'Thu', date: 21, isToday: false },
  { day: 'Fri', date: 22, isToday: false },
  { day: 'Sat', date: 23, isToday: false },
  { day: 'Sun', date: 24, isToday: false },
];

export default function TodoScreen() {
  const navigation = useNavigation<any>();
  const { openDrawer } = useDrawer();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState(20);
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const completedToday = TASKS.filter(t => t.done).length;
  const totalToday = TASKS.length;
  const progressPercentage = Math.round((completedToday / totalToday) * 100);

  const handleTaskMenu = (taskId: string) => {
    setSelectedTaskId(taskId);
    setTaskMenuVisible(true);
  };

  const closeTaskMenu = () => {
    setTaskMenuVisible(false);
    setSelectedTaskId(null);
  };

  const handleMenuAction = (action: string) => {
    closeTaskMenu();
    navigation.navigate('ComingSoon');
  };

  const navigateToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const navigateToComingSoon = () => {
    navigation.navigate('ComingSoon');
  };

  return (
    <SafeAreaView style={todoStyles.container}>
      {/* Header */}
      <View style={todoStyles.header}>
        <TouchableOpacity onPress={openDrawer} activeOpacity={0.7}>
          <Image
            source={require('../../../assets/pic.png')}
            style={todoStyles.avatar}
          />
        </TouchableOpacity>

        <View style={todoStyles.headerCenter}>
          <Text style={todoStyles.headerDate}>Wednesday, Dec 20</Text>
          <Text style={todoStyles.headerGreeting}>Let's be productive! 🚀</Text>
        </View>

        <TouchableOpacity
          style={todoStyles.notificationButton}
          activeOpacity={0.7}
          onPress={navigateToNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color="#151623" />
          <View style={todoStyles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={todoStyles.scrollContent}
      >
        {/* Daily Progress Card */}
        <View style={todoStyles.progressCard}>
          <View style={todoStyles.progressLeft}>
            <Text style={todoStyles.progressTitle}>Today's Progress</Text>
            <Text style={todoStyles.progressSubtitle}>
              {completedToday} of {totalToday} tasks completed
            </Text>

            <TouchableOpacity
              style={todoStyles.streakContainer}
              activeOpacity={0.7}
              onPress={navigateToComingSoon}
            >
              <Ionicons name="flame" size={16} color="#FF6B35" />
              <Text style={todoStyles.streakText}>7 Day Streak! 🔥</Text>
            </TouchableOpacity>
          </View>

          {/* Circular Progress */}
          <TouchableOpacity
            style={todoStyles.circularProgress}
            activeOpacity={0.7}
            onPress={navigateToComingSoon}
          >
            <View style={[todoStyles.progressCircle, { borderColor: '#34C759' }]}>
              <Text style={todoStyles.progressPercentage}>{progressPercentage}%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Calendar Strip */}
        <View style={todoStyles.calendarSection}>
          <View style={todoStyles.calendarHeader}>
            <Text style={todoStyles.sectionTitle}>This Week</Text>
            <TouchableOpacity
              style={todoStyles.viewAllButton}
              activeOpacity={0.7}
              onPress={navigateToComingSoon}
            >
              <Text style={todoStyles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#0047AB" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={todoStyles.calendarStrip}
          >
            {DATES.map((item) => (
              <TouchableOpacity
                key={item.date}
                style={[
                  todoStyles.dateCard,
                  selectedDate === item.date && todoStyles.dateCardSelected,
                ]}
                onPress={() => setSelectedDate(item.date)}
                activeOpacity={0.7}
              >
                <Text style={[
                  todoStyles.dateDay,
                  selectedDate === item.date && todoStyles.dateDayActive,
                ]}>
                  {item.day}
                </Text>
                <Text style={[
                  todoStyles.dateNumber,
                  selectedDate === item.date && todoStyles.dateNumberActive,
                ]}>
                  {item.date}
                </Text>
                {item.isToday && selectedDate !== item.date && (
                  <View style={todoStyles.todayDot} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Filter */}
        <View style={todoStyles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={todoStyles.categoryStrip}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  todoStyles.categoryPill,
                  selectedCategory === cat.name && {
                    backgroundColor: cat.color,
                    borderColor: cat.color,
                  },
                ]}
                onPress={() => setSelectedCategory(cat.name)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={selectedCategory === cat.name ? '#FFFFFF' : cat.color}
                />
                <Text style={[
                  todoStyles.categoryText,
                  selectedCategory === cat.name && todoStyles.categoryTextActive,
                ]}>
                  {cat.name}
                </Text>
                <View style={[
                  todoStyles.categoryBadge,
                  selectedCategory === cat.name && todoStyles.categoryBadgeActive,
                ]}>
                  <Text style={[
                    todoStyles.categoryCount,
                    selectedCategory === cat.name && todoStyles.categoryCountActive,
                  ]}>
                    {cat.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tasks Timeline */}
        <View style={todoStyles.tasksSection}>
          <View style={todoStyles.tasksSectionHeader}>
            <Text style={todoStyles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity
              style={todoStyles.sortButton}
              activeOpacity={0.7}
              onPress={navigateToComingSoon}
            >
              <Ionicons name="swap-vertical-outline" size={18} color="#151623" />
              <Text style={todoStyles.sortText}>Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Task Cards */}
          <View style={todoStyles.tasksList}>
            {TASKS.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                isLast={index === TASKS.length - 1}
                onMenuPress={handleTaskMenu}
                onTaskPress={navigateToComingSoon}
              />
            ))}
          </View>
        </View>

        {/* Motivational Quote */}
        <TouchableOpacity
          style={todoStyles.quoteCard}
          activeOpacity={0.7}
          onPress={navigateToComingSoon}
        >
          <Ionicons name="bulb-outline" size={24} color="#FF9800" />
          <Text style={todoStyles.quoteText}>
            "The secret of getting ahead is getting started."
          </Text>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB Background Decoration */}
      <View style={todoStyles.fabBackground}>
        <View style={todoStyles.fabBackgroundCircle1} />
        <View style={todoStyles.fabBackgroundCircle2} />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={todoStyles.fab}
        activeOpacity={0.8}
        onPress={navigateToComingSoon}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Task Menu Modal */}
      <Modal
        visible={taskMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeTaskMenu}
      >
        <TouchableOpacity
          style={todoStyles.modalOverlay}
          activeOpacity={1}
          onPress={closeTaskMenu}
        >
          <View style={todoStyles.taskMenuContainer}>
            <View style={todoStyles.taskMenuHandle} />

            <TouchableOpacity
              style={todoStyles.taskMenuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuAction('edit')}
            >
              <View style={[todoStyles.taskMenuIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="create-outline" size={20} color="#2196F3" />
              </View>
              <Text style={todoStyles.taskMenuText}>Edit Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={todoStyles.taskMenuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuAction('share')}
            >
              <View style={[todoStyles.taskMenuIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="share-social-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={todoStyles.taskMenuText}>Share Task</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={todoStyles.taskMenuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuAction('duplicate')}
            >
              <View style={[todoStyles.taskMenuIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="copy-outline" size={20} color="#FF9800" />
              </View>
              <Text style={todoStyles.taskMenuText}>Duplicate</Text>
            </TouchableOpacity>

            <View style={todoStyles.taskMenuDivider} />

            <TouchableOpacity
              style={todoStyles.taskMenuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuAction('delete')}
            >
              <View style={[todoStyles.taskMenuIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="trash-outline" size={20} color="#E20000" />
              </View>
              <Text style={[todoStyles.taskMenuText, { color: '#E20000' }]}>Delete Task</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}