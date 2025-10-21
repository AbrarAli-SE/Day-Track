import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomAlertProps {
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    onClose: () => void;
    buttonText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    type,
    title,
    message,
    onClose,
    buttonText = 'OK'
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return { name: 'checkmark-circle', color: '#34C759' };
            case 'error':
                return { name: 'close-circle', color: '#FF3B30' };
            case 'info':
                return { name: 'information-circle', color: '#007AFF' };
        }
    };

    const icon = getIcon();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Ionicons name={icon.name} size={60} color={icon.color} />

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: icon.color }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '90%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#000000',
        marginTop: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-Light',
        color: 'rgba(0, 0, 0, 0.70)',
        marginTop: 12,
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        marginTop: 24,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        minWidth: 120,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});

export default CustomAlert;