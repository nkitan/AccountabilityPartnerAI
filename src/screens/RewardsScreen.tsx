import React from 'react';
import { StyleSheet, View, ScrollView, FlatList } from 'react-native';
import { useTheme, Text, Title, Card, Paragraph, Button, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

const RewardsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, rewards, addReward, claimReward } = useAppContext();
  
  // Add a sample reward (for demo purposes)
  const addSampleReward = () => {
    const newReward = {
      id: uuidv4(),
      title: 'Achievement Unlocked',
      description: 'Completed 5 days streak on any habit',
      cost: 50,
      icon: 'trophy',
      unlocked: true,
      claimed: false,
      unlockedAt: new Date().toISOString(),
      category: 'achievement' as any
    };
    
    addReward(newReward);
  };
  
  // Claim a reward
  const handleClaimReward = (rewardId: string) => {
    claimReward(rewardId);
  };
  
  // Render a reward card
  const renderRewardCard = ({ item }: any) => {
    return (
      <Card 
        style={[
          styles.rewardCard, 
          { 
            backgroundColor: theme.colors.surface,
            borderColor: item.unlocked ? theme.colors.reward : theme.colors.disabled,
            opacity: item.claimed ? 0.7 : 1
          }
        ]}
      >
        <Card.Content>
          <View style={styles.rewardHeader}>
            <Avatar.Icon 
              size={50} 
              icon={item.icon || 'star'} 
              color="#fff"
              style={{ backgroundColor: item.unlocked ? theme.colors.reward : theme.colors.disabled }}
            />
            <View style={styles.rewardTitleContainer}>
              <Title style={{ color: theme.colors.text }}>{item.title}</Title>
              <Paragraph style={{ color: theme.colors.placeholder }}>{item.description}</Paragraph>
            </View>
          </View>
          
          <View style={styles.rewardFooter}>
            <View style={styles.costContainer}>
              <Ionicons name="star" size={18} color={theme.colors.reward} />
              <Text style={[styles.costText, { color: theme.colors.text }]}>
                {item.cost}
              </Text>
            </View>
            
            {item.unlocked && !item.claimed ? (
              <Button 
                mode="contained" 
                onPress={() => handleClaimReward(item.id)}
                style={[styles.claimButton, { backgroundColor: theme.colors.reward }]}
                disabled={user?.virtualCurrency < item.cost}
              >
                Claim
              </Button>
            ) : item.claimed ? (
              <Button 
                mode="contained" 
                disabled
                style={[styles.claimedButton, { backgroundColor: theme.colors.success }]}
              >
                Claimed
              </Button>
            ) : (
              <Button 
                mode="outlined" 
                disabled
                style={[styles.lockedButton, { borderColor: theme.colors.disabled }]}
                labelStyle={{ color: theme.colors.disabled }}
              >
                Locked
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Title style={[styles.title, { color: theme.colors.text }]}>Rewards</Title>
        
        <View style={styles.balanceContainer}>
          <Ionicons name="star" size={24} color={theme.colors.reward} />
          <Text style={[styles.balanceText, { color: theme.colors.text }]}>
            {user?.virtualCurrency || 0} coins available
          </Text>
        </View>
        
        {rewards.length > 0 ? (
          <FlatList
            data={rewards}
            renderItem={renderRewardCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy" size={80} color={theme.colors.placeholder} />
            <Paragraph style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              No rewards available yet. Complete habits and build streaks to unlock rewards!
            </Paragraph>
          </View>
        )}
        
        {/* Demo button to add sample reward */}
        <Button 
          mode="contained" 
          onPress={addSampleReward}
          style={[styles.demoButton, { backgroundColor: theme.colors.primary }]}
        >
          Add Sample Reward (Demo)
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  rewardCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimButton: {
    paddingHorizontal: 16,
  },
  claimedButton: {
    paddingHorizontal: 16,
  },
  lockedButton: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
  demoButton: {
    marginTop: 24,
  },
});

export default RewardsScreen;