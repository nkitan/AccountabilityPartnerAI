# AI Accountability Partner

A beautiful mobile application that acts as an accountability partner for users, helping them form good habits through AI-powered nudges, gamification, and mobile notifications.

## Features

- **AI Accountability Partner**: Intelligent AI that helps users stay on track with their goals
- **Habit Tracking**: Create and track habits across various domains (work, fitness, mindfulness, etc.)
- **Streak-based Rewards**: Earn virtual currency for maintaining streaks
- **Smart Notifications**: Adaptive notifications based on user behavior
- **Beautiful UI**: Clean, modern interface with both light and dark themes
- **Cross-platform**: Works on iOS, Android, and iPad OS

## Core Responsibilities of the AI Partner

1. **Define Clear Goals** – Help set realistic, time-bound goals and revisit them often
2. **Check In Consistently** – Stick to a regular schedule, even short check-ins work
3. **Give Honest Feedback** – Supportive, constructive, and respectful
4. **Celebrate Progress** – Acknowledge both big and small wins
5. **Call You Out Kindly** – Challenge excuses without judgment

## Tech Stack

- React Native / Expo
- TypeScript
- React Navigation
- React Native Paper (UI components)
- AsyncStorage (local data persistence)
- Expo Notifications

## Project Structure

```
src/
├── assets/         # Images, fonts, etc.
├── components/     # Reusable UI components
├── context/        # React context for state management
├── hooks/          # Custom React hooks
├── navigation/     # Navigation configuration
├── screens/        # Main app screens
├── services/       # API and other services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Follow the instructions to open the app on your device or emulator

## Screens

- **Onboarding**: Introduction to the app and its features
- **Home**: Dashboard with today's habits and AI partner messages
- **Habits**: List and manage all habits
- **Chat**: Conversational interface with the AI partner
- **Profile**: User profile, stats, and settings
- **Settings**: App configuration
- **Rewards**: View and claim rewards
- **Notifications**: View all notifications
- **Statistics**: Detailed progress statistics

## Future Enhancements

- Integration with a real AI service for more intelligent interactions
- Social features to connect with friends for accountability
- More detailed analytics and insights
- Integration with health and fitness apps
- Custom themes and personalization options

## License

This project is licensed under the MIT License - see the LICENSE file for details.