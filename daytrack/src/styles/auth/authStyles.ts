import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

const { width, height } = Dimensions.get('window');

export const authScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FEFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    backIcon: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        marginTop: 80,
        marginBottom: 24,
    },
    mainText: {
        ...typography.heading1,
        // Adjust to match current design weight
        fontWeight: '600',
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        lineHeight: 56,
    },
    subtitleText: {
        fontSize: 16,
        fontWeight: '300',
        fontFamily: 'YaldeviColombo-Light',
        color: 'rgba(129, 129, 129, 0.70)',
        marginTop: 8,
    },
    formContainer: {
        gap: 16,
        marginTop: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(129, 129, 129, 0.20)',
        shadowColor: Colors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    inputContainerFocused: {
        borderColor: Colors.primaryBlack,
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    inputContainerError: {
        borderColor: Colors.negativeColor,
    },
    inputWrapper: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.primaryBlack,
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingLeft: 12,
        paddingVertical: 0,
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.negativeColor,
        marginTop: 8,
        marginLeft: 4,
    },
    successText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Light',
        color: '#34C759',
        marginTop: 8,
        marginLeft: 4,
    },
    forgetPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: 16,
    },
    forgetPasswordText: {
        ...typography.actionText,
        color: Colors.primaryBlack,
    },
    primaryButton: {
        backgroundColor: Colors.primaryBlack,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 64,
        shadowColor: Colors.primaryBlack,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    primaryButtonText: {
        ...typography.statsAmount, // 18 / 600 / semiBold
        color: '#FFFFFF',
        textAlign: 'center',
    },
    continueWithText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Light',
        color: 'rgba(129, 129, 129, 0.70)',
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 16,
    },
    googleButtonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(129, 129, 129, 0.20)',
        gap: 12,
        shadowColor: Colors.primaryBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    googleIcon: {
        width: 24,
        height: 24,
    },
    googleButtonText: {
        ...typography.bodyMedium, // 16 / 600 / semiBold
        color: Colors.primaryBlack,
        textAlign: 'center',
    },
    newAccountTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    accountText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Light',
        color: 'rgba(129, 129, 129, 0.70)',
    },
    linkText: {
        ...typography.actionText,
        color: Colors.primaryBlack,
    },
    decorativeBlur: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        opacity: 0.3,
    },
    decorativeBlur1: {
        top: -50,
        right: -50,
        backgroundColor: 'rgba(225, 239, 210, 0.5)',
    },
    decorativeBlur2: {
        bottom: 100,
        left: -70,
        backgroundColor: 'rgba(221, 231, 255, 0.5)',
    },
});