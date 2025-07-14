import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_LIBRARY_ITEMS } from '../../services/innervoice/mockLibraryData';

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
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FAFAF8', '#F5F0FF']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#8B7BA7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mijn Bibliotheek</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#C3B5E3" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder='Zoek in je inzichten...'
          placeholderTextColor='#C3B5E380'
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
              !selectedCategory && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.categoryText,
              !selectedCategory && styles.categoryTextActive
            ]}>Alles</Text>
          </TouchableOpacity>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category || null)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#E8DFFD" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Geen inzichten gevonden' : 'Je bibliotheek is nog leeg'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Probeer een andere zoekterm' : 'Bewaar belangrijke momenten uit je gesprekken'}
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.libraryCard}
              onPress={() => navigation.navigate('ConversationDetailScreen', { 
                conversationId: item.conversationId,
              })}
            >
              <Text style={styles.cardText}>{item.text}</Text>
              {item.note && (
                <Text style={styles.cardNote}>{item.note}</Text>
              )}
              <View style={styles.cardFooter}>
                <Text style={styles.cardDate}>
                  {item.timestamp.toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
                {item.category && (
                  <View style={styles.cardCategory}>
                    <Text style={styles.cardCategoryText}>{item.category}</Text>
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
    color: '#4A4458',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#4A4458',
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
    backgroundColor: 'white',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 223, 253, 0.3)',
  },
  categoryChipActive: {
    backgroundColor: '#E8DFFD',
    borderColor: '#C3B5E3',
  },
  categoryText: {
    fontSize: 14,
    color: '#6B6478',
  },
  categoryTextActive: {
    color: '#8B7BA7',
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
    color: '#4A4458',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B6478',
    marginTop: 8,
    textAlign: 'center',
  },
  libraryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: '#4A4458',
    lineHeight: 24,
  },
  cardNote: {
    fontSize: 14,
    color: '#6B6478',
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
    color: '#C3B5E3',
  },
  cardCategory: {
    backgroundColor: '#F5F0FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardCategoryText: {
    fontSize: 12,
    color: '#8B7BA7',
  },
});