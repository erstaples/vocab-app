-- Create morphemes table
CREATE TABLE morphemes (
  id SERIAL PRIMARY KEY,
  value VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('prefix', 'root', 'suffix', 'free', 'infix', 'bound')),
  meaning TEXT NOT NULL,
  language_origin VARCHAR(50),
  examples TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create word-morpheme relations table
CREATE TABLE word_morphemes (
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  morpheme_id INTEGER REFERENCES morphemes(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (word_id, morpheme_id)
);

-- Create word family relations table
CREATE TABLE word_families (
  base_word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  related_word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  relationship_type VARCHAR(20) NOT NULL CHECK (relationship_type IN ('derivative', 'compound', 'variant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (base_word_id, related_word_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_morphemes_type ON morphemes(type);
CREATE INDEX idx_morphemes_language_origin ON morphemes(language_origin);
CREATE INDEX idx_word_morphemes_morpheme_id ON word_morphemes(morpheme_id);
CREATE INDEX idx_word_families_related_word_id ON word_families(related_word_id);

-- Add etymology columns to words table
ALTER TABLE words 
ADD COLUMN etymology_origin VARCHAR(50),
ADD COLUMN etymology_period VARCHAR(50),
ADD COLUMN etymology_development TEXT[];