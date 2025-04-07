-- Migration file to recreate database schemas
-- Created: 2025-04-07

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS review_history;
DROP TABLE IF EXISTS word_progress;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create unique indexes for users
CREATE UNIQUE INDEX users_email_key ON users(email);
CREATE UNIQUE INDEX users_username_key ON users(username);

-- Create user_progress table
CREATE TABLE user_progress (
    user_id UUID NOT NULL PRIMARY KEY,
    streak INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    CONSTRAINT user_progress_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Create user_preferences table
CREATE TABLE user_preferences (
    user_id UUID NOT NULL PRIMARY KEY,
    daily_goal INTEGER DEFAULT 10,
    new_words_per_day INTEGER DEFAULT 5,
    learning_modes TEXT[] DEFAULT ARRAY['FLASHCARD', 'CONTEXT_GUESS', 'WORD_CONNECTIONS'],
    CONSTRAINT user_preferences_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Create badges table
CREATE TABLE badges (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(255) NOT NULL
);

-- Create user_badges table
CREATE TABLE user_badges (
    user_id UUID NOT NULL,
    badge_id VARCHAR(50) NOT NULL,
    date_earned TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id),
    CONSTRAINT user_badges_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT user_badges_badge_id_fkey 
        FOREIGN KEY (badge_id) 
        REFERENCES badges(id) 
        ON DELETE CASCADE
);

-- Create index for user_badges
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- Create word_progress table
CREATE SEQUENCE word_progress_id_seq;
CREATE TABLE word_progress (
    id INTEGER NOT NULL DEFAULT nextval('word_progress_id_seq'::regclass) PRIMARY KEY,
    word_id INTEGER NOT NULL,
    ease_factor NUMERIC DEFAULT 2.5,
    interval INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    next_review_date TIMESTAMP WITH TIME ZONE,
    last_review_date TIMESTAMP WITH TIME ZONE,
    user_id UUID,
    CONSTRAINT fk_word_id 
        FOREIGN KEY (word_id) 
        REFERENCES words(id),
    CONSTRAINT fk_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id)
);

-- Create review_history table
CREATE SEQUENCE review_history_id_seq;
CREATE TABLE review_history (
    id INTEGER NOT NULL DEFAULT nextval('review_history_id_seq'::regclass) PRIMARY KEY,
    word_progress_id INTEGER,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    score SMALLINT,
    time_spent INTEGER,
    learning_mode VARCHAR(50),
    CONSTRAINT fk_word_progress_id 
        FOREIGN KEY (word_progress_id) 
        REFERENCES word_progress(id)
);