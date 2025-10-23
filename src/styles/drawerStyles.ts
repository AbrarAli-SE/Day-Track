// drawerStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

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
        backgroundColor: '#F7FEFF',
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 20,
        // Rounded right corners
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden', // Important: prevents background bleeding
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
        fontWeight: '600',
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#000000',
        marginBottom: 4,
    },

    userEmail: {
        fontSize: 14,
        fontWeight: '300',
        fontFamily: 'YaldeviColombo-Light',
        color: 'rgba(0, 0, 0, 0.60)',
    },

    closeButton: {
        position: 'absolute',
        top: 50, // Moved down from 16 to avoid notch
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

    menuText: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'YaldeviColombo-Medium',
        color: '#000000',
        marginLeft: 16,
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        marginVertical: 12,
        marginHorizontal: 16,
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
});