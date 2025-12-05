// src/utils/permissions.ts

import { Platform, PermissionsAndroid, Alert } from 'react-native';

export const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return true; // iOS handles permissions differently
    }

    try {
        // For Android 13+ (API 33+), WRITE_EXTERNAL_STORAGE is not needed
        if (Platform.Version >= 33) {
            return true;
        }

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Storage Permission Required',
                message: 'Day Track needs access to save exported files to your device',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('✅ Storage permission granted');
            return true;
        } else {
            console.log('❌ Storage permission denied');
            Alert.alert(
                'Permission Denied',
                'Storage permission is required to export files. Please enable it in app settings.',
                [{ text: 'OK' }]
            );
            return false;
        }
    } catch (err) {
        console.error('Permission error:', err);
        return false;
    }
};

export const checkStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
        return true;
    }

    if (Platform.Version >= 33) {
        return true;
    }

    try {
        const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        return granted;
    } catch (err) {
        console.error('Permission check error:', err);
        return false;
    }
};
