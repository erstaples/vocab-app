import { User, Badge, UserStats, LearningMode } from '../../models';
import apiService from '../api';

// Experience points chart kept for reference
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

// Badge definitions kept for reference
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
 * Now delegates to the backend API
 */
class GamificationService {
  /**
   * Legacy: Update user experience points based on learning activity
   * @param user Current user
   * @param score Score from the review (0-5)
   * @param mode Learning mode used
   * @returns Updated user object
   */
  public addExperience(user: User, score: number, mode: LearningMode): User;

  /**
   * API: Update user experience points via backend API
   * @param userId User ID
   * @param score Score from the review (0-5)
   * @param mode Learning mode used
   * @returns Promise with updated user
   */
  public addExperience(userId: string, score: number, mode: LearningMode): Promise<User>;

  /**
   * Implementation for both local and API versions
   */
  public addExperience(
    userOrUserId: User | string,
    score: number,
    mode: LearningMode
  ): User | Promise<User> {
    // If a User object is passed, use the legacy implementation
    if (typeof userOrUserId !== 'string') {
      console.warn('Using deprecated addExperience method - update to use API version');
      return this.addExperienceLocal(userOrUserId, score, mode);
    }
    
    // If a userId is passed, use the API implementation
    return this.addExperienceApi(userOrUserId, score, mode);
  }

  /**
   * Local implementation of adding experience
   */
  private addExperienceLocal(user: User, score: number, mode: LearningMode): User {
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
    }

