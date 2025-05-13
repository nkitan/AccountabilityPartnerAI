import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  Chip,
  FAB,
  Searchbar,
  Menu,
  Divider
} from 'react-native-paper';
import { useTheme, withOpacity } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Habit, HabitCategory } from '../types';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

type HabitsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const HabitsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<HabitsScreenNavigationProp>();
  const { habits, deleteHabit } = useAppContext();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Filter habits based on search and category
  useEffect(() => {
    let filtered = [...habits];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(habit => 
        habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(habit => habit.category === selectedCategory);
    }
    
    setFilteredHabits(filtered);
  }, [habits, searchQuery, selectedCategory]);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might fetch updated data from a server here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Handle search
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle category selection
  const handleCategorySelect = (category: HabitCategory | 'all') => {
    setSelectedCategory(category);
  };

  // Navigate to add habit screen
  const navigateToAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  // Open habit menu
  const openMenu = (habit: Habit) => {
    setSelectedHabit(habit);
    setMenuVisible(true);
  };

  // Close habit menu
  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedHabit(null);
  };

  // Edit habit
  const handleEditHabit = () => {
    if (selectedHabit) {
      navigation.navigate('EditHabit', { habitId: selectedHabit.id });
      closeMenu();
    }
  };

  // Delete habit
  const handleDeleteHabit = () => {
    if (selectedHabit) {
      deleteHabit(selectedHabit.id);
      closeMenu();
    }
  };

  // Render category chips
  const renderCategoryChips = () => {
    const categories: (HabitCategory | 'all')[] = [
      'all', 'work', 'fitness', 'mindfulness', 'learning', 'social', 'health', 'creativity', 'custom'
    ];
    
    return (
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item}
            onPress={() => handleCategorySelect(item)}
            style={[
              styles.categoryChip,
              { 
                backgroundColor: selectedCategory === item 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.primary
              }
            ]}
            textStyle={{ 
              color: selectedCategory === item 
                ? '#fff' 
                : theme.colors.primary 
            }}
          >
            {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
          </Chip>
        )}
        contentContainerStyle={styles.categoryChipsContainer}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  // Render a habit card
  const renderHabitCard = ({ item }: { item: Habit }) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = item.completedDates.includes(today);
    
    return (
      <Card 
        style={[
          styles.habitCard, 
          { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            borderLeftColor: item.color || theme.colors.primary,
            borderLeftWidth: 5,
          }
        ]}
        onPress={() => navigation.navigate('HabitDetails', { habitId: item.id })}
      >
        <Card.Content>
          <View style={styles.habitCardHeader}>
            <Title style={{ color: theme.colors.text }}>{item.title}</Title>
            <TouchableOpacity onPress={() => openMenu(item)}>
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <Paragraph style={[styles.habitDescription, { color: theme.colors.text }]} numberOfLines={2}>
            {item.description}
          </Paragraph>
          
          <View style={styles.habitMeta}>
            <Chip 
              style={[styles.categoryTag, { backgroundColor: 'rgba(103, 80, 164, 0.2)' }]}
              textStyle={{ color: theme.colors.primary }}
            >
              {item.category}
            </Chip>
            
            <Chip 
              style={[styles.frequencyTag, { backgroundColor: 'rgba(3, 218, 198, 0.2)' }]}
              textStyle={{ color: theme.colors.secondary }}
            >
              {item.frequency}
            </Chip>
          </View>
          
          <View style={styles.habitFooter}>
            <View style={styles.streakContainer}>
              <Ionicons name="flame" size={18} color={theme.colors.streak} />
              <Text style={[styles.streakText, { color: theme.colors.text }]}>
                {item.streakCount} day streak
              </Text>
            </View>
            
            {isCompletedToday && (
              <Chip 
                style={[styles.completedTag, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}
                textStyle={{ color: theme.colors.success }}
                icon="check"
              >
                Completed today
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="list" size={80} color={theme.colors.placeholder} />
        <Title style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No habits found
        </Title>
        <Paragraph style={[styles.emptyText, { color: theme.colors.placeholder }]}>
          {searchQuery || selectedCategory !== 'all'
            ? 'Try changing your search or filters'
            : 'Start by adding your first habit'}
        </Paragraph>
        <Button 
          mode="contained" 
          onPress={navigateToAddHabit}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        >
          Add a Habit
        </Button>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      {/* Search bar */}
      <Searchbar
        placeholder="Search habits..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        theme={{ colors: { primary: theme.colors.primary } }}
        inputStyle={{ color: theme.colors.text }}
        placeholderTextColor={theme.colors.placeholder}
      />
      
      {/* Category filter */}
      {renderCategoryChips()}
      
      {/* Habits list */}
      <FlatList
        data={filteredHabits}
        renderItem={renderHabitCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.habitsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      {/* Floating action button */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={navigateToAddHabit}
        color="#fff"
      />
      
      {/* Habit menu */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={{ x: 0, y: 0 }} // This will be positioned properly when opened
        style={[styles.menu, { backgroundColor: theme.colors.surface }]}
      >
        <Menu.Item 
          onPress={handleEditHabit} 
          title="Edit" 
          leadingIcon="pencil"
        />
        <Divider />
        <Menu.Item 
          onPress={handleDeleteHabit} 
          title="Delete" 
          leadingIcon="delete"
          titleStyle={{ color: theme.colors.error }}
        />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  categoryChipsContainer: {
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    borderWidth: 1,
  },
  habitsList: {
    paddingBottom: 80,
  },
  habitCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  habitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitDescription: {
    marginVertical: 8,
  },
  habitMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryTag: {
    marginRight: 8,
  },
  frequencyTag: {},
  habitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 5,
    fontSize: 14,
  },
  completedTag: {},
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  menu: {
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
  },
  addButton: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});

export default HabitsScreen;