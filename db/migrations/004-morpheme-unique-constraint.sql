-- Migration: Change morpheme unique constraint to include origin
-- This allows for morphemes like "a-" to exist with different origins (Greek vs Latin)

-- Drop the existing unique constraint on morpheme column
ALTER TABLE morphemes DROP CONSTRAINT IF EXISTS morphemes_morpheme_key;

-- Create a new unique constraint on morpheme + origin combination
-- Using COALESCE to handle NULL origins (treat NULL as empty string for uniqueness)
CREATE UNIQUE INDEX idx_morphemes_morpheme_origin ON morphemes (morpheme, COALESCE(origin, ''));