    return updatedUser;
  }

  /**
   * API implementation of adding experience
   */
  private async addExperienceApi(userId: string, score: number, mode: LearningMode): Promise<User> {
    try {
      // The recordReview API endpoint handles adding experience and updating the user
      // This is a side effect of recording reviews
      // If needed, we could also add a dedicated experience endpoint
      
      // Get the current user
      const user = await apiService.getUserById(userId);
      
      // Call the check-badges endpoint to trigger badge checking
      await apiService.fetchJSON(`/users/${userId}/check-badges`, {
        method: 'POST'
      });
      
      // Return the updated user
      return user;
    } catch (error) {
      console.error('Error adding experience via API:', error);
      throw error;
    }
  }

  /**
   * Legacy: Update user streak
   * @param user User object
   * @returns Updated user with streak information
   */
  public updateStreak(user: User): User;

  /**
   * API: Update user streak via backend API
   * @param userId User ID
   * @returns Promise with updated user
   */
  public updateStreak(userId: string): Promise<User>;

  /**
   * Implementation for both local and API versions
   */
  public updateStreak(userOrUserId: User | string): User | Promise<User> {
    // If a User object is passed, use the legacy implementation
    if (typeof userOrUserId !== 'string') {
      console.warn('Using deprecated updateStreak method - update to use API version');
      return this.updateStreakLocal(userOrUserId);
    }
    
    // If a userId is passed, use the API implementation
    return this.updateStreakApi(userOrUserId);
  }

  /**
   * Local implementation of updating streak
   */
  private updateStreakLocal(user: User): User {
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
   * API implementation of updating streak
   */
  private async updateStreakApi(userId: string): Promise<User> {
    try {
      // Call the update-streak API endpoint
      const response = await apiService.fetchJSON<User>(`/users/${userId}/update-streak`, {
        method: 'POST'
      });
      
      return response;
    } catch (error) {
      console.error('Error updating streak via API:', error);
      throw error;
    }
  }

  /**
   * Legacy: Check for new badges
   * @param user User object
   * @returns Updated user with any new badges
   */
  public checkForBadges(user: User): User;

  /**
   * API: Check for new badges via backend API
   * @param userId User ID
   * @returns Promise with updated user
   */
  public checkForBadges(userId: string): Promise<User>;

  /**
   * Implementation for both local and API versions
   */
  public checkForBadges(userOrUserId: User | string): User | Promise<User> {
    // If a User object is passed, use the legacy implementation
    if (typeof userOrUserId !== 'string') {
      console.warn('Using deprecated checkForBadges method - update to use API version');
      return this.checkForBadgesLocal(userOrUserId);
    }
    
    // If a userId is passed, use the API implementation
    return this.checkForBadgesApi(userOrUserId);
  }

  /**
   * Local implementation of checking for badges
   */
  private checkForBadgesLocal(user: User): User {
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

    // Check for badges
    this.checkWordCountBadges(uniqueWordsLearned, hasBadge, newBadges);
    this.checkStreakBadges(user.progress.streak, hasBadge, newBadges);
    this.checkModeBadges(usedModes.size, hasBadge, newBadges);
    this.checkTimeBadges(hasBadge, newBadges);

    // Add new badges to the user
    if (newBadges.length > 0) {
      updatedUser.progress.badges = [...updatedUser.progress.badges, ...newBadges];
    }

    return updatedUser;
  }

  /**
   * API implementation of checking for badges
   */
  private async checkForBadgesApi(userId: string): Promise<User> {
    try {
      // Call the check-badges API endpoint
      const response = await apiService.fetchJSON<User>(`/users/${userId}/check-badges`, {
        method: 'POST'
      });
      
      return response;
    } catch (error) {
      console.error('Error checking badges via API:', error);
      throw error;
    }
  }

  /**
   * Legacy: Calculate user statistics from user object (for backward compatibility)
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

    // Calculate total reviews using a loop
    let totalReviews = 0;
    for (const word of words) {
      totalReviews += word.reviewHistory.length;
    }

    // Calculate average score across all reviews
    const allScores = words.flatMap(word => word.reviewHistory.map(review => review.score));

    // Calculate sum using a loop
    let scoreSum = 0;
    for (const score of allScores) {
      scoreSum += score;
    }

    const averageScore = allScores.length > 0
      ? scoreSum / allScores.length
      : 0;

    // Calculate total time spent (ms -> minutes)
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
   * API: Get user statistics from backend API
   * @param userId User ID
   * @returns Promise with user statistics
   */
  public async getUserStats(userId: string): Promise<UserStats> {
    try {
      return await apiService.getUserStats(userId);
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Legacy: Get available badges with earned status (local computation)
   * @param user User object
   * @returns Array of badges with earned status
   */
  public getAvailableBadges(user: User): (Omit<Badge, 'dateEarned'> & { earned: boolean, earnedDate?: Date })[];

  /**
   * API: Get available badges from backend API
   * @param userId User ID
   * @returns Promise with array of badges
   */
  public getAvailableBadges(userId: string): Promise<any[]>;

  /**
   * Implementation for both local and API versions
   */
  public getAvailableBadges(
    userOrUserId: User | string
  ): (Omit<Badge, 'dateEarned'> & { earned: boolean, earnedDate?: Date })[] | Promise<any[]> {
    // If a User object is passed, use the legacy implementation
    if (typeof userOrUserId !== 'string') {
      console.warn('Using deprecated getAvailableBadges method - update to use API version');
      return this.getAvailableBadgesLocal(userOrUserId);
    }
    
    // If a userId is passed, use the API implementation
    return this.getAvailableBadgesApi(userOrUserId);
  }

  /**
   * Local implementation of getting available badges
   */
  private getAvailableBadgesLocal(user: User): (Omit<Badge, 'dateEarned'> & { earned: boolean, earnedDate?: Date })[] {
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

  /**
   * API implementation of getting available badges
   */
  private async getAvailableBadgesApi(userId: string): Promise<any[]> {
    try {
      return await apiService.getBadges(userId);
    } catch (error) {
      console.error('Error getting badges via API:', error);
      throw error;
    }
  }

  // Helper methods for the local badge checking implementation
  private checkWordCountBadges(
    uniqueWordsLearned: number, 
    hasBadge: (id: string) => boolean, 
    newBadges: Badge[]
  ): void {
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
  }

  private checkStreakBadges(
    streak: number, 
    hasBadge: (id: string) => boolean, 
    newBadges: Badge[]
  ): void {
    if (streak >= 7 && !hasBadge('streak_week')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'streak_week')!,
        dateEarned: new Date()
      });
    }

    if (streak >= 30 && !hasBadge('streak_month')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'streak_month')!,
        dateEarned: new Date()
      });
    }
  }

  private checkModeBadges(
    usedModesCount: number, 
    hasBadge: (id: string) => boolean, 
    newBadges: Badge[]
  ): void {
    if (usedModesCount >= Object.keys(LearningMode).length && !hasBadge('all_modes')) {
      newBadges.push({
        ...AVAILABLE_BADGES.find(badge => badge.id === 'all_modes')!,
        dateEarned: new Date()
      });
    }
  }

  private checkTimeBadges(
    hasBadge: (id: string) => boolean, 
    newBadges: Badge[]
  ): void {
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
  }

  /**
   * Get XP multiplier for different learning modes
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
}

// Export a singleton instance
const gamificationService = new GamificationService();
export default gamificationService;
