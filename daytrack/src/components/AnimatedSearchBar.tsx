import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Animated,
    Keyboard,
    Modal,
    Text,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { searchBarStyles } from '../styles/searchBarStyles';

interface AnimatedSearchBarProps {
    placeholder?: string;
    onSearch?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    searchResults?: any[];
    renderSearchResult?: (item: any) => React.ReactNode;
}

export const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
    placeholder = 'Search transactions...',
    onSearch,
    onFocus,
    onBlur,
    searchResults = [],
    renderSearchResult,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchText, setSearchText] = useState('');
    const inputRef = useRef<TextInput>(null);

    // Animation values
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const expandSearch = () => {
        setIsExpanded(true);
        onFocus?.();

        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 8,
                tension: 50,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.05,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 6,
            }).start();

            // Auto focus after animation
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        });
    };

    const collapseSearch = () => {
        Keyboard.dismiss();

        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 50,
            }),
        ]).start(() => {
            setIsExpanded(false);
            setSearchText('');
            onBlur?.();
        });
    };

    const handleChangeText = (text: string) => {
        setSearchText(text);
        onSearch?.(text);
    };

    const handleClear = () => {
        setSearchText('');
        onSearch?.('');
        inputRef.current?.focus();
    };

    // Modal background opacity
    const backgroundOpacity = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    // Search container translation
    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
    });

    return (
        <>
            {/* Collapsed Search Button */}
            <TouchableOpacity
                style={searchBarStyles.collapsedButton}
                onPress={expandSearch}
                activeOpacity={0.7}
            >
                <Ionicons name="search-outline" size={22} color="#000000" />
            </TouchableOpacity>

            {/* Full-Screen Search Modal */}
            <Modal
                visible={isExpanded}
                transparent
                animationType="none"
                onRequestClose={collapseSearch}
                statusBarTranslucent
            >
                <Animated.View
                    style={[
                        searchBarStyles.modalOverlay,
                        { opacity: backgroundOpacity },
                    ]}
                >
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={collapseSearch}
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        searchBarStyles.searchContainer,
                        {
                            transform: [
                                { translateY },
                                { scale: scaleAnim },
                            ],
                        },
                    ]}
                >
                    {/* Search Header */}
                    <View style={searchBarStyles.searchHeader}>
                        <TouchableOpacity
                            style={searchBarStyles.backButton}
                            onPress={collapseSearch}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="#000000" />
                        </TouchableOpacity>

                        <View style={searchBarStyles.searchInputContainer}>
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color="rgba(0, 0, 0, 0.60)"
                                style={searchBarStyles.searchIcon}
                            />
                            <TextInput
                                ref={inputRef}
                                style={searchBarStyles.searchInput}
                                placeholder={placeholder}
                                placeholderTextColor="rgba(0, 0, 0, 0.40)"
                                value={searchText}
                                onChangeText={handleChangeText}
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="search"
                            />
                            {searchText.length > 0 && (
                                <TouchableOpacity
                                    style={searchBarStyles.clearButton}
                                    onPress={handleClear}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close-circle" size={20} color="rgba(0, 0, 0, 0.40)" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Search Results */}
                    <ScrollView
                        style={searchBarStyles.resultsContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {searchText.length === 0 ? (
                            // Empty State
                            <View style={searchBarStyles.emptyState}>
                                <View style={searchBarStyles.emptyIconContainer}>
                                    <Ionicons name="search-outline" size={48} color="rgba(0, 0, 0, 0.20)" />
                                </View>
                                <Text style={searchBarStyles.emptyTitle}>Search Transactions</Text>
                                <Text style={searchBarStyles.emptySubtitle}>
                                    Start typing to search through your transactions
                                </Text>
                            </View>
                        ) : searchResults.length === 0 ? (
                            // No Results
                            <View style={searchBarStyles.emptyState}>
                                <View style={searchBarStyles.emptyIconContainer}>
                                    <Ionicons name="document-text-outline" size={48} color="rgba(0, 0, 0, 0.20)" />
                                </View>
                                <Text style={searchBarStyles.emptyTitle}>No Results Found</Text>
                                <Text style={searchBarStyles.emptySubtitle}>
                                    Try searching with different keywords
                                </Text>
                            </View>
                        ) : (
                            // Search Results
                            <View style={searchBarStyles.resultsList}>
                                <Text style={searchBarStyles.resultsCount}>
                                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                </Text>
                                {searchResults.map((item, index) => (
                                    <View key={index}>
                                        {renderSearchResult ? renderSearchResult(item) : (
                                            <View style={searchBarStyles.defaultResultItem}>
                                                <Text>{item.title || 'Result'}</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </Animated.View>
            </Modal>
        </>
    );
};

export default AnimatedSearchBar;