import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import typography from '../constants/typography';

export default function ComingSoonScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={comingSoonStyles.safeArea}>
            {/* Back Button */}
            <TouchableOpacity
                style={comingSoonStyles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>

            {/* Content */}
            <View style={comingSoonStyles.contentContainer}>
                <View style={comingSoonStyles.iconContainer}>
                    <Ionicons name="construct-outline" size={80} color="#000000" />
                </View>
                <Text style={comingSoonStyles.mainText}>Coming Soon</Text>
                <Text style={comingSoonStyles.subText}>
                    This feature is under development and will be available soon!
                </Text>
            </View>
        </SafeAreaView>
    );
}

export const comingSoonStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background || '#F7FEFF',
    },

    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primaryBlack || '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },

    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },

    mainText: {
        ...typography.heading1,
        fontSize: 32,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack || '#000000',
        marginBottom: 16,
        textAlign: 'center',
    },

    subText: {
        ...typography.bodyMedium,
        fontSize: 16,
        fontFamily: 'YaldeviColombo-Light',
        color: Colors.secondaryBlack || 'rgba(0, 0, 0, 0.60)',
        textAlign: 'center',
        lineHeight: 24,
    },
});