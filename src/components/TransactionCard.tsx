import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { transactionCardStyles } from '../styles/expense/transactionCardStyles';
import Colors from '../constants/colors';

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

// Category icon mapping
const CATEGORY_ICONS: { [key: string]: any } = {
    Shopping: require('../../assets/images/transctionCardIcons/shopping.png'),
    Transfer: require('../../assets/images/transctionCardIcons/wallet.png'),
    Food: require('../../assets/images/transctionCardIcons/shopping.png'),
    Transport: require('../../assets/images/transctionCardIcons/shopping.png'),
    // Add more as needed
};

// Category color mapping
const CATEGORY_COLORS: { [key: string]: string } = {
    Shopping: '#C3C6F9',
    Transfer: '#FFE3F4',
    Food: '#FFE8D6',
    Transport: '#D6F5FF',
    // Default color
    Default: '#E8E8E8',
};

export const TransactionCard: React.FC<TransactionCardProps> = ({
    data,
    onPress,
    style,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            },
        });
        setIsExpanded(!isExpanded);
        onPress?.(data.id);
    };

    const formatAmount = (amount: number) => {
        const absAmount = Math.abs(amount).toLocaleString('en-IN');
        return `${amount >= 0 ? '+' : '-'} ₹ ${absAmount}`;
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

    const formatTime = (date: Date) => {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    const formatDateOnly = (date: Date) => {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getCategoryIcon = () => {
        if (data.icon) return data.icon;
        if (data.category && CATEGORY_ICONS[data.category]) {
            return CATEGORY_ICONS[data.category];
        }
        return require('../../assets/images/transctionCardIcons/shopping.png');
    };

    const getCategoryColor = () => {
        if (data.category && CATEGORY_COLORS[data.category]) {
            return CATEGORY_COLORS[data.category];
        }
        return CATEGORY_COLORS.Default;
    };

    return (
        <TouchableOpacity
            style={[transactionCardStyles.container, style]}
            onPress={toggleExpand}
            activeOpacity={0.7}
        >
            {/* Main Row */}
            <View style={transactionCardStyles.mainRow}>
                <View style={transactionCardStyles.leftContent}>
                    {/* Icon Container */}
                    <View
                        style={[
                            transactionCardStyles.iconContainer,
                            { backgroundColor: getCategoryColor() },
                        ]}
                    >
                        <Image
                            source={getCategoryIcon()}
                            style={transactionCardStyles.icon}
                        />
                    </View>

                    {/* Text Container */}
                    <View style={transactionCardStyles.textContainer}>
                        <Text style={transactionCardStyles.title} numberOfLines={1}>
                            {data.title}
                        </Text>
                        {data.subtitle && (
                            <Text style={transactionCardStyles.subtitle} numberOfLines={1}>
                                {data.subtitle}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Right Side - Amount & Chevron */}
                <View style={transactionCardStyles.rightContent}>
                    <Text
                        style={[
                            transactionCardStyles.amount,
                            data.type === 'income'
                                ? transactionCardStyles.incomeText
                                : transactionCardStyles.expenseText,
                        ]}
                    >
                        {formatAmount(data.amount)}
                    </Text>
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="rgba(0, 0, 0, 0.40)"
                        style={transactionCardStyles.chevronIcon}
                    />
                </View>
            </View>

            {/* Expanded Content */}
            {isExpanded && (
                <View style={transactionCardStyles.expandedContent}>
                    <View style={transactionCardStyles.divider} />

                    {/* Time & Date */}
                    <View style={transactionCardStyles.detailRow}>
                        <View style={transactionCardStyles.detailItem}>
                            <Ionicons name="time-outline" size={16} color={Colors.secondaryBlack} />
                            <Text style={transactionCardStyles.detailLabel}>Time</Text>
                        </View>
                        <Text style={transactionCardStyles.detailValue}>
                            {formatTime(data.timestamp)}
                        </Text>
                    </View>

                    <View style={transactionCardStyles.detailRow}>
                        <View style={transactionCardStyles.detailItem}>
                            <Ionicons name="calendar-outline" size={16} color={Colors.secondaryBlack} />
                            <Text style={transactionCardStyles.detailLabel}>Date</Text>
                        </View>
                        <Text style={transactionCardStyles.detailValue}>
                            {formatDateOnly(data.timestamp)}
                        </Text>
                    </View>

                    {/* Category */}
                    {data.category && (
                        <View style={transactionCardStyles.detailRow}>
                            <View style={transactionCardStyles.detailItem}>
                                <Ionicons name="pricetag-outline" size={16} color={Colors.secondaryBlack} />
                                <Text style={transactionCardStyles.detailLabel}>Category</Text>
                            </View>
                            <Text style={transactionCardStyles.detailValue}>{data.category}</Text>
                        </View>
                    )}

                    {/* Payment Method */}
                    {data.transactionMethod && (
                        <View style={transactionCardStyles.detailRow}>
                            <View style={transactionCardStyles.detailItem}>
                                <Ionicons name="card-outline" size={16} color={Colors.secondaryBlack} />
                                <Text style={transactionCardStyles.detailLabel}>Payment Method</Text>
                            </View>
                            <Text style={transactionCardStyles.detailValue}>
                                {data.transactionMethod}
                            </Text>
                        </View>
                    )}

                    {/* Notes */}
                    {data.notes && (
                        <View style={transactionCardStyles.notesContainer}>
                            <View style={transactionCardStyles.notesHeader}>
                                <Ionicons name="document-text-outline" size={16} color={Colors.secondaryBlack} />
                                <Text style={transactionCardStyles.detailLabel}>Notes</Text>
                            </View>
                            <Text style={transactionCardStyles.notesText}>{data.notes}</Text>
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default TransactionCard;