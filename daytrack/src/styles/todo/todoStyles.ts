import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const todoStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FEFF',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F7FEFF',
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    headerCenter: {
        flex: 1,
        marginLeft: 16,
    },

    headerDate: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
        marginBottom: 2,
    },

    headerGreeting: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Light',
        color: '#5E5F60',
    },

    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },

    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E20000',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    // Progress Card
    progressCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },

    progressLeft: {
        flex: 1,
    },

    progressTitle: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
        marginBottom: 4,
    },

    progressSubtitle: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Light',
        color: '#5E5F60',
        marginBottom: 12,
    },

    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },

    streakText: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FF6B35',
    },

    circularProgress: {
        marginLeft: 16,
    },

    progressCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 199, 89, 0.1)',
    },

    progressPercentage: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-Bold',
        color: '#34C759',
    },

    // Calendar Section
    calendarSection: {
        marginTop: 24,
    },

    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
    },

    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    viewAllText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#0047AB',
    },

    calendarStrip: {
        gap: 12,
        paddingVertical: 4,
    },

    dateCard: {
        width: 60,
        height: 70,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    dateCardSelected: {
        borderColor: '#0047AB',
        backgroundColor: '#0047AB',
    },

    dateDay: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: '#5E5F60',
        marginBottom: 4,
    },

    dateDayActive: {
        color: '#FFFFFF',
    },

    dateNumber: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
    },

    dateNumberActive: {
        color: '#FFFFFF',
    },

    todayDot: {
        position: 'absolute',
        bottom: 6,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#0047AB',
    },

    // Category Section
    categorySection: {
        marginTop: 24,
    },

    categoryStrip: {
        gap: 10,
        paddingVertical: 4,
    },

    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },

    categoryText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
    },

    categoryTextActive: {
        color: '#FFFFFF',
    },

    categoryBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },

    categoryBadgeActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },

    categoryCount: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
    },

    categoryCountActive: {
        color: '#FFFFFF',
    },

    // Tasks Section
    tasksSection: {
        marginTop: 28,
    },

    tasksSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },

    sortText: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
    },

    tasksList: {
        marginBottom: 0,
    },

    // Quote Card
    quoteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255, 152, 0, 0.08)',
        borderRadius: 16,
        padding: 16,
        marginTop: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },

    quoteText: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Light',
        color: '#151623',
        fontStyle: 'italic',
        lineHeight: 20,
    },

    // FAB Background
    fabBackground: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    fabBackgroundCircle1: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 71, 171, 0.08)',
        top: 10,
        left: 20,
    },

    fabBackgroundCircle2: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0, 71, 171, 0.12)',
        top: 15,
        left: 25,
    },

    // Floating Action Button
    fab: {
        position: 'absolute',
        bottom: 40,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0047AB',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0047AB',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
        zIndex: 10,
    },

    // Task Menu Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },

    taskMenuContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 12,
        paddingBottom: 32,
        paddingHorizontal: 20,
    },

    taskMenuHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        alignSelf: 'center',
        marginBottom: 24,
    },

    taskMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 16,
    },

    taskMenuIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },

    taskMenuText: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
    },

    taskMenuDivider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        marginVertical: 8,
    },
});