import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_LIBRARY_ITEMS } from '../../services/innervoice/mockLibraryData';
import { useTheme } from '../../contexts/ThemeContext';
import { UniversalBackground } from '../../components/backgrounds/UniversalBackground';
import { TAB_BAR_HEIGHT } from '../../constants/navigation';

interface LibraryItem {
  id: string;
  text: string;
  conversationId: string;
  timestamp: Date;
  category?: string;
  note?: string;
}

export default function LibraryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Reset scroll position when screen is focused
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    loadLibraryItems();
  }, []);

  const loadLibraryItems = async () => {
    try {
      const stored = await AsyncStorage.getItem('personal_library');
      if (stored) {
        const items = JSON.parse(stored);
        setLibraryItems(
          items.map((item: LibraryItem) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      } else {
        // For POC: Load mock data
        setLibraryItems(MOCK_LIBRARY_ITEMS);
      }
    } catch (error) {
      // Fallback to mock data
      setLibraryItems(MOCK_LIBRARY_ITEMS);
    }
  };

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(libraryItems.map((item) => item.category).filter(Boolean)));

  return (
    <UniversalBackground
      variant="gradient"
      mood="grounded"
      timeOfDay="afternoon"
      enableEffects={false}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Mijn Bibliotheek</Text>
          <View style={{ width: 24 }} />
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.colors.card,
              shadowColor: theme.isDark ? theme.colors.primary : '#000',
              shadowOpacity: theme.isDark ? 0.2 : 0.05,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Zoek in je inzichten..."
            placeholderTextColor={theme.colors.textLight + '80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border + '4D',
                },
                !selectedCategory && {
                  backgroundColor: theme.isDark
                    ? theme.colors.accent
                    : theme.colors.peaceful.primary[2],
                  borderColor: theme.isDark ? theme.colors.accent : theme.colors.peaceful.accent[0],
                },
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: theme.colors.textSecondary },
                  !selectedCategory && styles.categoryTextActive,
                ]}
              >
                Alles
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border + '4D',
                  },
                  selectedCategory === category && {
                    backgroundColor: theme.isDark
                      ? theme.colors.accent
                      : theme.colors.peaceful.primary[2],
                    borderColor: theme.isDark
                      ? theme.colors.accent
                      : theme.colors.peaceful.accent[0],
                  },
                ]}
                onPress={() =>
                  setSelectedCategory(selectedCategory === category ? null : category || null)
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: theme.colors.textSecondary },
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={64} color={theme.colors.peaceful.primary[2]} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                {searchQuery ? 'Geen inzichten gevonden' : 'Je bibliotheek is nog leeg'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                {searchQuery
                  ? 'Probeer een andere zoekterm'
                  : 'Bewaar belangrijke momenten uit je gesprekken'}
              </Text>
            </View>
          ) : (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.libraryCard,
                  {
                    backgroundColor: theme.colors.card,
                    shadowColor: theme.isDark ? theme.colors.primary : '#000',
                    shadowOpacity: theme.isDark ? 0.2 : 0.05,
                  },
                ]}
                onPress={() =>
                  navigation.navigate('ConversationDetailScreen', {
                    conversationId: item.conversationId,
                  })
                }
              >
                <Text style={[styles.cardText, { color: theme.colors.text }]}>{item.text}</Text>
                {item.note && (
                  <Text style={[styles.cardNote, { color: theme.colors.textSecondary }]}>
                    {item.note}
                  </Text>
                )}
                <View style={styles.cardFooter}>
                  <Text style={[styles.cardDate, { color: theme.colors.textLight }]}>
                    {item.timestamp.toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                  {item.category && (
                    <View
                      style={[
                        styles.cardCategory,
                        {
                          backgroundColor: theme.isDark
                            ? theme.colors.accent + '1A'
                            : theme.colors.peaceful.primary[1],
                        },
                      ]}
                    >
                      <Text
                        style={[styles.cardCategoryText, { color: theme.colors.textSecondary }]}
                      >
                        {item.category}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </UniversalBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    maxHeight: 40,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
  },
  categoryTextActive: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  libraryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
  cardNote: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardDate: {
    fontSize: 12,
  },
  cardCategory: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardCategoryText: {
    fontSize: 12,
  },
});
