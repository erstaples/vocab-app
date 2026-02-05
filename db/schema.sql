-- Vocabulary Builder Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User preferences
CREATE TABLE user_preferences (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    daily_goal INTEGER DEFAULT 10,
    preferred_learning_mode VARCHAR(50) DEFAULT 'flashcard',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE
);

-- User stats (denormalized for performance)
CREATE TABLE user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    words_learned INTEGER DEFAULT 0,
    words_mastered INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    last_activity_date DATE
);

-- Words table
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) UNIQUE NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    pronunciation VARCHAR(100),
    etymology TEXT,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Definitions table (one word can have multiple definitions)
CREATE TABLE definitions (
    id SERIAL PRIMARY KEY,
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
    definition TEXT NOT NULL,
    example_sentence TEXT,
    is_primary BOOLEAN DEFAULT FALSE
);

-- Morphemes table (prefixes, roots, suffixes)
CREATE TABLE morphemes (
    id SERIAL PRIMARY KEY,
    morpheme VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('prefix', 'root', 'suffix')),
    meaning VARCHAR(255) NOT NULL,
    origin VARCHAR(50),
    canonical_id INTEGER REFERENCES morphemes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint on morpheme + origin (allows same morpheme with different origins, e.g., "a-" Greek vs Latin)
CREATE UNIQUE INDEX idx_morphemes_morpheme_origin ON morphemes (morpheme, COALESCE(origin, ''));

-- Index for efficient lookups of variants by canonical morpheme
CREATE INDEX idx_morphemes_canonical_id ON morphemes(canonical_id) WHERE canonical_id IS NOT NULL;

-- Word-Morpheme junction table
CREATE TABLE word_morphemes (
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
    morpheme_id INTEGER REFERENCES morphemes(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    PRIMARY KEY (word_id, morpheme_id)
);

-- User word progress (SRS tracking)
CREATE TABLE user_word_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'learning', 'reviewing', 'mastered')),
    ease_factor DECIMAL(4,2) DEFAULT 2.5,
    interval INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    next_review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_review_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, word_id)
);

-- Review history
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 0 AND rating <= 5),
    response_time_ms INTEGER,
    learning_mode VARCHAR(50),
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Badges
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_url VARCHAR(255),
    requirement TEXT NOT NULL,
    xp_bonus INTEGER DEFAULT 0
);

-- User badges
CREATE TABLE user_badges (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);

-- Indexes for performance
CREATE INDEX idx_user_word_progress_user_id ON user_word_progress(user_id);
CREATE INDEX idx_user_word_progress_next_review ON user_word_progress(next_review_date);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_definitions_word_id ON definitions(word_id);
CREATE INDEX idx_word_morphemes_word_id ON word_morphemes(word_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_words_updated_at
    BEFORE UPDATE ON words
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_word_progress_updated_at
    BEFORE UPDATE ON user_word_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default badges
INSERT INTO badges (name, description, requirement, xp_bonus) VALUES
    ('First Steps', 'Learn your first word', 'words_learned >= 1', 10),
    ('Getting Started', 'Learn 10 words', 'words_learned >= 10', 50),
    ('Vocabulary Builder', 'Learn 50 words', 'words_learned >= 50', 100),
    ('Century', 'Learn 100 words', 'words_learned >= 100', 250),
    ('Week Warrior', 'Maintain a 7-day streak', 'current_streak >= 7', 100),
    ('Month Master', 'Maintain a 30-day streak', 'current_streak >= 30', 500),
    ('Perfect Score', 'Get a perfect rating on 10 reviews in a row', 'perfect_streak >= 10', 75),
    ('Speed Demon', 'Complete a review in under 3 seconds', 'fast_review', 25),
    ('Night Owl', 'Study after midnight', 'night_study', 15),
    ('Early Bird', 'Study before 6 AM', 'early_study', 15);
