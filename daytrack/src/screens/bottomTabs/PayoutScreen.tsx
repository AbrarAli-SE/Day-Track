import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { payoutStyles as styles } from '../../styles/payout/payoutStyles';
import { AddPayoutModal, ConfirmDialog } from '../../components';
import { PeopleSelectionModal } from '../../components/PeopleSelectionModal';
import { usePayouts } from '../../hooks/usePayouts';
import { Payout, CreatePayoutInput, UpdatePayoutInput, PayoutPerson } from '../../types/payout';
import payoutService, { PersonSummary } from '../../services/payoutService';
import Colors from '../../constants/colors';

const HEADER_HEIGHT = 60;

type FilterType = 'all' | 'pay' | 'receive';

export default function PayoutScreen() {
    const navigation = useNavigation();
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editingPayout, setEditingPayout] = useState<Payout | null>(null);
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [payoutToDelete, setPayoutToDelete] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [peopleModalVisible, setPeopleModalVisible] = useState(false);
    const [people, setPeople] = useState<PayoutPerson[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<PayoutPerson | null>(null);
    const [personSummaries, setPersonSummaries] = useState<PersonSummary[]>([]);
    const [loadingSummaries, setLoadingSummaries] = useState(false);

    const {
        payouts,
        stats,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        createPayout,
        updatePayout,
        deletePayout,
        markAsPaid,
        isAuthenticated,
    } = usePayouts();

    React.useEffect(() => {
        if (!isAuthenticated) return;

        const unsubscribe = payoutService.subscribeToPeople(
            (fetchedPeople) => {
                setPeople(fetchedPeople);
            },
            (error) => {
                console.error('People subscription error:', error);
                // Set empty array on error to prevent crashes
                setPeople([]);
            }
        );

        return unsubscribe;
    }, [isAuthenticated]);

    React.useEffect(() => {
        if (isAuthenticated) {
            loadPersonSummaries();
        }
    }, [isAuthenticated, payouts]); // Reload when payouts change

    const loadPersonSummaries = async () => {
        setLoadingSummaries(true);
        try {
            const summaries = await payoutService.getPersonSummaries();
            setPersonSummaries(summaries);
        } catch (error) {
            console.error('Failed to load person summaries:', error);
        } finally {
            setLoadingSummaries(false);
        }
    };

    const handleAddPayout = () => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to add payouts.');
            navigation.navigate('LoginScreen' as never);
            return;
        }
        // Show people selection
        setPeopleModalVisible(true);
    };

    const handleSelectPerson = (person: PayoutPerson) => {
        setSelectedPerson(person);
        setEditingPayout(null);
        setAddModalVisible(true);
    };

    const handleAddNewPerson = () => {
        setSelectedPerson(null);
        setEditingPayout(null);
        setAddModalVisible(true);
    };

    const handleEditPayout = (payout: Payout) => {
        setEditingPayout(payout);
        setAddModalVisible(true);
    };

    const handleDeletePayout = (id: string) => {
        setPayoutToDelete(id);
        setDeleteConfirmVisible(true);
    };

    const confirmDelete = async () => {
        if (payoutToDelete) {
            const success = await deletePayout(payoutToDelete);
            if (success) {
                Alert.alert('Success', 'Payout deleted successfully');
            }
        }
        setDeleteConfirmVisible(false);
        setPayoutToDelete(null);
    };

    const handleMarkAsPaid = async (id: string) => {
        const payout = payouts.find((p) => p.id === id);
        if (!payout) return;

        const actionText = payout.type === 'pay_to' ? 'paid' : 'received';

        Alert.alert(
            'Confirm Payment',
            `Mark this payout as ${actionText}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        const success = await markAsPaid(id);
                        if (success) {
                            Alert.alert('Success', `Payout marked as ${actionText}`);
                        }
                    },
                },
            ]
        );
    };

    const handleSavePayout = async (input: CreatePayoutInput | UpdatePayoutInput) => {
        if (editingPayout) {
            await updatePayout(editingPayout.id, input);
        } else {
            await createPayout(input as CreatePayoutInput);
        }
    };

    const formatCurrency = (amount: number) => {
        return `Rs ${Math.abs(amount).toLocaleString('en-IN')}`;
    };

    const formatDate = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
        }
    };

    const isOverdue = (payout: Payout) => {
        if (payout.status !== 'pending') return false;
        return payout.dueDate < new Date();
    };

    const renderPersonSummaryCard = (person: PersonSummary) => {
        const balanceColor =
            person.pendingBalance > 0
                ? Colors.positiveColor // They owe me
                : person.pendingBalance < 0
                ? Colors.negativeColor // I owe them
                : Colors.secondaryBlack; // Settled

        const balanceLabel =
            person.pendingBalance > 0
                ? 'They owe me'
                : person.pendingBalance < 0
                ? 'I owe them'
                : 'Settled';

        return (
            <View key={person.id} style={styles.personSummaryCard}>
                <View style={styles.personSummaryAvatar}>
                    <Text style={styles.personSummaryAvatarText}>
                        {person.name.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <Text style={styles.personSummaryName} numberOfLines={1}>
                    {person.name}
                </Text>

                <Text style={[styles.personSummaryBalance, { color: balanceColor }]}>
                    {person.pendingBalance !== 0 && (person.pendingBalance > 0 ? '+' : '-')}
                    {formatCurrency(Math.abs(person.pendingBalance))}
                </Text>

                <Text style={styles.personSummaryLabel}>{balanceLabel}</Text>

                <Text style={styles.personSummaryCount}>
                    <Text style={styles.personSummaryCountNumber}>{person.pendingTransactions}</Text>
                    {' '}pending · {' '}
                    <Text style={styles.personSummaryCountNumber}>{person.totalTransactions}</Text>
                    {' '}total
                </Text>
            </View>
        );
    };

    const filteredPayouts = payouts.filter((payout) => {
        if (filterType === 'pay') return payout.type === 'pay_to' && payout.status === 'pending';
        if (filterType === 'receive') return payout.type === 'receive_from' && payout.status === 'pending';
        return payout.status === 'pending';
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Fixed Header */}
            <View style={styles.fixedHeader}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.primaryBlack} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Payouts</Text>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddPayout}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="add" size={26} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={() => { }}
                        tintColor="#000000"
                    />
                }
            >
                {/* Top Background */}
                <View style={styles.topBackground}>
                    <View style={styles.decorativeBlur1} />
                    <View style={styles.decorativeBlur2} />
                </View>

                {/* Spacer for Fixed Header */}
                <View style={{ height: HEADER_HEIGHT }} />

                {/* Content Container */}
                <View style={styles.contentContainer}>
                    {/* Stats Cards */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            {/* Pay To */}
                            <View style={[styles.statCard, styles.statCardPay]}>
                                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(226, 0, 0, 0.12)' }]}>
                                    <Ionicons name="arrow-up-circle" size={22} color={Colors.negativeColor} />
                                </View>
                                <Text style={[styles.statAmount, { color: Colors.negativeColor }]}>
                                    {formatCurrency(stats.totalPayTo)}
                                </Text>
                                <Text style={styles.statLabel}>I Need to Pay</Text>
                            </View>

                            {/* Receive From */}
                            <View style={[styles.statCard, styles.statCardReceive]}>
                                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(0, 71, 171, 0.12)' }]}>
                                    <Ionicons name="arrow-down-circle" size={22} color={Colors.positiveColor} />
                                </View>
                                <Text style={[styles.statAmount, { color: Colors.positiveColor }]}>
                                    {formatCurrency(stats.totalReceiveFrom)}
                                </Text>
                                <Text style={styles.statLabel}>I Will Receive</Text>
                            </View>
                        </View>

                        {/* Net Balance */}
                        <View style={[styles.statCard, styles.statCardNet]}>
                            <View style={styles.statIconContainer}>
                                <Ionicons name="wallet-outline" size={22} color={Colors.primaryBlack} />
                            </View>
                            <Text
                                style={[
                                    styles.statAmount,
                                    {
                                        color:
                                            stats.netBalance > 0
                                                ? Colors.positiveColor
                                                : stats.netBalance < 0
                                                    ? Colors.negativeColor
                                                    : Colors.primaryBlack,
                                    },
                                ]}
                            >
                                {formatCurrency(stats.netBalance)}
                            </Text>
                            <Text style={styles.statLabel}>
                                {stats.netBalance > 0
                                    ? 'Net Receivable'
                                    : stats.netBalance < 0
                                        ? 'Net Payable'
                                        : 'Net Balance'}
                            </Text>
                        </View>
                    </View>

                    {/* Person Summary Cards */}
                    {personSummaries.length > 0 && (
                        <View style={styles.personSummarySection}>
                            <Text style={styles.personSummaryHeader}>People Overview</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.personCardsScroll}
                            >
                                {personSummaries.map((person) => renderPersonSummaryCard(person))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Section Header with Filters */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pending Payouts</Text>
                        <View style={styles.filterTabs}>
                            <TouchableOpacity
                                style={[styles.filterTab, filterType === 'all' && styles.filterTabActive]}
                                onPress={() => setFilterType('all')}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.filterTabText,
                                        filterType === 'all' && styles.filterTabTextActive,
                                    ]}
                                >
                                    All
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.filterTab, filterType === 'pay' && styles.filterTabActive]}
                                onPress={() => setFilterType('pay')}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.filterTabText,
                                        filterType === 'pay' && styles.filterTabTextActive,
                                    ]}
                                >
                                    Pay
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.filterTab, filterType === 'receive' && styles.filterTabActive]}
                                onPress={() => setFilterType('receive')}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.filterTabText,
                                        filterType === 'receive' && styles.filterTabTextActive,
                                    ]}
                                >
                                    Receive
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Payout List */}
                    {filteredPayouts.length === 0 ? (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="receipt-outline" size={48} color="rgba(0, 0, 0, 0.20)" />
                            </View>
                            <Text style={styles.emptyTitle}>No Pending Payouts</Text>
                            <Text style={styles.emptySubtitle}>
                                Tap the + button to add a new payout
                            </Text>
                        </View>
                    ) : (
                        filteredPayouts.map((payout) => (
                            <View
                                key={payout.id}
                                style={[styles.payoutCard, isOverdue(payout) && styles.payoutCardOverdue]}
                            >
                                {/* Header */}
                                <View style={styles.payoutCardHeader}>
                                    <View style={styles.payoutCardLeft}>
                                        <Text style={styles.payoutPersonName}>{payout.personName}</Text>
                                        {payout.personEmail && (
                                            <Text style={styles.payoutEmail}>{payout.personEmail}</Text>
                                        )}
                                    </View>
                                    <Text
                                        style={[
                                            styles.payoutAmount,
                                            payout.type === 'pay_to'
                                                ? styles.payoutAmountPay
                                                : styles.payoutAmountReceive,
                                        ]}
                                    >
                                        {payout.type === 'pay_to' ? '-' : '+'} {formatCurrency(payout.amount)}
                                    </Text>
                                </View>

                                {/* Details */}
                                <View style={styles.payoutDetails}>
                                    <View style={styles.payoutDetailItem}>
                                        <Ionicons name="calendar-outline" size={14} color={Colors.secondaryBlack} />
                                        <Text style={styles.payoutDetailText}>{formatDate(payout.dueDate)}</Text>
                                    </View>

                                    {isOverdue(payout) && (
                                        <View style={[styles.payoutStatusBadge, { backgroundColor: 'rgba(226, 0, 0, 0.10)' }]}>
                                            <Text style={[styles.payoutStatusText, { color: Colors.negativeColor }]}>
                                                Overdue
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Notes */}
                                {payout.notes && (
                                    <Text style={[styles.payoutDetailText, { marginBottom: 12 }]}>
                                        {payout.notes}
                                    </Text>
                                )}

                                {/* Actions */}
                                <View style={styles.payoutActions}>
                                    <TouchableOpacity
                                        style={[styles.payoutActionButton, styles.markPaidButton]}
                                        onPress={() => handleMarkAsPaid(payout.id)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="checkmark-circle-outline" size={16} color={Colors.positiveColor} />
                                        <Text style={[styles.payoutActionText, { color: Colors.positiveColor }]}>
                                            Mark {payout.type === 'pay_to' ? 'Paid' : 'Received'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.payoutActionButton, styles.editButton]}
                                        onPress={() => handleEditPayout(payout)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="create-outline" size={16} color={Colors.primaryBlack} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.payoutActionButton, styles.deleteButton]}
                                        onPress={() => handleDeletePayout(payout.id)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="trash-outline" size={16} color={Colors.negativeColor} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Bottom Padding */}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Add/Edit Payout Modal */}
            <AddPayoutModal
                visible={addModalVisible}
                onClose={() => {
                    setAddModalVisible(false);
                    setEditingPayout(null);
                    setSelectedPerson(null); // ✅ Reset
                }}
                onSave={handleSavePayout}
                isLoading={isCreating || isUpdating}
                editPayout={editingPayout}
                selectedPerson={selectedPerson} // ✅ Pass selected person
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                visible={deleteConfirmVisible}
                title="Delete Payout"
                message="Are you sure you want to delete this payout? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmColor={Colors.negativeColor}
                icon="trash-outline"
                iconColor={Colors.negativeColor}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteConfirmVisible(false);
                    setPayoutToDelete(null);
                }}
                isLoading={isDeleting}
            />

            {/* People Selection Modal */}
            <PeopleSelectionModal
                visible={peopleModalVisible}
                people={people}
                onClose={() => setPeopleModalVisible(false)}
                onSelectPerson={handleSelectPerson}
                onAddNewPerson={handleAddNewPerson}
            />
        </SafeAreaView>
    );
}