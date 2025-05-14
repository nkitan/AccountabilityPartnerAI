import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Button, Avatar, Chip, Divider, Surface } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { StatusBar } from 'expo-status-bar';

const RewardsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, rewards = [], addReward, claimReward } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might fetch updated data from a server here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Add sample rewards (for demo purposes)
  const addSampleRewards = () => {
    const sampleRewards = [
      {
        id: uuidv4(),
        title: 'Streak Master',
        description: 'Completed 7 days streak on any habit',
        cost: 50,
        icon: 'trophy',
        unlocked: true,
        claimed: false,
        unlockedAt: new Date().toISOString(),
        category: 'achievement' as any
      },
      {
        id: uuidv4(),
        title: 'Consistency Champion',
        description: 'Completed all habits for 3 consecutive days',
        cost: 75,
        icon: 'ribbon',
        unlocked: true,
        claimed: false,
        unlockedAt: new Date().toISOString(),
        category: 'achievement' as any
      },
      {
        id: uuidv4(),
        title: 'Take a Break',
        description: 'Reward yourself with a guilt-free break',
        cost: 100,
        icon: 'cafe',
        unlocked: true,
        claimed: false,
        unlockedAt: new Date().toISOString(),
        category: 'purchase' as any
      },
      {
        id: uuidv4(),
        title: 'Movie Night',
        description: 'Treat yourself to a movie of your choice',
        cost: 200,
        icon: 'film',
        unlocked: true,
        claimed: false,
        unlockedAt: new Date().toISOString(),
        category: 'purchase' as any
      },
      {
        id: uuidv4(),
        title: 'Milestone: 30 Days',
        description: 'Maintained a habit for 30 consecutive days',
        cost: 0,
        icon: 'medal',
        unlocked: false,
        claimed: false,
        unlockedAt: '',
        category: 'milestone' as any
      }
    ];
    
    sampleRewards.forEach(reward => addReward(reward));
  };
  
  // Claim a reward
  const handleClaimReward = (rewardId: string) => {
    claimReward(rewardId);
  };
  
  // Get category color and icon
  const getCategoryInfo = (category: string) => {
    let color, bgColor, icon;
    
    switch(category) {
      case 'achievement':
        color = theme.colors.achievement;
        bgColor = theme.colors.achievementContainer;
        icon = 'trophy';
        break;
      case 'purchase':
        color = theme.colors.reward;
        bgColor = theme.colors.rewardContainer;
        icon = 'cart';
        break;
      case 'milestone':
        color = theme.colors.milestone;
        bgColor = theme.colors.milestoneContainer;
        icon = 'medal';
        break;
      default:
        color = theme.colors.reward;
        bgColor = theme.colors.rewardContainer;
        icon = 'star';
    }
    
    return { color, bgColor, icon };
  };
  
  // Filter rewards by category
  const getFilteredRewards = () => {
    if (!selectedCategory) return rewards;
    return rewards.filter(reward => reward.category === selectedCategory);
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Render a reward card
  const renderRewardCard = ({ item }: any) => {
    // Determine background color based on category
    const { color: categoryColor, bgColor: categoryBgColor } = getCategoryInfo(item.category);
    
    // Check if user can afford the reward
    const canAfford = (user?.virtualCurrency || 0) >= item.cost;
    
    return (
      <Card 
        style={[
          styles.rewardCard, 
          { 
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.outline,
            borderLeftColor: item.unlocked ? categoryColor : theme.colors.disabled,
            borderLeftWidth: 5,
            borderRadius: theme.roundness * 2,
            opacity: item.claimed ? 0.7 : 1,
            elevation: 2,
            shadowColor: theme.dark ? '#000' : categoryColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4
          }
        ]}
      >
        <Card.Content>
          <View style={styles.rewardHeader}>
            <Surface style={[styles.iconContainer, { 
              backgroundColor: item.unlocked ? categoryBgColor : theme.colors.disabled + '40',
              borderColor: item.unlocked ? categoryColor : theme.colors.disabled,
            }]}>
              <Avatar.Icon 
                size={50} 
                icon={item.icon || 'star'} 
                color={item.unlocked ? categoryColor : theme.colors.disabled}
                style={{ backgroundColor: 'transparent' }}
              />
            </Surface>
            
            <View style={styles.rewardTitleContainer}>
              <Text variant="titleMedium" style={{ 
                color: theme.colors.text,
                fontWeight: 'bold'
              }}>
                {item.title}
              </Text>
              
              <Text variant="bodyMedium" style={{ 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder,
                marginTop: 4,
                marginBottom: 8
              }}>
                {item.description}
              </Text>
              
              <View style={styles.tagContainer}>
                <Chip 
                  style={[styles.categoryChip, { 
                    backgroundColor: categoryBgColor + '40',
                    borderColor: categoryColor,
                    borderWidth: 1
                  }]}
                  textStyle={{ color: categoryColor, fontSize: 12 }}
                  icon={() => (
                    <Ionicons 
                      name={getCategoryInfo(item.category).icon} 
                      size={14} 
                      color={categoryColor} 
                    />
                  )}
                >
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Chip>
                
                {item.claimed && (
                  <Chip 
                    style={[styles.statusChip, { 
                      backgroundColor: theme.colors.successContainer + '60',
                      borderColor: theme.colors.success,
                      borderWidth: 1,
                      marginLeft: 8
                    }]}
                    textStyle={{ color: theme.colors.success, fontSize: 12 }}
                    icon="check-circle"
                  >
                    Claimed
                  </Chip>
                )}
                
                {!item.unlocked && (
                  <Chip 
                    style={[styles.statusChip, { 
                      backgroundColor: theme.colors.surfaceVariant || theme.colors.disabled + '20',
                      borderColor: theme.colors.disabled,
                      borderWidth: 1,
                      marginLeft: 8
                    }]}
                    textStyle={{ color: theme.colors.disabled, fontSize: 12 }}
                    icon="lock"
                  >
                    Locked
                  </Chip>
                )}
              </View>
            </View>
          </View>
          
          <Divider style={{ marginVertical: 12 }} />
          
          <View style={styles.rewardFooter}>
            <View style={styles.costContainer}>
              <Ionicons name="star" size={20} color={theme.colors.reward} />
              <Text style={[styles.costText, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                {item.cost} {item.cost === 1 ? 'coin' : 'coins'}
              </Text>
              
              {!canAfford && item.unlocked && !item.claimed && (
                <Chip 
                  style={[styles.affordChip, { 
                    backgroundColor: theme.colors.errorContainer + '40',
                    marginLeft: 8
                  }]}
                  textStyle={{ color: theme.colors.error, fontSize: 10 }}
                >
                  Need {item.cost - (user?.virtualCurrency || 0)} more
                </Chip>
              )}
            </View>
            
            {item.unlocked && !item.claimed ? (
              <Button 
                mode="contained" 
                onPress={() => handleClaimReward(item.id)}
                style={[styles.claimButton, { 
                  backgroundColor: canAfford ? categoryColor : theme.colors.surfaceVariant,
                  borderRadius: theme.roundness * 5
                }]}
                labelStyle={{ 
                  color: canAfford ? '#fff' : theme.colors.disabled,
                  fontWeight: 'bold'
                }}
                disabled={!canAfford}
                icon={item.cost > 0 ? "shopping" : "trophy"}
              >
                {item.cost > 0 ? 'Redeem' : 'Claim'}
              </Button>
            ) : item.claimed ? (
              <Button 
                mode="contained" 
                disabled
                style={[styles.claimedButton, { 
                  backgroundColor: theme.colors.successContainer,
                  borderRadius: theme.roundness * 5,
                  borderColor: theme.colors.success,
                  borderWidth: 1
                }]}
                labelStyle={{ color: theme.colors.success }}
                icon="check"
              >
                Claimed
              </Button>
            ) : (
              <Button 
                mode="outlined" 
                disabled
                style={[styles.lockedButton, { 
                  borderColor: theme.colors.disabled,
                  borderRadius: theme.roundness * 5
                }]}
                labelStyle={{ color: theme.colors.disabled }}
                icon="lock"
              >
                Locked
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  // Render category chips
  const renderCategoryChips = () => {
    const categories = [
      { id: 'achievement', label: 'Achievements', icon: 'trophy' },
      { id: 'purchase', label: 'Purchases', icon: 'cart' },
      { id: 'milestone', label: 'Milestones', icon: 'medal' }
    ];
    
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        <Chip
          mode="outlined"
          selected={selectedCategory === null}
          onPress={() => handleCategorySelect(null)}
          style={[styles.filterChip, { 
            backgroundColor: selectedCategory === null 
              ? theme.colors.primaryContainer 
              : theme.colors.surface,
            borderColor: theme.colors.primary,
            marginRight: 8
          }]}
          textStyle={{ 
            color: selectedCategory === null 
              ? theme.colors.primary 
              : theme.colors.onSurfaceVariant || theme.colors.placeholder
          }}
          icon="filter-variant"
        >
          All
        </Chip>
        
        {categories.map(category => {
          const { color, bgColor, icon } = getCategoryInfo(category.id);
          const isSelected = selectedCategory === category.id;
          
          return (
            <Chip
              key={category.id}
              mode="outlined"
              selected={isSelected}
              onPress={() => handleCategorySelect(category.id)}
              style={[styles.filterChip, { 
                backgroundColor: isSelected ? bgColor : theme.colors.surface,
                borderColor: color,
                marginRight: 8
              }]}
              textStyle={{ 
                color: isSelected ? color : theme.colors.onSurfaceVariant || theme.colors.placeholder
              }}
              icon={icon}
            >
              {category.label}
            </Chip>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text variant="headlineMedium" style={[styles.title, { 
          color: theme.colors.text,
          fontWeight: 'bold'
        }]}>
          Rewards
        </Text>
        
        {/* Currency Balance Card */}
        <Surface style={[styles.balanceCard, { 
          backgroundColor: theme.colors.rewardContainer + '30',
          borderRadius: theme.roundness * 3,
          elevation: 4,
          shadowColor: theme.colors.reward,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        }]}>
          <View style={styles.balanceCardContent}>
            <View>
              <Text variant="titleMedium" style={[styles.balanceTitle, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                Your Balance
              </Text>
              <View style={styles.balanceContainer}>
                <Ionicons name="star" size={32} color={theme.colors.reward} />
                <Text style={[styles.balanceText, { 
                  color: theme.colors.text,
                  fontWeight: 'bold'
                }]}>
                  {user?.virtualCurrency || 0} coins
                </Text>
              </View>
            </View>
            
            <View style={styles.balanceInfoContainer}>
              <Text style={[styles.balanceInfo, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder,
                textAlign: 'center'
              }]}>
                Complete habits daily to earn more coins!
              </Text>
              <Ionicons 
                name="trending-up" 
                size={24} 
                color={theme.colors.success} 
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
        </Surface>
        
        {/* Reward Categories */}
        <View style={styles.categoriesContainer}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { 
            color: theme.colors.text,
            fontWeight: 'bold'
          }]}>
            Filter by Category
          </Text>
          {renderCategoryChips()}
        </View>
        
        {/* Available Rewards */}
        <View style={styles.rewardsHeaderContainer}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { 
            color: theme.colors.text,
            fontWeight: 'bold'
          }]}>
            Available Rewards
          </Text>
          
          <Chip 
            mode="outlined"
            style={{ 
              borderColor: theme.colors.primary,
              backgroundColor: 'transparent'
            }}
            textStyle={{ color: theme.colors.primary }}
          >
            {getFilteredRewards().length} {getFilteredRewards().length === 1 ? 'reward' : 'rewards'}
          </Chip>
        </View>
        
        {getFilteredRewards().length > 0 ? (
          <FlatList
            data={getFilteredRewards()}
            renderItem={renderRewardCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        ) : (
          <Card style={[styles.emptyCard, { 
            backgroundColor: theme.colors.cardBackground,
            borderRadius: theme.roundness * 2,
            elevation: 1
          }]}>
            <Card.Content style={styles.emptyContainer}>
              <Ionicons 
                name={selectedCategory ? getCategoryInfo(selectedCategory).icon : "trophy"} 
                size={80} 
                color={theme.colors.placeholder} 
              />
              <Text variant="titleMedium" style={[styles.emptyTitle, { 
                color: theme.colors.text,
                marginTop: 16,
                marginBottom: 8,
                fontWeight: 'bold'
              }]}>
                No rewards found
              </Text>
              <Text variant="bodyMedium" style={[styles.emptyText, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder,
                textAlign: 'center'
              }]}>
                {selectedCategory 
                  ? `No ${selectedCategory} rewards available. Try selecting a different category.` 
                  : 'No rewards available yet. Complete habits and build streaks to unlock rewards!'}
              </Text>
            </Card.Content>
          </Card>
        )}
        
        {/* Demo button to add sample rewards */}
        <Button 
          mode="contained" 
          onPress={addSampleRewards}
          style={[styles.demoButton, { 
            backgroundColor: theme.colors.primaryAction,
            borderRadius: theme.roundness * 5,
            marginTop: 24,
            marginBottom: 16
          }]}
          icon="plus"
        >
          Add Sample Rewards (Demo)
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  // Balance card styles
  balanceCard: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  balanceCardContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  balanceText: {
    fontSize: 24,
    marginLeft: 12,
  },
  balanceInfoContainer: {
    alignItems: 'center',
    maxWidth: '40%',
  },
  balanceInfo: {
    fontSize: 14,
  },
  // Category styles
  categoriesContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    height: 36,
  },
  rewardsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  // Reward card styles
  rewardCard: {
    marginBottom: 16,
    borderWidth: 1,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  rewardTitleContainer: {
    marginLeft: 16,
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 8,
    height: 28,
  },
  statusChip: {
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 8,
    height: 28,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  costText: {
    marginLeft: 8,
    fontSize: 16,
  },
  affordChip: {
    height: 24,
    paddingHorizontal: 4,
  },
  claimButton: {
    paddingHorizontal: 16,
    height: 40,
  },
  claimedButton: {
    paddingHorizontal: 16,
    height: 40,
  },
  lockedButton: {
    paddingHorizontal: 16,
    height: 40,
  },
  // Empty state styles
  emptyCard: {
    marginBottom: 16,
    borderRadius: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
  },
  emptyText: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  demoButton: {
    height: 48,
    justifyContent: 'center',
  },
});

export default RewardsScreen;