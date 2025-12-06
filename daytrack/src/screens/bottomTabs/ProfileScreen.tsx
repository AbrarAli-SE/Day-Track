import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import Colors from '../../constants/colors';
import { StyleSheet } from 'react-native';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const [user, setUser] = useState<any>(null);
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const currentUser = auth().currentUser;
        setUser(currentUser);
        setDisplayName(currentUser?.displayName || '');
    }, []);

    const handleUpdateProfile = async () => {
        if (!displayName.trim()) {
            Alert.alert('Error', 'Please enter a display name');
            return;
        }

        setIsLoading(true);
        try {
            await auth().currentUser?.updateProfile({
                displayName: displayName.trim(),
            });
            Alert.alert('Success', 'Profile updated successfully!');
            setIsEditing(false);
            setUser(auth().currentUser);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePhoto = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 500,
                maxHeight: 500,
            });

            if (result.assets && result.assets[0]?.uri) {
                Alert.alert(
                    'Coming Soon',
                    'Photo upload feature requires Firebase Storage setup.'
                );
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };

    const handleChangePassword = () => {
        
        Alert.alert(
            'Reset Password',
            'We will send a password reset email to your registered email address.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send Email',
                    onPress: async () => {
                        try {
                            if (user?.email) {
                                await auth().sendPasswordResetEmail(user.email);
                                Alert.alert('Success', 'Password reset email sent!');
                            }
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await auth().currentUser?.delete();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'LoginScreen' }],
                            });
                        } catch (error: any) {
                            if (error.code === 'auth/requires-recent-login') {
                                Alert.alert(
                                    'Re-authentication Required',
                                    'Please logout and login again to delete your account.'
                                );
                            } else {
                                Alert.alert('Error', error.message);
                            }
                        }
                    },
                },
            ]
        );
    };

    const getUserPhoto = () => {
        if (user?.photoURL) {
            return { uri: user.photoURL };
        }
        return require('../../../assets/pic.png');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.primaryBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Photo Section */}
                <View style={styles.photoSection}>
                    <TouchableOpacity
                        style={styles.photoContainer}
                        onPress={handleChangePhoto}
                        activeOpacity={0.8}
                    >
                        <Image source={getUserPhoto()} style={styles.profilePhoto} />
                        <View style={styles.photoEditBadge}>
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.photoHint}>Tap to change photo</Text>
                </View>

                {/* Profile Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Profile Information</Text>
                        <TouchableOpacity
                            onPress={() => setIsEditing(!isEditing)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={isEditing ? 'close' : 'create-outline'}
                                size={22}
                                color={Colors.positiveColor}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Display Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Display Name</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.textInput}
                                value={displayName}
                                onChangeText={setDisplayName}
                                placeholder="Enter your name"
                                placeholderTextColor={Colors.secondaryBlack}
                            />
                        ) : (
                            <Text style={styles.inputValue}>
                                {user?.displayName || 'Not set'}
                            </Text>
                        )}
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <Text style={styles.inputValue}>{user?.email || 'Not available'}</Text>
                        <Text style={styles.inputHint}>Email cannot be changed</Text>
                    </View>

                    {/* Account Created */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Member Since</Text>
                        <Text style={styles.inputValue}>
                            {user?.metadata?.creationTime
                                ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : 'Unknown'}
                        </Text>
                    </View>

                    {isEditing && (
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleUpdateProfile}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Security Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Security</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleChangePassword}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#2196F3" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Change Password</Text>
                            <Text style={styles.menuSubtext}>Send password reset email</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.secondaryBlack} />
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={[styles.card, styles.dangerCard]}>
                    <Text style={[styles.cardTitle, { color: Colors.negativeColor }]}>
                        Danger Zone
                    </Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={handleDeleteAccount}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="trash-outline" size={20} color={Colors.negativeColor} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={[styles.menuText, { color: Colors.negativeColor }]}>
                                Delete Account
                            </Text>
                            <Text style={styles.menuSubtext}>
                                Permanently delete your account and data
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.negativeColor} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
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
    headerTitle: {
        fontSize: 18,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },
    scrollContent: {
        padding: 20,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    photoContainer: {
        position: 'relative',
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    photoEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.positiveColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    photoHint: {
        marginTop: 8,
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    dangerCard: {
        borderWidth: 1,
        borderColor: 'rgba(226, 0, 0, 0.15)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginBottom: 6,
    },
    inputValue: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },
    inputHint: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginTop: 4,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.10)',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.primaryBlack,
        backgroundColor: '#F7F8FA',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.positiveColor,
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    saveButtonText: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: '#FFFFFF',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuContent: {
        flex: 1,
    },
    menuText: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },
    menuSubtext: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginTop: 2,
    },
});