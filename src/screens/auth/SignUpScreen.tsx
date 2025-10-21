import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, CommonActions } from '@react-navigation/native';
import { authScreenStyles } from '../../styles/auth/authStyles';
import auth from '@react-native-firebase/auth';
import { signInWithGoogle } from './GoogleAuth';
import Loader from '../../components/Loader';
import CustomAlert from '../../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';

type AuthStackParamList = {
    LoginScreen: undefined;
    SignUpScreen: undefined;
    MainScreen: undefined;
};

function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export default function SignUpScreen() {
    const navigation = useNavigation<NavigationProp<AuthStackParamList, 'SignUpScreen'>>();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const googleSignInSuccessRef = useRef(false);
    const [userName, setUserName] = useState<string>('');

    const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const getBorderColor = (field: 'name' | 'email' | 'password'): string => {
        if (!submitted) {
            return 'rgba(129, 129, 129, 0.20)';
        }
        if (field === 'name') {
            return name.length > 0 ? 'rgba(129, 129, 129, 0.20)' : '#FF3B30';
        }
        if (field === 'email') {
            return validateEmail(email) ? 'rgba(129, 129, 129, 0.20)' : '#FF3B30';
        }
        if (field === 'password') {
            return password.length >= 8 ? 'rgba(129, 129, 129, 0.20)' : '#FF3B30';
        }
        return 'rgba(129, 129, 129, 0.20)';
    };

    const getInputContainerStyle = (
        field: 'name' | 'email' | 'password',
        isFocused: boolean
    ) => {
        let hasError = false;
        if (submitted) {
            if (field === 'name') hasError = name.length === 0;
            else if (field === 'email') hasError = !validateEmail(email);
            else if (field === 'password') hasError = password.length < 8;
        }
        return [
            authScreenStyles.inputContainer,
            { borderColor: getBorderColor(field) },
            isFocused && authScreenStyles.inputContainerFocused,
            hasError && authScreenStyles.inputContainerError,
        ];
    };

    const handleBackPress = () => navigation.goBack();
    const handleLoginPress = () => navigation.navigate('LoginScreen');

    const handleGoogleSignInPress = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await signInWithGoogle();

            if (result.error) {
                setLoading(false);
                setError(result.error);
                showAlert('error', 'Sign In Failed', result.error);
            } else {
                // Get user info
                const currentUser = auth().currentUser;
                const displayName = currentUser?.displayName || 'User';
                setUserName(displayName);

                console.log('✅ Google Sign-In Successful:', result.user?.email);

                // Mark Google Sign-In as successful
                googleSignInSuccessRef.current = true;

                setLoading(false);

                // Show welcome alert
                showAlert(
                    'success',
                    `Welcome, ${displayName}!`,
                    'Your account has been created successfully with Google.'
                );
            }
        } catch (error) {
            setLoading(false);
            console.log('❌ Google Sign-In Error:', error);
            showAlert('error', 'Sign In Failed', 'An unexpected error occurred. Please try again.');
        }
    };

    const handleSignUpPress = async () => {
        setError('');
        setSubmitted(true);

        // Validation
        if (name.length === 0) {
            setError('Please enter your name.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);

        try {
            console.log('📝 Creating account for:', email);

            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            console.log('✅ Account created, updating profile...');
            await userCredential.user.updateProfile({ displayName: name });

            console.log('✅ Profile updated, logging out user...');
            // Log out the user immediately after signup
            await auth().signOut();

            setLoading(false);

            // Show success alert
            showAlert(
                'success',
                'Registration Successful!',
                'Start exploring your day with DayTrack.'
            );

        } catch (error: any) {
            setLoading(false);
            console.log('❌ Signup Error:', error.code, error.message);

            let errorMessage = '';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please login instead.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please use a stronger password.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.code === 'auth/operation-not-allowed') {
                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
            } else {
                errorMessage = error.message || 'An error occurred. Please try again.';
            }

            setError(errorMessage);
            showAlert('error', 'Registration Failed', errorMessage);
        }
    };

    const handleAlertClose = () => {
        setAlertVisible(false);

        // If Google Sign-In was successful, navigate to main app
        if (googleSignInSuccessRef.current && alertType === 'success') {
            googleSignInSuccessRef.current = false;

            // Navigate to main app
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainScreen' }],
                })
            );
        }
        // If email signup was successful, navigate to login
        else if (alertType === 'success') {
            setEmail('');
            setPassword('');
            setName('');
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
                        <Text style={authScreenStyles.mainText}>Let's get</Text>
                        <Text style={authScreenStyles.mainText}>started</Text>
                        <Text style={authScreenStyles.subtitleText}>
                            Create an account to continue
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={authScreenStyles.formContainer}>
                        {/* Name Input */}
                        <View style={getInputContainerStyle('name', nameFocused)}>
                            <View style={authScreenStyles.iconContainer}>
                                <Ionicons name="person-outline" size={20} color="#000000" />
                            </View>
                            <TextInput
                                style={authScreenStyles.inputWrapper}
                                placeholder="Enter your name"
                                placeholderTextColor="rgba(129, 129, 129, 0.50)"
                                autoCapitalize="words"
                                returnKeyType="next"
                                value={name}
                                onChangeText={setName}
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                                editable={!loading}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={getInputContainerStyle('email', emailFocused)}>
                            <View style={authScreenStyles.iconContainer}>
                                <Ionicons name="mail-outline" size={20} color="#000000" />
                            </View>
                            <TextInput
                                style={authScreenStyles.inputWrapper}
                                placeholder="Enter your email"
                                placeholderTextColor="rgba(129, 129, 129, 0.50)"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoCorrect={false}
                                returnKeyType="next"
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                editable={!loading}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={getInputContainerStyle('password', passwordFocused)}>
                            <View style={authScreenStyles.iconContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#000000" />
                            </View>
                            <TextInput
                                style={authScreenStyles.inputWrapper}
                                placeholder="Enter your password"
                                placeholderTextColor="rgba(129, 129, 129, 0.50)"
                                secureTextEntry={!isPasswordVisible}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="done"
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordVisible((v) => !v)}
                                accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
                                disabled={loading}
                            >
                                <Ionicons
                                    name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#000000"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Error Message */}
                    {error ? (
                        <Text style={authScreenStyles.errorText}>{error}</Text>
                    ) : null}

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[authScreenStyles.primaryButton, loading && { opacity: 0.6 }]}
                        onPress={handleSignUpPress}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        <Text style={authScreenStyles.primaryButtonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <Text style={authScreenStyles.continueWithText}>or continue with</Text>

                    {/* Google Sign In */}
                    <TouchableOpacity
                        style={[authScreenStyles.googleButtonWrapper, loading && { opacity: 0.6 }]}
                        onPress={handleGoogleSignInPress}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        <Image
                            source={require('../../../assets/images/authIcons/googleLogo.png')}
                            style={authScreenStyles.googleIcon}
                        />
                        <Text style={authScreenStyles.googleButtonText}>Google</Text>
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={authScreenStyles.newAccountTextContainer}>
                        <Text style={authScreenStyles.accountText}>Already have an account? </Text>
                        <TouchableOpacity onPress={handleLoginPress} disabled={loading}>
                            <Text style={authScreenStyles.linkText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}