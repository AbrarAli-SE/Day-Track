import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/colors';
import typography from '../constants/typography';

const { width, height } = Dimensions.get('window');

export const searchBarStyles = StyleSheet.create({
    collapsedButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },

    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.background || '#F7FEFF',
    },

    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },

    searchIcon: {
        marginRight: 8,
    },

    searchInput: {
        ...typography.bodyMedium,
        flex: 1,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.primaryBlack || '#000000',
        padding: 0,
        margin: 0,
    },

    clearButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },

    // Results Container
    resultsContainer: {
        flex: 1,
        backgroundColor: Colors.background || '#F7FEFF',
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 120,
    },

    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },

    emptyTitle: {
        ...typography.heading2,
        fontSize: 20,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
        marginBottom: 8,
        textAlign: 'center',
    },

    emptySubtitle: {
        ...typography.bodyMedium,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.60)',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Results List
    resultsList: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },

    resultsCount: {
        ...typography.bodySmall,
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.60)',
        marginBottom: 16,
    },

    defaultResultItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
});