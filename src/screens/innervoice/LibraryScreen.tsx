import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_LIBRARY_ITEMS } from '../../services/innervoice/mockLibraryData';
import { useTheme } from '../../contexts/ThemeContext';

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
        setLibraryItems(items.map((item: LibraryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })));
      } else {
        // For POC: Load mock data
        setLibraryItems(MOCK_LIBRARY_ITEMS);
      }
    } catch (error) {
      // Fallback to mock data
      setLibraryItems(MOCK_LIBRARY_ITEMS);
    }
  };

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(libraryItems.map(item => item.category).filter(Boolean)));

  const dynamicStyles = createStyles(theme);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <LinearGradient
        colors={theme.isDark ? ['#0F1419', '#1A2332'] : ['#FAFAF8', '#F5F0FF']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Mijn Bibliotheek</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={dynamicStyles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textLight} style={dynamicStyles.searchIcon} />
        <TextInput
          style={dynamicStyles.searchInput}
          placeholder='Zoek in je inzichten...'
          placeholderTextColor={theme.colors.textLight + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {categories.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={dynamicStyles.categoriesContainer}
        >
          <TouchableOpacity
            style={[
              dynamicStyles.categoryChip,
              !selectedCategory && dynamicStyles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              dynamicStyles.categoryText,
              !selectedCategory && dynamicStyles.categoryTextActive
            ]}>Alles</Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                dynamicStyles.categoryChip,
                selectedCategory === category && dynamicStyles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category || null)}
            >
              <Text style={[
                dynamicStyles.categoryText,
                selectedCategory === category && dynamicStyles.categoryTextActive
              ]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView 
        ref={scrollViewRef}
        style={dynamicStyles.content} 
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <Ionicons name="book-outline" size={64} color={theme.colors.peaceful.primary[2]} />
            <Text style={dynamicStyles.emptyTitle}>
              {searchQuery ? 'Geen inzichten gevonden' : 'Je bibliotheek is nog leeg'}
            </Text>
            <Text style={dynamicStyles.emptySubtitle}>
              {searchQuery ? 'Probeer een andere zoekterm' : 'Bewaar belangrijke momenten uit je gesprekken'}
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={dynamicStyles.libraryCard}
              onPress={() => navigation.navigate('ConversationDetailScreen', { 
                conversationId: item.conversationId,
              })}
            >
              <Text style={dynamicStyles.cardText}>{item.text}</Text>
              {item.note && (
                <Text style={dynamicStyles.cardNote}>{item.note}</Text>
              )}
              <View style={dynamicStyles.cardFooter}>
                <Text style={dynamicStyles.cardDate}>
                  {item.timestamp.toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
                {item.category && (
                  <View style={dynamicStyles.cardCategory}>
                    <Text style={dynamicStyles.cardCategoryText}>{item.category}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
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
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: theme.isDark ? theme.colors.primary : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.2 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
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
    backgroundColor: theme.colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border + '4D',
  },
  categoryChipActive: {
    backgroundColor: theme.isDark ? theme.colors.accent : theme.colors.peaceful.primary[2],
    borderColor: theme.isDark ? theme.colors.accent : theme.colors.peaceful.accent[0],
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  categoryTextActive: {
    color: theme.colors.textSecondary,
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
    color: theme.colors.text,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  libraryCard: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: theme.isDark ? theme.colors.primary : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.2 : 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  cardNote: {
    fontSize: 14,
    color: theme.colors.textSecondary,
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
    color: theme.colors.textLight,
  },
  cardCategory: {
    backgroundColor: theme.isDark ? theme.colors.accent + '1A' : theme.colors.peaceful.primary[1],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardCategoryText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});