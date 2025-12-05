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
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../../components/Loader';
import CustomAlert from '../../components/CustomAlert';

type AuthStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ForgetPasswordScreen: undefined;
  MainScreen: undefined;
};

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList, 'LoginScreen'>>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Track login success to prevent auth listener conflict
  const loginSuccessRef = useRef(false);
  const [userName, setUserName] = useState<string>('');

  const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const getBorderColor = (field: 'email' | 'password'): string => {
    if (!submitted) {
      return 'rgba(129, 129, 129, 0.20)';
    }
    if (field === 'email') {
      return validateEmail(email) ? 'rgba(129, 129, 129, 0.20)' : '#FF3B30';
    }
    if (field === 'password') {
      return password.length >= 8 ? 'rgba(129, 129, 129, 0.20)' : '#FF3B30';
    }
    return 'rgba(129, 129, 129, 0.20)';
  };

  const getInputContainerStyle = (field: 'email' | 'password', isFocused: boolean) => {
    const hasError = submitted && (
      field === 'email' ? !validateEmail(email) : password.length < 8
    );
    return [
      authScreenStyles.inputContainer,
      { borderColor: getBorderColor(field) },
      isFocused && authScreenStyles.inputContainerFocused,
      hasError && authScreenStyles.inputContainerError,
    ];
  };

  const handleBackPress = () => navigation.goBack();
  const handleSignUpPress = () => navigation.navigate('SignUpScreen');
  const handleForgotPasswordPress = () => navigation.navigate('ForgetPasswordScreen');

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
        // Get user name
        const currentUser = auth().currentUser;
        const displayName = currentUser?.displayName || 'User';
        setUserName(displayName);

        console.log('✅ Google Sign-In Successful:', result.user?.email);

        // Mark login as successful to prevent auth listener navigation
        loginSuccessRef.current = true;

        setLoading(false);

        // Show welcome alert
        showAlert(
          'success',
          `Welcome Back, ${displayName}!`,
          'Keep exploring your day with DayTrack.'
        );
      }
    } catch (error) {
      setLoading(false);
      console.log('❌ Google Sign-In Error:', error);
      showAlert('error', 'Sign In Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleLoginPress = async () => {
    setError('');
    setSubmitted(true);

    if (email.length === 0 || password.length === 0) {
      setError('Please fill in all fields.');
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
      console.log('🔐 Attempting login for:', email);

      const userCredential = await auth().signInWithEmailAndPassword(email, password);

      // Get user name
      const displayName = userCredential.user?.displayName || 'User';
      setUserName(displayName);

      console.log('✅ Login Successful');

      // Mark login as successful
      loginSuccessRef.current = true;

      setLoading(false);

      // Clear form
      const loginEmail = email; // Store for display
      setEmail('');
      setPassword('');
      setSubmitted(false);

      // Show welcome alert
      showAlert(
        'success',
        `Welcome Back, ${displayName}! 🎉`,
        `You have successfully logged in as ${loginEmail}`
      );

    } catch (error: any) {
      setLoading(false);
      console.log('❌ Login Error:', error.code, error.message);

      let errorMessage = '';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-credentials'
      ) {
        errorMessage = 'Invalid email or password. Please check and try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else {
        errorMessage = error.message || 'Login failed. Please try again.';
      }

      setError(errorMessage);
      showAlert('error', 'Login Failed', errorMessage);
    }
  };


  const handleAlertClose = () => {
    setAlertVisible(false);

    if (alertType === 'success' && loginSuccessRef.current) {
      loginSuccessRef.current = false;

      navigation.goBack();
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
            accessible
            disabled={loading}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000000" />
          </TouchableOpacity>

          {/* Header */}
          <View style={authScreenStyles.headerContainer}>
            <Text style={authScreenStyles.mainText}>Hey,</Text>
            <Text style={authScreenStyles.mainText}>Welcome</Text>
            <Text style={authScreenStyles.mainText}>Back</Text>
            <Text style={authScreenStyles.subtitleText}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form */}
          <View style={authScreenStyles.formContainer}>
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
                underlineColorAndroid="transparent"
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

          {/* Forgot Password */}
          <TouchableOpacity
            style={authScreenStyles.forgetPasswordContainer}
            onPress={handleForgotPasswordPress}
            disabled={loading}
          >
            <Text style={authScreenStyles.forgetPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error ? (
            <Text style={authScreenStyles.errorText}>{error}</Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            style={[authScreenStyles.primaryButton, loading && { opacity: 0.6 }]}
            onPress={handleLoginPress}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={authScreenStyles.primaryButtonText}>Login</Text>
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

          {/* Sign Up Link */}
          <View style={authScreenStyles.newAccountTextContainer}>
            <Text style={authScreenStyles.accountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUpPress} disabled={loading}>
              <Text style={authScreenStyles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}