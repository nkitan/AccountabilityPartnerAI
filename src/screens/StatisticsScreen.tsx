import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Surface, Divider, Chip, ProgressBar, useTheme as usePaperTheme, SegmentedButtons } from 'react-native-paper';
import { useTheme } from '../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { BarChart, PieChart } from 'react-native-gifted-charts';

const StatisticsScreen: React.FC = () => {
  const theme = useTheme();
  const paperTheme = usePaperTheme();
  const navigation = useNavigation();
  const { habits, checkIns, user } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [categoryChartType, setCategoryChartType] = useState('bar');
  const [priorityChartType, setPriorityChartType] = useState('bar');
  
  // Helper function to get color for category
  const getCategoryColor = (category: string) => {
    switch(category.toLowerCase()) {
      case 'health':
        return theme.colors.success;
      case 'work':
        return theme.colors.primary;
      case 'personal':
        return theme.colors.info;
      case 'learning':
        return theme.colors.milestone;
      default:
        return theme.colors.placeholder;
    }
  };
  
  // Helper function to get color for priority
  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high':
        return theme.colors.priorityHigh;
      case 'medium':
        return theme.colors.priorityMedium;
      case 'low':
        return theme.colors.priorityLow;
      default:
        return theme.colors.placeholder;
    }
  };
  
  // Helper function to get icon for priority
  const getPriorityIcon = (priority: string): string => {
    switch(priority.toLowerCase()) {
      case 'high':
        return 'flash';
      case 'medium':
        return 'alert-circle';
      case 'low':
        return 'leaf';
      default:
        return 'help-circle';
    }
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might fetch updated data from a server here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  // Calculate basic stats
  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => habit.active).length;
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;
  
  // Calculate completion rate
  const completionRate = activeHabits > 0 
    ? Math.round((completedToday / activeHabits) * 100) 
    : 0;
  
  // Get habit with longest streak
  const habitWithLongestStreak = habits.length > 0 
    ? habits.reduce((prev, current) => (prev.streakCount > current.streakCount) ? prev : current) 
    : null;
  
  // Get habit with most completions
  const habitWithMostCompletions = habits.length > 0 
    ? habits.reduce((prev, current) => 
        (prev.completedDates.length > current.completedDates.length) ? prev : current
      ) 
    : null;
    
  // Calculate habit categories distribution
  const categoryDistribution = habits.reduce((acc, habit) => {
    const category = habit.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate total count of categories for accurate percentage calculation
  const totalCategoryCount = Object.values(categoryDistribution).reduce((sum, count) => sum + count, 0);
  
  // Prepare data for bar chart
  const categoryBarData = Object.entries(categoryDistribution).map(([category, count]) => ({
    value: count,
    label: category,
    frontColor: getCategoryColor(category),
    topLabelComponent: () => (
      <Text style={{ color: theme.colors.text, fontSize: 12, marginBottom: 4 }}>
        {((count / totalCategoryCount) * 100).toFixed(1)}%
      </Text>
    )
  }));
  
  // Prepare data for pie chart
  const categoryPieData = Object.entries(categoryDistribution).map(([category, count]) => ({
    value: count,
    label: category,
    color: getCategoryColor(category),
    text: `${((count / totalCategoryCount) * 100).toFixed(1)}%`,
    textColor: theme.colors.text,
    shiftTextX: 0,
    shiftTextY: 0,
  }));
  
  // Calculate priority distribution
  const priorityDistribution = habits.reduce((acc, habit) => {
    const priority = habit.priority || 'none';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate total count of priorities for accurate percentage calculation
  const totalPriorityCount = Object.values(priorityDistribution).reduce((sum, count) => sum + count, 0);
  
  // Prepare data for bar chart
  const priorityBarData = Object.entries(priorityDistribution).map(([priority, count]) => ({
    value: count,
    label: priority.charAt(0).toUpperCase() + priority.slice(1),
    frontColor: getPriorityColor(priority),
    topLabelComponent: () => (
      <Text style={{ color: theme.colors.text, fontSize: 12, marginBottom: 4 }}>
        {((count / totalPriorityCount) * 100).toFixed(1)}%
      </Text>
    )
  }));
  
  // Prepare data for pie chart
  const priorityPieData = Object.entries(priorityDistribution).map(([priority, count]) => ({
    value: count,
    label: priority.charAt(0).toUpperCase() + priority.slice(1),
    color: getPriorityColor(priority),
    text: `${((count / totalPriorityCount) * 100).toFixed(1)}%`,
    textColor: theme.colors.text,
    shiftTextX: 0,
    shiftTextY: 0
  }));

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
          Statistics
        </Text>
        
        {/* Today's Progress Card */}
        <Surface style={[styles.progressCard, { 
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * 3,
          elevation: 4,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        }]}>
          <View style={styles.progressCardContent}>
            <View style={styles.progressHeader}>
              <Text variant="titleMedium" style={[styles.progressTitle, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                Today's Progress
              </Text>
              <Chip 
                mode="outlined"
                style={{ 
                  borderColor: completionRate >= 70 
                    ? theme.colors.success 
                    : completionRate >= 30 
                      ? theme.colors.warning 
                      : theme.colors.error,
                  backgroundColor: 'transparent'
                }}
                textStyle={{ 
                  color: completionRate >= 70 
                    ? theme.colors.success 
                    : completionRate >= 30 
                      ? theme.colors.warning 
                      : theme.colors.error,
                  fontWeight: 'bold'
                }}
              >
                {completionRate}%
              </Chip>
            </View>
            
            <ProgressBar 
              progress={completionRate / 100} 
              color={
                completionRate >= 70 
                  ? theme.colors.success 
                  : completionRate >= 30 
                    ? theme.colors.warning 
                    : theme.colors.error
              }
              style={styles.progressBar}
            />
            
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                <Text style={[styles.progressStatText, { color: theme.colors.text }]}>
                  {completedToday} completed
                </Text>
              </View>
              
              <View style={styles.progressStat}>
                <Ionicons name="time" size={20} color={theme.colors.warning} />
                <Text style={[styles.progressStatText, { color: theme.colors.text }]}>
                  {activeHabits - completedToday} remaining
                </Text>
              </View>
            </View>
          </View>
        </Surface>
        
        {/* Overview Stats Card */}
        <Surface style={[styles.overviewCard, { 
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * 3,
          elevation: 3,
          marginTop: 16,
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4
        }]}>
          <View style={styles.overviewHeader}>
            <Text variant="titleMedium" style={[styles.overviewTitle, { 
              color: theme.colors.text,
              fontWeight: 'bold'
            }]}>
              Overview
            </Text>
            <Ionicons name="stats-chart" size={22} color={theme.colors.primary} />
          </View>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statItemModern, { 
              borderRightWidth: 1, 
              borderBottomWidth: 1,
              borderColor: theme.colors.outline + '30'
            }]}>
              <View style={[styles.statIconContainer, {
                backgroundColor: theme.colors.primaryContainer + '40',
              }]}>
                <Ionicons name="list" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statValueModern, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                {totalHabits}
              </Text>
              <Text style={[styles.statLabelModern, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder
              }]}>
                Total Habits
              </Text>
            </View>
            
            <View style={[styles.statItemModern, { 
              borderBottomWidth: 1,
              borderColor: theme.colors.outline + '30'
            }]}>
              <View style={[styles.statIconContainer, {
                backgroundColor: theme.colors.infoContainer + '40',
              }]}>
                <Ionicons name="play-circle" size={20} color={theme.colors.info} />
              </View>
              <Text style={[styles.statValueModern, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                {activeHabits}
              </Text>
              <Text style={[styles.statLabelModern, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder
              }]}>
                Active Habits
              </Text>
            </View>
            
            <View style={[styles.statItemModern, { 
              borderRightWidth: 1,
              borderColor: theme.colors.outline + '30'
            }]}>
              <View style={[styles.statIconContainer, {
                backgroundColor: theme.colors.successContainer + '40',
              }]}>
                <Ionicons name="checkmark-done-circle" size={20} color={theme.colors.success} />
              </View>
              <Text style={[styles.statValueModern, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                {completedToday}
              </Text>
              <Text style={[styles.statLabelModern, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder
              }]}>
                Completed Today
              </Text>
            </View>
            
            <View style={styles.statItemModern}>
              <View style={[styles.statIconContainer, {
                backgroundColor: theme.colors.streakContainer + '40',
              }]}>
                <Ionicons name="flame" size={20} color={theme.colors.streak} />
              </View>
              <Text style={[styles.statValueModern, { 
                  color: theme.colors.text,
                  fontWeight: 'bold'
                }]}>
                {habitWithLongestStreak?.streakCount || 0}
              </Text>
              <Text style={[styles.statLabelModern, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder
              }]}>
                Longest Streak
              </Text>
            </View>
          </View>
        </Surface>
        
        {/* Achievements Card */}
        <Card style={[styles.card, { 
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * 2,
          elevation: 2
        }]}>
          <Card.Content>
            <View style={styles.cardHeaderWithIcon}>
              <Ionicons name="trophy" size={22} color={theme.colors.achievement} />
              <Text variant="titleMedium" style={[styles.cardTitle, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                Achievements
              </Text>
            </View>
            
            <Divider style={{ marginVertical: 12 }} />
            
            {habitWithLongestStreak && habitWithLongestStreak.streakCount > 0 ? (
              <Surface style={[styles.achievementItem, { 
                backgroundColor: theme.colors.streakContainer + '30',
                borderRadius: theme.roundness * 2,
                borderLeftColor: theme.colors.streak,
                borderLeftWidth: 4
              }]}>
                <View style={styles.achievementIconContainer}>
                  <Ionicons name="flame" size={28} color={theme.colors.streak} />
                </View>
                
                <View style={styles.achievementContent}>
                  <Text variant="titleSmall" style={[styles.achievementTitle, { 
                    color: theme.colors.text,
                    fontWeight: 'bold'
                  }]}>
                    Longest Streak
                  </Text>
                  
                  <Text variant="bodyMedium" style={[styles.achievementText, { 
                    color: theme.colors.onSurfaceVariant || theme.colors.placeholder
                  }]}>
                    {habitWithLongestStreak.streakCount} days for "{habitWithLongestStreak.title}"
                  </Text>
                </View>
              </Surface>
            ) : (
              <Text variant="bodyMedium" style={[styles.emptyText, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder,
                textAlign: 'center',
                marginVertical: 16
              }]}>
                No streak achievements yet. Keep building your habits!
              </Text>
            )}
            
            {habitWithMostCompletions && habitWithMostCompletions.completedDates.length > 0 && (
              <Surface style={[styles.achievementItem, { 
                backgroundColor: theme.colors.successContainer + '30',
                borderRadius: theme.roundness * 2,
                borderLeftColor: theme.colors.success,
                borderLeftWidth: 4,
                marginTop: 12
              }]}>
                <View style={styles.achievementIconContainer}>
                  <Ionicons name="checkmark-circle" size={28} color={theme.colors.success} />
                </View>
                
                <View style={styles.achievementContent}>
                  <Text variant="titleSmall" style={[styles.achievementTitle, { 
                    color: theme.colors.text,
                    fontWeight: 'bold'
                  }]}>
                    Most Consistent Habit
                  </Text>
                  
                  <Text variant="bodyMedium" style={[styles.achievementText, { 
                    color: theme.colors.onSurfaceVariant || theme.colors.placeholder
                  }]}>
                    Completed "{habitWithMostCompletions.title}" {habitWithMostCompletions.completedDates.length} times
                  </Text>
                </View>
              </Surface>
            )}
          </Card.Content>
        </Card>
        
        {/* Categories Distribution Card */}
        <Card style={[styles.card, { 
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * 2,
          elevation: 2
        }]}>
          <Card.Content>
            <View style={styles.cardHeaderWithIcon}>
              <Ionicons name="folder" size={22} color={theme.colors.info} />
              <Text variant="titleMedium" style={[styles.cardTitle, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                Habit Categories
              </Text>
            </View>
            
            <View style={styles.chartTypeSelector}>
              <SegmentedButtons
                value={categoryChartType}
                onValueChange={setCategoryChartType}
                buttons={[
                  {
                    value: 'bar',
                    icon: 'chart-bar',
                    label: 'Bar'
                  },
                  {
                    value: 'pie',
                    icon: 'chart-pie',
                    label: 'Pie'
                  },
                ]}
                style={{
                  backgroundColor: theme.colors.background + '30',
                  borderRadius: 16,
                  padding: 3,
                  borderWidth: 1,
                  borderColor: theme.colors.outline + '20',
                }}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    secondaryContainer: theme.colors.surface + '90',
                    onSecondaryContainer: theme.colors.text,
                    outline: 'transparent',
                  }
                }}
                density={-2}
              />
            </View>
            
            <Divider style={{ 
              marginVertical: 12, 
              opacity: 0.5, 
              height: 1,
              backgroundColor: theme.colors.outline + '40'
            }} />
            
            {Object.keys(categoryDistribution).length > 0 ? (
              categoryChartType === 'bar' ? (
                <View style={[styles.chartContainer, {
                  backgroundColor: theme.colors.surface + '80',
                  shadowColor: theme.colors.shadow,
                }]}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                      data={categoryBarData.map(item => ({
                        ...item,
                        frontColor: theme.colors.primary + 'CC',
                        gradientColor: theme.colors.primary + '40',
                        label: item.label.length > 10 ? item.label.substring(0, 8) + '...' : item.label,
                        labelComponent: () => (
                          <Text 
                            style={{ 
                              color: theme.colors.text, 
                              fontSize: 10, 
                              textAlign: 'center',
                              width: 60,
                              marginTop: 4
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.label}
                          </Text>
                        )
                      }))}
                      barWidth={35}
                      spacing={20}
                      roundedTop
                      hideRules
                      xAxisThickness={0}
                      yAxisThickness={0}
                      yAxisTextStyle={{ color: theme.colors.text + '80', fontSize: 10, fontWeight: '400' }}
                      noOfSections={4}
                      maxValue={Math.max(...Object.values(categoryDistribution)) + 1}
                      labelWidth={60}
                      backgroundColor={'transparent'}
                      height={200}
                      width={Math.max(300, Object.keys(categoryDistribution).length * 60)}
                      showGradient
                      barBorderRadius={6}
                      disableScroll
                      barMarginBottom={20}
                      showYAxisIndices={false}
                      cappedBars
                      capColor={theme.colors.primary}
                      capThickness={2}
                      renderTooltip={(item, index) => {
                        return (
                          <View style={{
                            backgroundColor: theme.colors.surface,
                            padding: 8,
                            borderRadius: 8,
                            elevation: 4,
                            shadowColor: theme.colors.shadow,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            borderWidth: 1,
                            borderColor: theme.colors.outline + '30',
                          }}>
                            <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                              {item.label}: {item.value}
                            </Text>
                            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                              {((item.value / totalCategoryCount) * 100).toFixed(1)}%
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </ScrollView>
                </View>
              ) : (
                <View style={[styles.chartContainer, {
                  backgroundColor: theme.colors.surface + '80',
                  shadowColor: theme.colors.shadow,
                }]}>
                  <PieChart
                    data={categoryPieData.map(item => ({
                      ...item,
                      color: getCategoryColor(item.label) + 'E6',
                      gradientCenterColor: getCategoryColor(item.label) + '80',
                      focused: false,
                    }))}
                    donut
                    showGradient
                    radius={90}
                    innerRadius={65}
                    innerCircleColor={theme.colors.surface}
                    focusOnPress
                    strokeWidth={0}
                    showText={false}
                    centerLabelComponent={() => (
                      <View style={{ 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: theme.colors.surface,
                        borderRadius: 65,
                        width: 130,
                        height: 130,
                        shadowColor: theme.colors.shadow,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 1,
                      }}>
                        <Text style={{ color: theme.colors.primary, fontSize: 32, fontWeight: 'bold' }}>
                          {totalCategoryCount}
                        </Text>
                        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, marginTop: -4 }}>
                          Total Habits
                        </Text>
                      </View>
                    )}
                  />
                  
                  <View style={styles.legendContainer}>
                    <View style={{ 
                      flexDirection: 'row', 
                      flexWrap: 'wrap', 
                      justifyContent: 'space-between',
                      marginTop: 10
                    }}>
                      {Object.entries(categoryDistribution)
                        .sort(([, countA], [, countB]) => countB - countA) // Sort by count descending
                        .map(([category, count]) => (
                          <View key={category} style={{
                            width: '48%',
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            <View style={{
                              width: 12,
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: getCategoryColor(category),
                              marginRight: 8,
                            }} />
                            <View style={{ flex: 1 }}>
                              <Text style={{ 
                                color: theme.colors.text,
                                fontSize: 12,
                                fontWeight: '600',
                                marginBottom: 2,
                              }} numberOfLines={1} ellipsizeMode="tail">
                                {category}
                              </Text>
                              <Text style={{ 
                                color: theme.colors.onSurfaceVariant,
                                fontSize: 10,
                              }}>
                                {count} ({((count / totalCategoryCount) * 100).toFixed(0)}%)
                              </Text>
                            </View>
                          </View>
                      ))}
                    </View>
                  </View>
                </View>
              )
            ) : (
              <Text variant="bodyMedium" style={[styles.emptyText, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder,
                textAlign: 'center',
                marginVertical: 16
              }]}>
                No habit categories found. Add habits with categories to see distribution.
              </Text>
            )}
          </Card.Content>
        </Card>
        
        {/* Priority Distribution Card */}
        <Card style={[styles.card, { 
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * 2,
          elevation: 2
        }]}>
          <Card.Content>
            <View style={styles.cardHeaderWithIcon}>
              <Ionicons name="flag" size={22} color={theme.colors.priorityMedium} />
              <Text variant="titleMedium" style={[styles.cardTitle, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                Priority Distribution
              </Text>
            </View>
            
            <View style={styles.chartTypeSelector}>
              <SegmentedButtons
                value={priorityChartType}
                onValueChange={setPriorityChartType}
                buttons={[
                  {
                    value: 'bar',
                    icon: 'chart-bar',
                    label: 'Bar'
                  },
                  {
                    value: 'pie',
                    icon: 'chart-pie',
                    label: 'Pie'
                  },
                ]}
                style={{
                  backgroundColor: theme.colors.background + '30',
                  borderRadius: 16,
                  padding: 3,
                  borderWidth: 1,
                  borderColor: theme.colors.outline + '20',
                }}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    secondaryContainer: theme.colors.surface + '90',
                    onSecondaryContainer: theme.colors.text,
                    outline: 'transparent',
                  }
                }}
                density={-2}
              />
            </View>
            
            <Divider style={{ 
              marginVertical: 12, 
              opacity: 0.5, 
              height: 1,
              backgroundColor: theme.colors.outline + '40'
            }} />
            
            {Object.keys(priorityDistribution).length > 0 ? (
              priorityChartType === 'bar' ? (
                <View style={[styles.chartContainer, {
                  backgroundColor: theme.colors.surface + '80',
                  shadowColor: theme.colors.shadow,
                }]}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                      data={priorityBarData.map(item => {
                        const color = getPriorityColor(item.label.toLowerCase());
                        return {
                          ...item,
                          frontColor: color + 'CC',
                          gradientColor: color + '40',
                          labelComponent: () => (
                            <View style={{ alignItems: 'center', marginTop: 4 }}>
                              <Ionicons 
                                name={getPriorityIcon(item.label.toLowerCase())} 
                                size={14} 
                                color={color} 
                                style={{ marginBottom: 2 }}
                              />
                              <Text 
                                style={{ 
                                  color: theme.colors.text, 
                                  fontSize: 10, 
                                  textAlign: 'center',
                                  width: 60
                                }}
                              >
                                {item.label}
                              </Text>
                            </View>
                          )
                        };
                      })}
                      barWidth={35}
                      spacing={20}
                      roundedTop
                      hideRules
                      xAxisThickness={0}
                      yAxisThickness={0}
                      yAxisTextStyle={{ color: theme.colors.text + '80', fontSize: 10, fontWeight: '400' }}
                      noOfSections={4}
                      maxValue={Math.max(...Object.values(priorityDistribution)) + 1}
                      labelWidth={60}
                      backgroundColor={'transparent'}
                      height={200}
                      width={Math.max(300, Object.keys(priorityDistribution).length * 60)}
                      showGradient
                      barBorderRadius={6}
                      disableScroll
                      barMarginBottom={20}
                      showYAxisIndices={false}
                      cappedBars
                      capThickness={2}
                      renderTooltip={(item, index) => {
                        return (
                          <View style={{
                            backgroundColor: theme.colors.surface,
                            padding: 8,
                            borderRadius: 8,
                            elevation: 4,
                            shadowColor: theme.colors.shadow,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            borderWidth: 1,
                            borderColor: theme.colors.outline + '30',
                          }}>
                            <Text style={{ color: theme.colors.text, fontWeight: 'bold' }}>
                              {item.label}: {item.value}
                            </Text>
                            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                              {((item.value / totalPriorityCount) * 100).toFixed(1)}%
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </ScrollView>
                </View>
              ) : (
                <View style={[styles.chartContainer, {
                  backgroundColor: theme.colors.surface + '80',
                  shadowColor: theme.colors.shadow,
                }]}>
                  <PieChart
                    data={priorityPieData.map(item => ({
                      ...item,
                      color: getPriorityColor(item.label.toLowerCase()) + 'E6',
                      gradientCenterColor: getPriorityColor(item.label.toLowerCase()) + '80',
                      focused: false,
                    }))}
                    donut
                    showGradient
                    radius={90}
                    innerRadius={65}
                    innerCircleColor={theme.colors.surface}
                    focusOnPress
                    strokeWidth={0}
                    showText={false}
                    centerLabelComponent={() => (
                      <View style={{ 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: theme.colors.surface,
                        borderRadius: 65,
                        width: 130,
                        height: 130,
                        shadowColor: theme.colors.shadow,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 1,
                      }}>
                        <Text style={{ color: theme.colors.primary, fontSize: 32, fontWeight: 'bold' }}>
                          {totalPriorityCount}
                        </Text>
                        <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, marginTop: -4 }}>
                          Total Habits
                        </Text>
                      </View>
                    )}
                  />
                  
                  <View style={styles.legendContainer}>
                    <View style={{ 
                      flexDirection: 'row', 
                      flexWrap: 'wrap', 
                      justifyContent: 'space-between',
                      marginTop: 10
                    }}>
                      {Object.entries(priorityDistribution)
                        .sort(([, countA], [, countB]) => countB - countA) // Sort by count descending
                        .map(([priority, count]) => (
                          <View key={priority} style={{
                            width: '48%',
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                            <View style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: theme.colors.surface,
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginRight: 8,
                              shadowColor: getPriorityColor(priority),
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.2,
                              shadowRadius: 2,
                              elevation: 1,
                            }}>
                              <Ionicons 
                                name={getPriorityIcon(priority)} 
                                size={14} 
                                color={getPriorityColor(priority)} 
                              />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ 
                                color: theme.colors.text,
                                fontSize: 12,
                                fontWeight: '600',
                                marginBottom: 2,
                              }}>
                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                              </Text>
                              <Text style={{ 
                                color: theme.colors.onSurfaceVariant,
                                fontSize: 10,
                              }}>
                                {count} ({((count / totalPriorityCount) * 100).toFixed(0)}%)
                              </Text>
                            </View>
                          </View>
                      ))}
                    </View>
                  </View>
                </View>
              )
            ) : (
              <Text variant="bodyMedium" style={[styles.emptyText, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder,
                textAlign: 'center',
                marginVertical: 16
              }]}>
                No priority data found. Add habits with priorities to see distribution.
              </Text>
            )}
          </Card.Content>
        </Card>
        
        {/* Weekly Progress Card */}
        <Card style={[styles.card, { 
          backgroundColor: theme.colors.surface,
          borderRadius: theme.roundness * 2,
          elevation: 2,
          marginBottom: 24
        }]}>
          <Card.Content>
            <View style={styles.cardHeaderWithIcon}>
              <Ionicons name="calendar" size={22} color={theme.colors.primary} />
              <Text variant="titleMedium" style={[styles.cardTitle, { 
                color: theme.colors.text,
                fontWeight: 'bold'
              }]}>
                Weekly Progress
              </Text>
            </View>
            
            <Divider style={{ marginVertical: 12 }} />
            
            <View style={styles.weeklyProgressContainer}>
              <Text variant="bodyMedium" style={[styles.comingSoonText, { 
                color: theme.colors.onSurfaceVariant || theme.colors.placeholder,
                textAlign: 'center',
                marginVertical: 16,
                fontStyle: 'italic'
              }]}>
                Weekly progress charts coming soon!
              </Text>
              
              <Ionicons 
                name="bar-chart" 
                size={60} 
                color={theme.colors.primary + '40'} 
                style={{ alignSelf: 'center', marginBottom: 16 }}
              />
            </View>
          </Card.Content>
        </Card>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  // Progress card styles
  progressCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  // Modern Overview Card styles
  overviewCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  overviewTitle: {
    fontSize: 18,
  },
  statItemModern: {
    width: '50%',
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValueModern: {
    fontSize: 24,
  },
  statLabelModern: {
    fontSize: 12,
  },
  progressCardContent: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  progressStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStatText: {
    marginLeft: 6,
    fontSize: 14,
  },
  // Card styles
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    marginLeft: 8,
    fontSize: 18,
  },
  // Stats grid styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  // Achievement styles
  achievementItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 4,
  },
  achievementIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  achievementText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Weekly progress styles
  weeklyProgressContainer: {
    alignItems: 'center',
    padding: 8,
  },
  comingSoonText: {
    fontSize: 14,
  },
  // Empty state styles
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Chart type selector
  chartTypeSelector: {
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    width: '80%',
  },
  // Chart container
  chartContainer: {
    marginVertical: 16,
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  // Legend styles
  legendContainer: {
    width: '100%',
    paddingHorizontal: 4,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendItemIcon: {
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});

export default StatisticsScreen;