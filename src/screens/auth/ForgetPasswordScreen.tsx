import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { authScreenStyles } from '../../styles/auth/authStyles';
import auth from '@react-native-firebase/auth';
import Loader from '../../components/Loader';
import CustomAlert from '../../components/CustomAlert';

type AuthStackParamList = {
    LoginScreen: undefined;
    ForgetPasswordScreen: undefined;
};

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export default function ForgetPasswordScreen() {
    const navigation = useNavigation<NavigationProp<AuthStackParamList, 'ForgetPasswordScreen'>>();
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    // Alert state
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const getBorderColor = (): string => {
        if (!submitted) return 'rgba(129, 129, 129, 0.20)';
        return validateEmail(email) ? 'rgba(129, 129, 129, 0.20)' : '#FF3B30';
    };

    const getInputContainerStyle = () => {
        const hasError = submitted && !validateEmail(email);
        return [
            authScreenStyles.inputContainer,
            { borderColor: getBorderColor() },
            emailFocused && authScreenStyles.inputContainerFocused,
            hasError && authScreenStyles.inputContainerError,
        ];
    };

    const handleBackPress = () => navigation.goBack();

    const handleResetPress = async () => {
        setError('');
        setSubmitted(true);

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            console.log('📧 Sending password reset email to:', email);

            await auth().sendPasswordResetEmail(email);

            console.log('✅ Password reset email sent');
            setLoading(false);

            // Show success alert
            showAlert(
                'success',
                'Email Sent!',
                `A password reset link has been sent to ${email}. Please check your inbox and spam folder.`
            );

        } catch (error: any) {
            setLoading(false);
            console.log('❌ Password Reset Error:', error.code, error.message);

            let errorMessage = '';

            // Firebase hides user-not-found for security, but we can catch other errors
            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/user-not-found') {
                // This shouldn't normally trigger, but just in case
                errorMessage = 'No account found with this email.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many requests. Please try again later.';
            } else {
                errorMessage = error.message || 'Failed to send reset email. Please try again.';
            }

            setError(errorMessage);
            showAlert('error', 'Failed to Send Email', errorMessage);
        }
    };

    const handleAlertClose = () => {
        setAlertVisible(false);

        // If it was a success alert, navigate to login
        if (alertType === 'success') {
            setEmail('');
            setSubmitted(false);
            navigation.navigate('LoginScreen');
        }
    };

    return (
        <SafeAreaView style={authScreenStyles.container}>
            <Loader visible={loading} />
            <CustomAlert
                visible={alertVisible}
                type={alertType}
                title={alertTitle}
                message={alertMessage}
                onClose={handleAlertClose}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={authScreenStyles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Decorative Blurs */}
                    <View style={[authScreenStyles.decorativeBlur, authScreenStyles.decorativeBlur1]} />
                    <View style={[authScreenStyles.decorativeBlur, authScreenStyles.decorativeBlur2]} />

                    {/* Back Button */}
                    <TouchableOpacity
                        style={authScreenStyles.backIcon}
                        onPress={handleBackPress}
                        accessibilityLabel="Go back"
                        disabled={loading}
                    >
                        <Ionicons name="arrow-back-outline" size={24} color="#000000" />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={authScreenStyles.headerContainer}>
                        <Text style={authScreenStyles.mainText}>Forgot</Text>
                        <Text style={authScreenStyles.mainText}>Password?</Text>
                        <Text style={authScreenStyles.subtitleText}>
                            Don't worry, we'll help you reset it
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={authScreenStyles.formContainer}>
                        {/* Email Input */}
                        <View style={getInputContainerStyle()}>
                            <View style={authScreenStyles.iconContainer}>
                                <Ionicons name="mail-outline" size={20} color="#000000" />
                            </View>
                            <TextInput
                                style={authScreenStyles.inputWrapper}
                                placeholder="Enter your registered email"
                                placeholderTextColor="rgba(129, 129, 129, 0.50)"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                                returnKeyType="done"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                editable={!loading}
                            />
                        </View>
                    </View>

                    <Text style={[authScreenStyles.subtitleText, { marginTop: 16, textAlign: 'left' }]}>
                        Enter your registered email address and we'll send you a secure link to reset your password.
                    </Text>

                    {/* Error Message */}
                    {error ? (
                        <Text style={authScreenStyles.errorText}>{error}</Text>
                    ) : null}

                    {/* Reset Button */}
                    <TouchableOpacity
                        style={[authScreenStyles.primaryButton, loading && { opacity: 0.6 }]}
                        onPress={handleResetPress}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        <Text style={authScreenStyles.primaryButtonText}>Send Reset Email</Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={authScreenStyles.newAccountTextContainer}>
                        <Text style={authScreenStyles.accountText}>Remember your password? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} disabled={loading}>
                            <Text style={authScreenStyles.linkText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}