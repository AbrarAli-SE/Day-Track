// src/components/ExportFormatModal.tsx

import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/colors';
import typography from '../constants/typography';

interface ExportFormatModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectFormat: (format: 'csv' | 'pdf') => void;
}

export const ExportFormatModal: React.FC<ExportFormatModalProps> = ({
    visible,
    onClose,
    onSelectFormat,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    style={styles.container}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Ionicons name="download-outline" size={28} color={Colors.primaryBlack} />
                        <Text style={styles.title}>Export Format</Text>
                        <Text style={styles.subtitle}>Choose how you want to export your data</Text>
                    </View>

                    {/* Format Options */}
                    <View style={styles.optionsContainer}>
                        {/* CSV Option */}
                        <TouchableOpacity
                            style={styles.formatOption}
                            onPress={() => {
                                onSelectFormat('csv');
                                onClose();
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.formatIcon, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="document-text" size={32} color="#34C759" />
                            </View>
                            <View style={styles.formatContent}>
                                <Text style={styles.formatTitle}>CSV (Excel)</Text>
                                <Text style={styles.formatDescription}>
                                    Spreadsheet format, perfect for Excel, Google Sheets, and data analysis
                                </Text>
                                <View style={styles.formatFeatures}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#34C759" />
                                        <Text style={styles.featureText}>Editable</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#34C759" />
                                        <Text style={styles.featureText}>Data Analysis</Text>
                                    </View>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={Colors.secondaryBlack} />
                        </TouchableOpacity>

                        {/* PDF Option */}
                        <TouchableOpacity
                            style={styles.formatOption}
                            onPress={() => {
                                onSelectFormat('pdf');
                                onClose();
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.formatIcon, { backgroundColor: '#FFEBEE' }]}>
                                <Ionicons name="document" size={32} color="#E20000" />
                            </View>
                            <View style={styles.formatContent}>
                                <Text style={styles.formatTitle}>PDF Report</Text>
                                <Text style={styles.formatDescription}>
                                    Professional report with charts and summary, ideal for printing and sharing
                                </Text>
                                <View style={styles.formatFeatures}>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#E20000" />
                                        <Text style={styles.featureText}>Professional</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={14} color="#E20000" />
                                        <Text style={styles.featureText}>Print Ready</Text>
                                    </View>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={24} color={Colors.secondaryBlack} />
                        </TouchableOpacity>
                    </View>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
        padding: 24,
    },

    header: {
        alignItems: 'center',
        marginBottom: 24,
    },

    title: {
        ...typography.heading2,
        fontSize: 22,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginTop: 12,
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        textAlign: 'center',
    },

    optionsContainer: {
        gap: 16,
        marginBottom: 20,
    },

    formatOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    formatIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    formatContent: {
        flex: 1,
    },

    formatTitle: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 4,
    },

    formatDescription: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        lineHeight: 18,
        marginBottom: 8,
    },

    formatFeatures: {
        flexDirection: 'row',
        gap: 12,
    },

    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    featureText: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.secondaryBlack,
    },

    cancelButton: {
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        alignItems: 'center',
    },

    cancelButtonText: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },
});

export default ExportFormatModal;
