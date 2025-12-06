import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import TaskCard from '../../components/TaskCard';
import { AddTaskModal } from '../../components/AddTaskModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { todoStyles } from '../../styles/todo/todoStyles';
import { useDrawer } from '../../navigation/DrawerContext';
import { useTasks } from '../../hooks/useTasks';
import { Task, CreateTaskInput, UpdateTaskInput, DEFAULT_TASK_CATEGORIES } from '../../types/task';
import notificationService from '../../services/notificationService';
import Colors from '../../constants/colors';

const generateExtendedDates = (centerDate: Date = new Date()) => {
  const dates = [];

  for (let i = -45; i <= 45; i++) {
    const date = new Date(centerDate);
    date.setDate(centerDate.getDate() + i);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);

    dates.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      fullDate: date,
      isToday: dateStart.getTime() === today.getTime(),
    });
  }

  return dates;
};

export default function TodoScreen() {
  const navigation = useNavigation<any>();
  const { openDrawer } = useDrawer();

  const [user, setUser] = useState<any>(null);

  const {
    tasks,
    filteredTasks,
    stats,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks,
    filter,
    setFilter,
    isAuthenticated,
  } = useTasks();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allDates, setAllDates] = useState(generateExtendedDates());
  const [taskMenuVisible, setTaskMenuVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    notificationService.requestPermission();
  }, []);

  useEffect(() => {
    setFilter({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
    });
  }, [selectedCategory]);

  const getTasksForDate = (date: Date) => {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    return filteredTasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= dateStart && taskDate <= dateEnd;
    });
  };

  const getTaskCountForDate = (date: Date) => {
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    const dateEnd = new Date(date);
    dateEnd.setHours(23, 59, 59, 999);

    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= dateStart && taskDate <= dateEnd;
    }).length;
  };

  const todayTasks = getTasksForDate(selectedDate);
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const categoriesWithCounts = [
    { name: 'All', icon: 'grid-outline', color: '#151623', count: filteredTasks.length },
    ...DEFAULT_TASK_CATEGORIES.map((cat) => ({
      ...cat,
      count: filteredTasks.filter((t) => t.category === cat.name).length,
    })),
  ];

  useEffect(() => {
    const todayIndex = allDates.findIndex((d) => d.isToday);
    if (todayIndex !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: todayIndex * 70 - 100,
          animated: true,
        });
      }, 100);
    }
  }, []);

  const getUserName = () => {
    if (!user) return 'Guest User';
    return user.displayName || user.email?.split('@')[0] || 'User';
  };

  const getUserPhoto = () => {
    if (user && user.photoURL) {
      return { uri: user.photoURL };
    }
    return require('../../../assets/pic.png');
  };

  const handleAddTask = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to add tasks.');
      navigation.navigate('LoginScreen');
      return;
    }
    setEditingTask(null);
    setAddModalVisible(true);
  };

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

    if (!selectedTaskId) return;

    switch (action) {
      case 'edit':
        handleEditTask(selectedTaskId);
        break;
      case 'delete':
        handleDeleteTask(selectedTaskId);
        break;
      case 'duplicate':
        handleDuplicateTask(selectedTaskId);
        break;
      case 'share':
        Alert.alert('Coming Soon', 'Share task feature is coming soon!');
        break;
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setAddModalVisible(true);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedTaskId) {
      const success = await deleteTask(selectedTaskId);
      if (success) {
        Alert.alert('Success', 'Task deleted successfully');
      }
    }
    setDeleteConfirmVisible(false);
    setSelectedTaskId(null);
  };

  const handleDuplicateTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const duplicateData: CreateTaskInput = {
      title: `${task.title} (Copy)`,
      description: task.description,
      category: task.category,
      categoryColor: task.categoryColor,
      categoryIcon: task.categoryIcon,
      priority: task.priority,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      recurrence: task.recurrence,
      reminder: task.reminder,
    };

    const newTask = await createTask(duplicateData);
    if (newTask) {
      Alert.alert('Success', 'Task duplicated successfully');
    }
  };

  const handleSaveTask = async (input: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      await updateTask(editingTask.id, input);
    } else {
      await createTask(input as CreateTaskInput);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    await toggleTaskCompletion(taskId);
  };

  const handleTaskPress = (taskId: string) => {
    handleToggleComplete(taskId);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const navigateToNotifications = () => {
    navigation.navigate('Notifications');
  };

  const formatCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  // ✅ Jump to today
  const jumpToToday = () => {
    const today = new Date();
    setSelectedDate(today);

    const todayIndex = allDates.findIndex((d) => d.isToday);
    if (todayIndex !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: todayIndex * 70 - 100,
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={todoStyles.container}>
      <View style={todoStyles.header}>
        <TouchableOpacity onPress={openDrawer} activeOpacity={0.7}>
          <Image source={getUserPhoto()} style={todoStyles.avatar} />
        </TouchableOpacity>

        <View style={todoStyles.headerCenter}>
          <Text style={todoStyles.headerDate}>{formatCurrentDate()}</Text>
          <Text style={todoStyles.headerGreeting}>
            {user ? `Let's be productive, ${getUserName()}! 🚀` : "Let's be productive! 🚀"}
          </Text>
        </View>

        <TouchableOpacity
          style={todoStyles.notificationButton}
          activeOpacity={0.7}
          onPress={navigateToNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color="#151623" />
          {stats.todayTasks > 0 && <View style={todoStyles.notificationDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={todoStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTasks}
            tintColor="#000000"
          />
        }
      >
        <View style={todoStyles.progressCard}>
          <View style={todoStyles.progressLeft}>
            <Text style={todoStyles.progressTitle}>Today's Progress</Text>
            <Text style={todoStyles.progressSubtitle}>
              {completedToday} of {totalToday} tasks completed
            </Text>

            <TouchableOpacity
              style={todoStyles.streakContainer}
              activeOpacity={0.7}
            >
              <Ionicons name="flame" size={16} color="#FF6B35" />
              <Text style={todoStyles.streakText}>
                {stats.weekStreak} Day Streak! 🔥
              </Text>
            </TouchableOpacity>
          </View>

          <View style={todoStyles.circularProgress}>
            <View
              style={[
                todoStyles.progressCircle,
                { borderColor: progressPercentage === 100 ? '#34C759' : '#0047AB' },
              ]}
            >
              <Text style={todoStyles.progressPercentage}>{progressPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* ✅ Calendar with Jump to Today button */}
        <View style={todoStyles.calendarSection}>
          <View style={todoStyles.calendarHeader}>
            <Text style={todoStyles.sectionTitle}>Select Date</Text>
            <TouchableOpacity
              style={todoStyles.todayButton}
              onPress={jumpToToday}
              activeOpacity={0.7}
            >
              <Ionicons name="today" size={16} color="#0047AB" />
              <Text style={todoStyles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={todoStyles.calendarStrip}
          >
            {allDates.map((item, index) => {
              const isSelected =
                item.fullDate.toDateString() === selectedDate.toDateString();
              const taskCount = getTaskCountForDate(item.fullDate);
              const hasMonthLabel = index === 0 || item.date === 1;

              return (
                <View key={index}>
                  {hasMonthLabel && (
                    <Text style={todoStyles.monthLabel}>
                      {item.fullDate.toLocaleDateString('en-US', { month: 'long' })}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={[
                      todoStyles.dateCard,
                      isSelected && todoStyles.dateCardSelected,
                    ]}
                    onPress={() => handleDateSelect(item.fullDate)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        todoStyles.dateDay,
                        isSelected && todoStyles.dateDayActive,
                      ]}
                    >
                      {item.day}
                    </Text>
                    <Text
                      style={[
                        todoStyles.dateNumber,
                        isSelected && todoStyles.dateNumberActive,
                      ]}
                    >
                      {item.date}
                    </Text>
                    {item.isToday && !isSelected && (
                      <View style={todoStyles.todayDot} />
                    )}
                    {/* ✅ Task count indicator */}
                    {taskCount > 0 && !isSelected && (
                      <View style={todoStyles.taskCountBadge}>
                        <Text style={todoStyles.taskCountText}>{taskCount}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        <View style={todoStyles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={todoStyles.categoryStrip}
          >
            {categoriesWithCounts.map((cat) => (
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
                  name={cat.icon as any}
                  size={18}
                  color={selectedCategory === cat.name ? '#FFFFFF' : cat.color}
                />
                <Text
                  style={[
                    todoStyles.categoryText,
                    selectedCategory === cat.name && todoStyles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
                <View
                  style={[
                    todoStyles.categoryBadge,
                    selectedCategory === cat.name && todoStyles.categoryBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      todoStyles.categoryCount,
                      selectedCategory === cat.name && todoStyles.categoryCountActive,
                    ]}
                  >
                    {cat.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={todoStyles.tasksSection}>
          <View style={todoStyles.tasksSectionHeader}>
            <Text style={todoStyles.sectionTitle}>
              {selectedDate.toDateString() === new Date().toDateString()
                ? "Today's Tasks"
                : formatCurrentDate()}
            </Text>
            {todayTasks.length > 0 && (
              <Text style={todoStyles.tasksCount}>
                {completedToday}/{totalToday}
              </Text>
            )}
          </View>

          <View style={todoStyles.tasksList}>
            {todayTasks.length === 0 ? (
              <View style={todoStyles.emptyState}>
                <View style={todoStyles.emptyIconContainer}>
                  <Ionicons
                    name="checkmark-done-circle-outline"
                    size={64}
                    color="rgba(0, 0, 0, 0.15)"
                  />
                </View>
                <Text style={todoStyles.emptyTitle}>No Tasks</Text>
                <Text style={todoStyles.emptySubtitle}>
                  {selectedDate.toDateString() === new Date().toDateString()
                    ? 'Add a task to get started!'
                    : 'No tasks scheduled for this date'}
                </Text>
              </View>
            ) : (
              todayTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isLast={index === todayTasks.length - 1}
                  onMenuPress={handleTaskMenu}
                  onTaskPress={handleTaskPress}
                  onToggleComplete={handleToggleComplete}
                />
              ))
            )}
          </View>
        </View>

        {todayTasks.length > 0 && (
          <View style={todoStyles.quoteCard}>
            <Ionicons name="bulb-outline" size={24} color="#FF9800" />
            <Text style={todoStyles.quoteText}>
              {completedToday === totalToday && totalToday > 0
                ? '🎉 Amazing! You completed all tasks today!'
                : completedToday > 0
                  ? "Great progress! Keep it up! 💪"
                  : "The secret of getting ahead is getting started. ✨"}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={todoStyles.fabBackground}>
        <View style={todoStyles.fabBackgroundCircle1} />
        <View style={todoStyles.fabBackgroundCircle2} />
      </View>

      <TouchableOpacity
        style={todoStyles.fab}
        activeOpacity={0.8}
        onPress={handleAddTask}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

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
              onPress={() => handleMenuAction('duplicate')}
            >
              <View style={[todoStyles.taskMenuIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="copy-outline" size={20} color="#FF9800" />
              </View>
              <Text style={todoStyles.taskMenuText}>Duplicate</Text>
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

            <View style={todoStyles.taskMenuDivider} />

            <TouchableOpacity
              style={todoStyles.taskMenuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuAction('delete')}
            >
              <View style={[todoStyles.taskMenuIcon, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="trash-outline" size={20} color="#E20000" />
              </View>
              <Text style={[todoStyles.taskMenuText, { color: '#E20000' }]}>
                Delete Task
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <AddTaskModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        isLoading={isCreating || isUpdating}
        editTask={editingTask}
      />

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor={Colors.negativeColor}
        icon="trash-outline"
        iconColor={Colors.negativeColor}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirmVisible(false);
          setSelectedTaskId(null);
        }}
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
}