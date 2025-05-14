import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  ScrollView
} from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Chip,
  FAB,
  Searchbar,
  Menu,
  Divider
} from 'react-native-paper';
import { useTheme } from '../utils/theme';
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
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
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
  const openMenu = (habit: Habit, event: any) => {
    // Get the position of the touch event
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryChipsContainer}
      >
        {categories.map((item) => (
          <Chip
            key={item}
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
        ))}
      </ScrollView>
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
            <Text variant="titleLarge" style={{ color: theme.colors.text }}>{item.title}</Text>
            <TouchableOpacity onPress={(event) => openMenu(item, event)}>
              <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text variant="bodyMedium" style={[styles.habitDescription, { color: theme.colors.text }]} numberOfLines={2}>
            {item.description}
          </Text>
          
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
            
            {item.priority && (
              <Chip 
                style={[
                  styles.priorityTag, 
                  { 
                    backgroundColor: 
                      item.priority === 'high' 
                        ? 'rgba(255, 87, 34, 0.2)' 
                        : item.priority === 'medium'
                          ? 'rgba(255, 193, 7, 0.2)'
                          : 'rgba(76, 175, 80, 0.2)',
                    paddingHorizontal: 8
                  }
                ]}
                textStyle={{ 
                  color: 
                    item.priority === 'high' 
                      ? theme.colors.priorityHigh || '#FF5722' 
                      : item.priority === 'medium'
                        ? theme.colors.priorityMedium || '#FFC107'
                        : theme.colors.priorityLow || '#4CAF50',
                  fontSize: 12,
                  fontWeight: '500'
                }}
                icon={() => (
                  <Ionicons 
                    name={
                      item.priority === 'high' 
                        ? "flash" 
                        : item.priority === 'medium'
                          ? "alert"
                          : "leaf"
                    }
                    size={16} 
                    color={
                      item.priority === 'high' 
                        ? theme.colors.priorityHigh || '#FF5722' 
                        : item.priority === 'medium'
                          ? theme.colors.priorityMedium || '#FFC107'
                          : theme.colors.priorityLow || '#4CAF50'
                    }
                  />
                )}
              >
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Chip>
            )}
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
        <Text variant="titleLarge" style={[styles.emptyTitle, { color: theme.colors.text }]}>
          No habits found
        </Text>
        <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.placeholder }]}>
          {searchQuery || selectedCategory !== 'all'
            ? 'Try changing your search or filters'
            : 'Start by adding your first habit'}
        </Text>
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
      
      <View style={styles.headerContainer}>
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
      </View>
      
      {/* Habits list */}
      {filteredHabits.length > 0 ? (
        <FlatList
          data={filteredHabits}
          renderItem={renderHabitCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.habitsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          {renderEmptyState()}
        </View>
      )}
      
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
        anchor={menuPosition}
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
    paddingBottom: 0, // Remove bottom padding to avoid extra space
  },
  headerContainer: {
    marginBottom: 8,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  categoryChipsContainer: {
    paddingTop: 8,
    paddingBottom: 12, // Add a bit more space below the category chips
  },
  categoryChip: {
    marginRight: 8,
    borderWidth: 1,
    minWidth: 90, // Set a fixed minimum width for all chips
    justifyContent: 'center', // Center the text horizontally
    height: 36, // Set a fixed height for all chips
    alignItems: 'center', // Center content vertically
  },
  habitsList: {
    paddingBottom: 80,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryTag: {
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  frequencyTag: {
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  priorityTag: {
    marginTop: 4, // Add a small margin at the top if chips wrap to next line
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    minWidth: 36,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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