import { User, Badge, UserStats, Review, LearningMode } from '../../models';

// Experience points needed per level (increases with each level)
const XP_PER_LEVEL = [
  0,      // Level 0 -> 1
  100,    // Level 1 -> 2
  250,    // Level 2 -> 3
  500,    // Level 3 -> 4
  1000,   // Level 4 -> 5
  1750,   // Level 5 -> 6
  2750,   // Level 6 -> 7
  4000,   // Level 7 -> 8
  5500,   // Level 8 -> 9
  7500,   // Level 9 -> 10
  10000,  // Level 10 -> 11
  13000,  // And so on...
  16500,
  20500,
  25000,
  30000,
  35500,
  41500,
  48000,
  55000,
];

// Badge definitions
const AVAILABLE_BADGES: Omit<Badge, 'dateEarned'>[] = [
  {
    id: 'first_word',
    name: 'First Steps',
    description: 'Learn your first word',
    icon: '🌱'
  },
  {
    id: 'ten_words',
    name: 'Word Collector',
    description: 'Learn 10 different words',
    icon: '📚'
  },
  {
    id: 'fifty_words',
    name: 'Vocabulary Builder',
    description: 'Learn 50 different words',
    icon: '📖'
  },
  {
    id: 'hundred_words',
    name: 'Lexicon Master',
    description: 'Learn 100 different words',
    icon: '🎓'
  },
  {
    id: 'streak_week',
    name: 'Weekly Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥'
  },
  {
    id: 'streak_month',
    name: 'Consistency Champion',
    description: 'Maintain a 30-day streak',
    icon: '⚡'
  },
  {
    id: 'all_modes',
    name: 'Learning Explorer',
    description: 'Try all learning modes',
    icon: '🧭'
  },
  {
    id: 'perfect_day',
    name: 'Perfect Day',
    description: 'Get all reviews correct in a single day',
    icon: '✨'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Study after midnight',
    icon: '🦉'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Study before 6 AM',
    icon: '🐦'
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Study on both Saturday and Sunday in the same weekend',
    icon: '🏆'
  }
];

/**
 * Service to handle gamification features
 */
class GamificationService {
  /**
   * Update user experience points based on learning activity
   * @param user Current user
   * @param score Score from the review (0-5)
   * @param mode Learning mode used
   * @returns Updated user object
   */
  public addExperience(user: User, score: number, mode: LearningMode): User {
    // Base XP for attempting a word
    let xpGained = 5;

    // Bonus XP based on score (0-15 bonus)
    xpGained += score * 3;

    // Bonus for using different learning modes (encourages variety)
    const modeMultiplier = this.getLearningModeMultiplier(mode);
    xpGained = Math.floor(xpGained * modeMultiplier);

    // Create updated user object
    const updatedUser = { ...user };
    updatedUser.progress.experience += xpGained;

    // Check for level up
    const newLevel = this.calculateLevel(updatedUser.progress.experience);
    if (newLevel > updatedUser.progress.level) {
      updatedUser.progress.level = newLevel;
      // In a real app, you might trigger a level-up celebration here
    }

    return updatedUser;
  }

  /**
   * Get XP multiplier for different learning modes
   * Encourages using different modes by giving slightly higher XP
   * @param mode Learning mode
   * @returns XP multiplier
   */
  private getLearningModeMultiplier(mode: LearningMode): number {
    switch (mode) {
      case LearningMode.FLASHCARD:
        return 1.0; // Base multiplier
      case LearningMode.CONTEXT_GUESS:
        return 1.2; // 20% bonus
      case LearningMode.WORD_CONNECTIONS:
        return 1.3; // 30% bonus
      case LearningMode.SENTENCE_FORMATION:
        return 1.5; // 50% bonus
      case LearningMode.SYNONYM_ANTONYM:
        return 1.2; // 20% bonus
      case LearningMode.DEFINITION_MATCH:
        return 1.1; // 10% bonus
      default:
        return 1.0;
    }
  }

  /**
   * Calculate user level based on total experience
   * @param totalXp Total experience points
   * @returns Current level
   */
  private calculateLevel(totalXp: number): number {
    let xpRequired = 0;
    for (let level = 0; level < XP_PER_LEVEL.length; level++) {
      xpRequired += XP_PER_LEVEL[level];
      if (totalXp < xpRequired) {
        return level;
      }
    }

    // For very high levels beyond the predefined table
    const lastDefinedLevel = XP_PER_LEVEL.length;
    const lastXpRequirement = XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
    const additionalLevels = Math.floor(
      (totalXp - xpRequired) / (lastXpRequirement * 1.2)
    );

    return lastDefinedLevel + additionalLevels;
  }

  /**
   * Calculate XP required for the next level
   * @param user User object
   * @returns XP required to reach the next level
   */
  public getXpToNextLevel(user: User): number {
    const currentLevel = user.progress.level;

    // Calculate total XP for current level using a loop instead of reduce
    let totalXpForCurrentLevel = 0;
    for (let i = 0; i < currentLevel; i++) {
      totalXpForCurrentLevel += XP_PER_LEVEL[i];
    }

    const xpForNextLevel = currentLevel < XP_PER_LEVEL.length
      ? XP_PER_LEVEL[currentLevel]
      : Math.floor(XP_PER_LEVEL[XP_PER_LEVEL.length - 1] * 1.2);

    return totalXpForCurrentLevel + xpForNextLevel - user.progress.experience;
  }

