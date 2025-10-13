import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import Colors from '../../constants/colors';
import typography from '../../constants/typography';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export type TransactionType = 'income' | 'expense';

export interface TransactionData {
    id: string;
    title: string;
    subtitle?: string;
    amount: number;
    type: TransactionType;
    timestamp: Date;
    category?: string;
    notes?: string;
    transactionMethod?: string;
    icon?: any; // for custom icon
}

interface TransactionCardProps {
    data: TransactionData;
    onPress?: (id: string) => void;
    style?: any;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
    data,
    onPress,
    style,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
        onPress?.(data.id);
    };

    const formatAmount = (amount: number) => {
        return `${amount >= 0 ? '+' : '-'} ${Math.abs(amount).toLocaleString()}`;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={toggleExpand}
            activeOpacity={0.9}
        >
            {/* Main Row */}
            <View style={styles.mainRow}>
                <View style={styles.leftContent}>
                    <View style={styles.iconContainer}>

                        <Image source={require('../../../assets/images/transctionCardIcons/shopping.png')} style={styles.icon} />

                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{data.title}</Text>
                        {data.subtitle && (
                            <Text style={styles.subtitle}>{data.subtitle}</Text>
                        )}
                    </View>
                </View>
                <Text
                    style={[
                        styles.amount,
                        data.type === 'income' ? styles.incomeText : styles.expenseText,
                    ]}
                >
                    {formatAmount(data.amount)}
                </Text>
            </View>

            {isExpanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Time:</Text>
                        <Text style={styles.detailValue}>{formatDate(data.timestamp)}</Text>
                    </View>
                    {data.category && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Category:</Text>
                            <Text style={styles.detailValue}>{data.category}</Text>
                        </View>
                    )}
                    {data.transactionMethod && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment Method:</Text>
                            <Text style={styles.detailValue}>{data.transactionMethod}</Text>
                        </View>
                    )}
                    {data.notes && (
                        <View style={styles.notesContainer}>
                            <Text style={styles.detailLabel}>Notes:</Text>
                            <Text style={styles.notes}>{data.notes}</Text>
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    mainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#C3C6F9',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    icon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },

    textContainer: {
        marginLeft: 16,
        flex: 1,
    },
    title: {
        ...typography.transactionTitle,
        fontSize: 20,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.primaryBlack,
    },
    subtitle: {
        ...typography.transactionTitle,
        fontFamily: 'YaldeviColombo-Medium',
        color: Colors.secondaryBlack,
        marginTop: 2,
    },
    amount: {
        ...typography.heading2,
        marginLeft: 16,
    },
    incomeText: {
        color: Colors.positiveColor,
    },
    expenseText: {
        color: Colors.negativeColor,
    },
    expandedContent: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        ...typography.bodyMedium,
        color: Colors.secondaryBlack,
    },
    detailValue: {
        ...typography.bodySmall,
        fontSize: 16,
        color: Colors.primaryBlack,
    },
    notesContainer: {
        marginTop: 8,
    },
    notes: {
        ...typography.bodySmall,
        color: Colors.secondaryBlack,
        marginTop: 4,
    },
});

export default TransactionCard;