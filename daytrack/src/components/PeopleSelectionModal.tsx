// src/components/PeopleSelectionModal.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PayoutPerson } from '../types/payout';
import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import typography from '../constants/typography';

interface PeopleSelectionModalProps {
    visible: boolean;
    people: PayoutPerson[];
    onClose: () => void;
    onSelectPerson: (person: PayoutPerson) => void;
    onAddNewPerson: () => void;
}

export const PeopleSelectionModal: React.FC<PeopleSelectionModalProps> = ({
    visible,
    people,
    onClose,
    onSelectPerson,
    onAddNewPerson,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPeople = people.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return `Rs ${Math.abs(amount).toLocaleString('en-IN')}`;
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity style={styles.container} activeOpacity={1}>
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>

                    <View style={styles.header}>
                        <Text style={styles.title}>Select Person</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={22} color={Colors.primaryBlack} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color={Colors.secondaryBlack} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search people..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="rgba(0, 0, 0, 0.40)"
                        />
                    </View>

                    <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={styles.addNewButton} onPress={onAddNewPerson}>
                            <View style={styles.addNewIcon}>
                                <Ionicons name="add-circle" size={24} color={Colors.primaryBlack} />
                            </View>
                            <Text style={styles.addNewText}>Add New Person</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.secondaryBlack} />
                        </TouchableOpacity>

                        {filteredPeople.map((person) => (
                            <TouchableOpacity
                                key={person.id}
                                style={styles.personCard}
                                onPress={() => {
                                    onSelectPerson(person);
                                    onClose();
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.personAvatar}>
                                    <Text style={styles.personAvatarText}>
                                        {person.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>

                                <View style={styles.personInfo}>
                                    <Text style={styles.personName}>{person.name}</Text>
                                    {person.email && <Text style={styles.personEmail}>{person.email}</Text>}
                                    <Text style={styles.personStats}>
                                        {person.transactionCount} transactions
                                    </Text>
                                </View>

                                <View style={styles.personBalance}>
                                    <Text
                                        style={[
                                            styles.personBalanceAmount,
                                            {
                                                color:
                                                    person.totalOwed > 0
                                                        ? Colors.positiveColor
                                                        : person.totalOwed < 0
                                                            ? Colors.negativeColor
                                                            : Colors.secondaryBlack,
                                            },
                                        ]}
                                    >
                                        {person.totalOwed > 0 ? '+' : person.totalOwed < 0 ? '-' : ''}
                                        {formatCurrency(person.totalOwed)}
                                    </Text>
                                    <Text style={styles.personBalanceLabel}>
                                        {person.totalOwed > 0
                                            ? 'They owe me'
                                            : person.totalOwed < 0
                                                ? 'I owe them'
                                                : 'Settled'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {filteredPeople.length === 0 && searchQuery.length > 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No people found</Text>
                            </View>
                        )}
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },

    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 8,
        maxHeight: '80%',
    },

    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },

    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    },

    title: {
        ...typography.heading2,
        fontSize: 22,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginHorizontal: 20,
        marginVertical: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
    },

    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.primaryBlack,
        padding: 0,
    },

    listContainer: {
        paddingHorizontal: 20,
    },

    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: Colors.primaryBlack,
        borderStyle: 'dashed',
    },

    addNewIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    addNewText: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
    },

    personCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.08)',
    },

    personAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primaryBlack,
        justifyContent: 'center',
        alignItems: 'center',
    },

    personAvatarText: {
        fontSize: 20,
        fontFamily: 'YaldeviColombo-Bold',
        color: '#FFFFFF',
    },

    personInfo: {
        flex: 1,
    },

    personName: {
        fontSize: 15,
        fontFamily: 'YaldeviColombo-SemiBold',
        color: Colors.primaryBlack,
        marginBottom: 2,
    },

    personEmail: {
        fontSize: 12,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
        marginBottom: 2,
    },

    personStats: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    personBalance: {
        alignItems: 'flex-end',
    },

    personBalanceAmount: {
        fontSize: 16,
        fontFamily: 'YaldeviColombo-Bold',
        marginBottom: 2,
    },

    personBalanceLabel: {
        fontSize: 11,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },

    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },

    emptyText: {
        fontSize: 14,
        fontFamily: 'YaldeviColombo-Regular',
        color: Colors.secondaryBlack,
    },
});

export default PeopleSelectionModal;