  /**
   * Check and update user streak
   * @param user User object
   * @returns Updated user object with streak information
   */
  public updateStreak(user: User): User {
    const updatedUser = { ...user };
    const now = new Date();
    const lastActivity = new Date(user.progress.lastActivity);

    // Calculate days between last activity and now
    const daysBetween = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysBetween === 0) {
      // Same day, no streak change
    } else if (daysBetween === 1) {
      // Next consecutive day, increase streak
      updatedUser.progress.streak += 1;
    } else {
      // Streak broken
      updatedUser.progress.streak = 1;
    }

    // Update last activity
    updatedUser.progress.lastActivity = now;

    return updatedUser;
  }

  /**
   * Check for new badges earned and add them to the user
   * @param user User object
   * @returns Updated user object with any new badges
   */
  public checkForBadges(user: User): User {
    const updatedUser = { ...user };
    const earnedBadgeIds = user.progress.badges.map(badge => badge.id);
    const newBadges: Badge[] = [];

    // Helper function to check if user has a badge
    const hasBadge = (badgeId: string) => earnedBadgeIds.includes(badgeId);

    // Get unique words the user has learned (with score of 3 or higher)
    const learnedWordIds = new Set<string>();
    user.progress.words.forEach(word => {
      if (word.reviewHistory.some(review => review.score >= 3)) {
        learnedWordIds.add(word.wordId);
      }
    });
    const uniqueWordsLearned = learnedWordIds.size;

    // Get unique learning modes used
    const usedModes = new Set<string>();
    user.progress.words.forEach(word => {
      word.reviewHistory.forEach(review => {
        usedModes.add(review.learningMode);
      });
    });

    // Check for word count badges
    if (uniqueWordsLearned >= 1 && !hasBadge('first_word')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'first_word')!,
        dateEarned: new Date()
      });
    }

    if (uniqueWordsLearned >= 10 && !hasBadge('ten_words')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'ten_words')!,
        dateEarned: new Date()
      });
    }

    if (uniqueWordsLearned >= 50 && !hasBadge('fifty_words')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'fifty_words')!,
        dateEarned: new Date()
      });
    }

    if (uniqueWordsLearned >= 100 && !hasBadge('hundred_words')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'hundred_words')!,
        dateEarned: new Date()
      });
    }

    // Check for streak badges
    if (user.progress.streak >= 7 && !hasBadge('streak_week')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'streak_week')!,
        dateEarned: new Date()
      });
    }

    if (user.progress.streak >= 30 && !hasBadge('streak_month')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'streak_month')!,
        dateEarned: new Date()
      });
    }

    // Check for learning modes badge
    if (usedModes.size >= Object.keys(LearningMode).length && !hasBadge('all_modes')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'all_modes')!,
        dateEarned: new Date()
      });
    }

    // Check for time-based badges
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 4 && !hasBadge('night_owl')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'night_owl')!,
        dateEarned: new Date()
      });
    }

    if (hour >= 4 && hour < 6 && !hasBadge('early_bird')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'early_bird')!,
        dateEarned: new Date()
      });
    }

    // Add new badges to the user
    if (newBadges.length > 0) {
      updatedUser.progress.badges = [...updatedUser.progress.badges, ...newBadges];
    }

    return updatedUser;
  }

  /**
   * Calculate user statistics
   * @param user User object
   * @returns User statistics
   */
  public calculateUserStats(user: User): UserStats {
    const words = user.progress.words;

    // Get unique words the user has interacted with
    const uniqueWordIds = new Set(words.map(w => w.wordId));

    // Get words considered "learned" (score of 3 or higher)
    const learnedWordIds = new Set<string>();
    words.forEach(word => {
      if (word.reviewHistory.some(review => review.score >= 3)) {
        learnedWordIds.add(word.wordId);
      }
    });

    // Calculate total reviews using a loop instead of reduce
    let totalReviews = 0;
    for (const word of words) {
      totalReviews += word.reviewHistory.length;
    }

    // Calculate average score across all reviews
    const allScores = words.flatMap(word => word.reviewHistory.map(review => review.score));

    // Calculate sum using a loop instead of reduce
    let scoreSum = 0;
    for (const score of allScores) {
      scoreSum += score;
    }

    const averageScore = allScores.length > 0
      ? scoreSum / allScores.length
      : 0;

    // Calculate total time spent (ms -> minutes)
    // Use loops instead of reduce for better type safety
    let totalTimeMs = 0;
    for (const word of words) {
      let wordTimeMs = 0;
      for (const review of word.reviewHistory) {
        wordTimeMs += review.timeSpent;
      }
      totalTimeMs += wordTimeMs;
    }
    const totalTimeMinutes = Math.round(totalTimeMs / (1000 * 60));

    return {
      wordsLearned: learnedWordIds.size,
      wordsReviewed: uniqueWordIds.size,
      currentStreak: user.progress.streak,
      longestStreak: user.progress.streak, // In a real app, you'd track the longest streak separately
      averageScore,
      totalTimeSpent: totalTimeMinutes,
      level: user.progress.level,
      experienceToNextLevel: this.getXpToNextLevel(user),
      totalExperience: user.progress.experience
    };
  }

  /**
   * Get available badges with information about whether the user has earned them
   * @param user User object
   * @returns Array of badges with earned status
   */
  public getAvailableBadges(user: User): (Omit<Badge, 'dateEarned'> & { earned: boolean, earnedDate?: Date })[] {
    const earnedBadges = user.progress.badges;

    return AVAILABLE_BADGES.map(badge => {
      const earnedBadge = earnedBadges.find(b => b.id === badge.id);
      return {
        ...badge,
        earned: !!earnedBadge,
        earnedDate: earnedBadge?.dateEarned
      };
    });
  }
}

export default new GamificationService();
