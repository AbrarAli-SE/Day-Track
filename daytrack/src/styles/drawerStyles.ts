// src/styles/drawerStyles.ts

import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/colors';

const { height } = Dimensions.get('window');

export const drawerStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },

    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: Colors.background || '#F7FEFF',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 20,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
    },

    // Header
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 24,
        backgroundColor: 'rgba(225, 239, 210, 0.25)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },

    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#DDE7FF',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },

    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },

    userName: {
        fontSize: 20,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
        marginBottom: 4,
    },

    userEmail: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.60)',
    },

    closeButton: {
        position: 'absolute',
        top: 50,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
    },

    // Menu
    menuContainer: {
        paddingTop: 16,
        paddingHorizontal: 12,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
        backgroundColor: 'transparent',
    },

    menuItemActive: {
        backgroundColor: 'rgba(0, 71, 171, 0.08)',
    },

    menuText: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.primaryBlack || '#000000',
        marginLeft: 16,
    },

    menuBadge: {
        marginLeft: 'auto',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.negativeColor || '#E20000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },

    menuBadgeText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        marginVertical: 12,
        marginHorizontal: 16,
    },

    // Sync Section
    syncSection: {
        marginHorizontal: 20,
        marginTop: 8,
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
    },

    syncHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    syncTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    syncTitle: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    syncStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        marginBottom: 12,
    },

    syncStatItem: {
        alignItems: 'center',
    },

    syncStatValue: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-Bold',
        color: Colors.primaryBlack,
    },

    syncStatLabel: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginTop: 2,
    },

    lastSyncRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    lastSyncLabel: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    lastSyncValue: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    syncButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: Colors.positiveColor,
        paddingVertical: 10,
        borderRadius: 10,
    },

    syncButtonText: {
        fontSize: 13,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },

    syncDisabledText: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        textAlign: 'center',
        lineHeight: 18,
    },

    // Footer
    footer: {
        paddingVertical: 24,
        alignItems: 'center',
    },

    footerText: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Light',
        color: 'rgba(0, 0, 0, 0.40)',
    },

    offlineModeText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginTop: 4,
        textAlign: 'center',
    },
});

export default drawerStyles;