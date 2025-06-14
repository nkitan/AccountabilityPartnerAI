import { Habit, CheckIn, AIMessage, UserMessage } from '../types';
import { v7 as uuidv7 } from 'uuid';

// This is a mock AI service that simulates AI responses
// In a real app, this would connect to an actual AI service

class AIPartnerService {
  // Generate a welcome message when user first joins
  generateWelcomeMessage(): AIMessage {
    const welcomeMessages = [
      "Hi there! I'm your new accountability partner. I'm here to help you build great habits and achieve your goals. What would you like to work on first?",
      "Welcome! I'm excited to be your accountability partner on this journey. Together, we'll make sure you stay on track with your goals. What habits are you looking to develop?",
      "Hello! I'm your AI accountability buddy. I'm here to support, encourage, and sometimes give you that little push you need. What goals shall we tackle together?",
      "Great to meet you! As your accountability partner, I'll help you stay consistent with your habits. What areas of your life would you like to improve?"
    ];

    return {
      id: uuidv7(),
      content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
      timestamp: new Date().toISOString(),
      type: 'encouragement',
      read: false
    };
  }

  // Generate a response to a user message
  generateResponse(userMessage: UserMessage, habits: Habit[]): AIMessage {
    // Simple keyword-based response system
    const lowerCaseMessage = userMessage.content.toLowerCase();
    
    // Check for specific keywords
    if (lowerCaseMessage.includes('tired') || lowerCaseMessage.includes('exhausted') || lowerCaseMessage.includes('can\'t do it')) {
      return this.generateEncouragementMessage(habits);
    } else if (lowerCaseMessage.includes('completed') || lowerCaseMessage.includes('finished') || lowerCaseMessage.includes('done')) {
      return this.generateCelebrationMessage(habits);
    } else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('advice') || lowerCaseMessage.includes('suggestion')) {
      return this.generateAdviceMessage(habits);
    } else if (lowerCaseMessage.includes('goal') || lowerCaseMessage.includes('target') || lowerCaseMessage.includes('objective')) {
      return this.generateGoalSettingMessage();
    } else {
      // Generic response
      const genericResponses = [
        "I'm here to support you! How can I help you with your habits today?",
        "Thanks for checking in. How are you progressing with your goals?",
        "I'm your accountability partner - let me know how I can help you stay on track.",
        "Remember, consistency is key to forming good habits. How can I help you today?"
      ];
      
      return {
        id: uuidv7(),
        content: genericResponses[Math.floor(Math.random() * genericResponses.length)],
        timestamp: new Date().toISOString(),
        type: 'feedback',
        read: false
      };
    }
  }

  // Generate a reminder message for a habit
  generateReminderMessage(habit: Habit): AIMessage {
    const reminderMessages = [
      `Hey there! Just a friendly reminder about your "${habit.title}" habit. Time to get it done!`,
      `Don't forget about your "${habit.title}" habit today. You've got this!`,
      `Quick reminder: It's time for "${habit.title}". Keeping up your streak depends on it!`,
      `Your "${habit.title}" habit is waiting for you. A few minutes now will help build your long-term success.`
    ];

    return {
      id: uuidv7(),
      content: reminderMessages[Math.floor(Math.random() * reminderMessages.length)],
      timestamp: new Date().toISOString(),
      type: 'reminder',
      read: false,
      relatedHabitId: habit.id
    };
  }

  // Generate an encouragement message
  generateEncouragementMessage(habits: Habit[]): AIMessage {
    const habitWithLongestStreak = habits.length > 0 
      ? habits.reduce((prev, current) => (prev.streakCount > current.streakCount) ? prev : current) 
      : null;
    
    const encouragementMessages = [
      "I know it can be tough sometimes, but remember why you started. Each small step matters!",
      "It's okay to feel tired. Take a short break, then get back to it. You've come too far to give up now.",
      "Progress isn't always linear. The fact that you're trying already puts you ahead of most people.",
      "Remember: discipline is choosing between what you want now and what you want most."
    ];

    let message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    
    if (habitWithLongestStreak && habitWithLongestStreak.streakCount > 3) {
      message += ` Look at your ${habitWithLongestStreak.title} habit - you've kept a ${habitWithLongestStreak.streakCount}-day streak! That's the same determination you can bring to this challenge.`;
    }

    return {
      id: uuidv7(),
      content: message,
      timestamp: new Date().toISOString(),
      type: 'encouragement',
      read: false
    };
  }

  // Generate a celebration message for completed habits
  generateCelebrationMessage(habits: Habit[]): AIMessage {
    const recentlyCompletedHabit = habits.find(habit => 
      habit.completedDates.includes(new Date().toISOString().split('T')[0])
    );

    const celebrationMessages = [
      "Fantastic job! Every completed task builds momentum toward your bigger goals.",
      "Way to go! Consistency is the key to transformation, and you're nailing it.",
      "Excellent work! It's these daily wins that add up to major life changes.",
      "You did it! Remember this feeling of accomplishment - it's what building good habits is all about."
    ];

    let message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    
    if (recentlyCompletedHabit) {
      if (recentlyCompletedHabit.streakCount > 0) {
        message += ` You're on a ${recentlyCompletedHabit.streakCount}-day streak with ${recentlyCompletedHabit.title}. Keep it up!`;
      }
    }

    return {
      id: uuidv7(),
      content: message,
      timestamp: new Date().toISOString(),
      type: 'celebration',
      read: false,
      relatedHabitId: recentlyCompletedHabit?.id
    };
  }

  // Generate a feedback message based on check-ins
  generateFeedbackMessage(habit: Habit, checkIns: CheckIn[]): AIMessage {
    const habitCheckIns = checkIns.filter(checkIn => checkIn.habitId === habit.id);
    const completionRate = habitCheckIns.length > 0 
      ? habitCheckIns.filter(checkIn => checkIn.completed).length / habitCheckIns.length 
      : 0;
    
    let message = '';
    
    if (completionRate >= 0.8) {
      message = `You're doing amazingly well with your "${habit.title}" habit! With an ${Math.round(completionRate * 100)}% completion rate, you're building a solid foundation. Keep up the excellent work!`;
    } else if (completionRate >= 0.5) {
      message = `You're making good progress with your "${habit.title}" habit. Your completion rate is ${Math.round(completionRate * 100)}%. What obstacles are you facing on the days you miss? Let's work on strategies to overcome them.`;
    } else if (habitCheckIns.length > 0) {
      message = `I've noticed you're having some challenges with your "${habit.title}" habit (${Math.round(completionRate * 100)}% completion rate). Let's revisit this goal - maybe we need to adjust it to make it more achievable or find a better time in your day for it.`;
    } else {
      message = `It looks like we haven't tracked any progress for your "${habit.title}" habit yet. Would you like to set up a specific time to work on this habit?`;
    }

    return {
      id: uuidv7(),
      content: message,
      timestamp: new Date().toISOString(),
      type: 'feedback',
      read: false,
      relatedHabitId: habit.id
    };
  }

  // Generate a challenge message to push the user
  generateChallengeMessage(habits: Habit[]): AIMessage {
    const incompleteHabits = habits.filter(habit => 
      !habit.completedDates.includes(new Date().toISOString().split('T')[0]) && habit.active
    );
    
    let message = '';
    
    if (incompleteHabits.length > 0) {
      const randomHabit = incompleteHabits[Math.floor(Math.random() * incompleteHabits.length)];
      
      const challengeMessages = [
        `I challenge you to complete your "${randomHabit.title}" habit right now. No excuses - just 10 minutes of focused effort. Can you do that?`,
        `Here's a challenge: do your "${randomHabit.title}" habit today, but make it slightly more challenging than usual. Push your boundaries a little!`,
        `Challenge time! Complete your "${randomHabit.title}" habit today and send me a message right after you finish. I'll be waiting to hear from you.`,
        `I believe you can do more than you think. Today, I challenge you to not only complete your "${randomHabit.title}" habit but to do it with full focus and intention.`
      ];
      
      message = challengeMessages[Math.floor(Math.random() * challengeMessages.length)];
    } else {
      message = "I see you've completed all your habits for today - impressive! Here's a bonus challenge: think of one small additional action you could take today that aligns with your long-term goals. Ready to go above and beyond?";
    }

    return {
      id: uuidv7(),
      content: message,
      timestamp: new Date().toISOString(),
      type: 'challenge',
      read: false
    };
  }

  // Generate advice for habit formation
  generateAdviceMessage(habits: Habit[]): AIMessage {
    const adviceMessages = [
      "Try habit stacking - attach your new habit to an existing one. For example, 'After I brush my teeth, I will meditate for 2 minutes.'",
      "Make your habit incredibly small to start. Want to read more? Begin with just one page per day. Consistency matters more than quantity.",
      "Design your environment for success. Make good habits obvious and easy, and bad habits invisible and difficult.",
      "Track your habits visually. The simple act of marking an X on a calendar can be surprisingly motivating.",
      "Use the 2-minute rule: Scale down any habit to something that takes just 2 minutes to start. This overcomes the initial resistance.",
      "Identify your habit triggers. Understanding what prompts your behaviors helps you change them.",
      "Join an accountability group or find a habit partner. Social expectations are powerful motivators."
    ];

    return {
      id: uuidv7(),
      content: adviceMessages[Math.floor(Math.random() * adviceMessages.length)],
      timestamp: new Date().toISOString(),
      type: 'feedback',
      read: false
    };
  }

  // Generate a message about goal setting
  generateGoalSettingMessage(): AIMessage {
    const goalMessages = [
      "When setting goals, use the SMART framework: Specific, Measurable, Achievable, Relevant, and Time-bound. This turns vague intentions into clear targets.",
      "Consider breaking your big goal into smaller milestones. Each milestone gives you a chance to celebrate and maintain motivation.",
      "Make sure your goals align with your values. The most sustainable habits are those that connect to what truly matters to you.",
      "Try setting process goals (what you'll do) rather than outcome goals (what you'll achieve). Focus on 'I will walk for 20 minutes daily' rather than 'I will lose 10 pounds.'"
    ];

    return {
      id: uuidv7(),
      content: goalMessages[Math.floor(Math.random() * goalMessages.length)],
      timestamp: new Date().toISOString(),
      type: 'feedback',
      read: false
    };
  }

  // Generate a weekly review of progress
  generateWeeklyReview(habits: Habit[], checkIns: CheckIn[]): AIMessage {
    // Get check-ins from the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentCheckIns = checkIns.filter(checkIn => 
      new Date(checkIn.date) >= oneWeekAgo
    );
    
    // Calculate completion rate for each habit
    const habitStats = habits.map(habit => {
      const habitCheckIns = recentCheckIns.filter(checkIn => checkIn.habitId === habit.id);
      const completionRate = habitCheckIns.length > 0 
        ? habitCheckIns.filter(checkIn => checkIn.completed).length / habitCheckIns.length 
        : 0;
      
      return {
        habit,
        completionRate,
        checkInsCount: habitCheckIns.length
      };
    });
    
    // Find best and worst performing habits
    const activeHabitStats = habitStats.filter(stats => stats.habit.active && stats.checkInsCount > 0);
    const bestHabit = activeHabitStats.length > 0 
      ? activeHabitStats.reduce((prev, current) => (prev.completionRate > current.completionRate) ? prev : current) 
      : null;
    const worstHabit = activeHabitStats.length > 0 
      ? activeHabitStats.reduce((prev, current) => (prev.completionRate < current.completionRate) ? prev : current) 
      : null;
    
    // Calculate overall stats
    const totalCheckIns = recentCheckIns.length;
    const completedCheckIns = recentCheckIns.filter(checkIn => checkIn.completed).length;
    const overallCompletionRate = totalCheckIns > 0 ? completedCheckIns / totalCheckIns : 0;
    
    // Generate the review message
    let message = `📊 **Weekly Progress Review** 📊\n\n`;
    
    message += `Overall, you completed ${completedCheckIns} out of ${totalCheckIns} planned activities this week (${Math.round(overallCompletionRate * 100)}%).\n\n`;
    
    if (bestHabit && bestHabit.completionRate > 0) {
      message += `🌟 Your strongest habit was "${bestHabit.habit.title}" with a ${Math.round(bestHabit.completionRate * 100)}% completion rate. Great job!\n\n`;
    }
    
    if (worstHabit && worstHabit.completionRate < 1) {
      message += `💪 You might want to focus more on "${worstHabit.habit.title}" next week, which had a ${Math.round(worstHabit.completionRate * 100)}% completion rate.\n\n`;
    }
    
    // Add streak information
    const streakHabits = habits.filter(habit => habit.streakCount > 0);
    if (streakHabits.length > 0) {
      const topStreakHabit = streakHabits.reduce((prev, current) => (prev.streakCount > current.streakCount) ? prev : current);
      message += `🔥 Your longest current streak is ${topStreakHabit.streakCount} days for "${topStreakHabit.title}"!\n\n`;
    }
    
    // Add encouragement and next steps
    if (overallCompletionRate >= 0.8) {
      message += `Excellent week! You're showing great consistency. For next week, consider adding a new challenge or increasing the difficulty of an existing habit slightly.`;
    } else if (overallCompletionRate >= 0.5) {
      message += `Good progress this week! To improve further, try to identify what made the difference between the days you completed your habits and the days you didn't.`;
    } else {
      message += `This week had some challenges, but that's part of the journey. Let's simplify your habits or adjust your schedule to make them more achievable next week.`;
    }

    return {
      id: uuidv7(),
      content: message,
      timestamp: new Date().toISOString(),
      type: 'feedback',
      read: false
    };
  }
}

export default new AIPartnerService();