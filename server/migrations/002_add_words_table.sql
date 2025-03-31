-- Create words table
CREATE TABLE IF NOT EXISTS words (
    id VARCHAR(255) PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    pronunciation VARCHAR(255),
    example TEXT,
    synonyms TEXT[],
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
    etymology TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for full-text search
CREATE INDEX IF NOT EXISTS idx_words_value ON words(value);

-- Index for difficulty level filtering
CREATE INDEX IF NOT EXISTS idx_words_difficulty ON words(difficulty);