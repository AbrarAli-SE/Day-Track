import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export async function signInWithGoogle(): Promise<{ user?: any; error: string | null }> {
    try {
        await GoogleSignin.signOut();

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const signInResult: any = await GoogleSignin.signIn();

        const idToken =
            signInResult.data?.idToken ||
            signInResult.idToken ||
            signInResult.user?.idToken;

        if (!idToken) {
            throw new Error('No ID token found');
        }

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        const userCredential = await auth().signInWithCredential(googleCredential);
        return { user: userCredential.user, error: null };

    } catch (error: any) {
        if (error.code === 'auth/account-exists-with-different-credential') {
            return {
                error: 'An account already exists with this email using email/password. Please login with your password instead.'
            };
        } else if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            return { error: 'Google sign-in was cancelled.' };
        } else if (error.code === statusCodes.IN_PROGRESS) {
            return { error: 'Google sign-in is in progress.' };
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            return { error: 'Google Play Services not available or outdated.' };
        } else {
            return { error: error.message || 'Google sign-in failed. Please try again.' };
        }
    }
}