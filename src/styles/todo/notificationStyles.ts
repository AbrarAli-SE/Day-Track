import { StyleSheet } from 'react-native';

export const notificationStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FEFF',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F7FEFF',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    headerTitle: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
    },

    headerBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E20000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },

    headerBadgeText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },

    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    clearText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#0047AB',
    },

    filterTabs: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },

    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },

    filterTabActive: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#151623',
    },

    filterTabText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#5E5F60',
    },

    filterTabTextActive: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },

    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: 3,
        borderLeftColor: 'transparent',
    },

    notificationCardUnread: {
        borderLeftColor: '#0047AB',
        backgroundColor: 'rgba(0, 71, 171, 0.02)',
    },

    notificationIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    notificationContent: {
        flex: 1,
    },

    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    notificationTitle: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#151623',
        flex: 1,
    },

    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0047AB',
        marginLeft: 8,
    },

    notificationMessage: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-Light',
        color: '#5E5F60',
        marginBottom: 6,
        lineHeight: 20,
    },

    notificationTime: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: '#5E5F60',
    },

    emptyMessage: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
    },

    emptyText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Light',
        color: '#5E5F60',
    },
});