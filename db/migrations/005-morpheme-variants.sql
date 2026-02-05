-- Migration: Add support for morpheme variants (assimilation forms)
-- Variants reference their canonical (base) morpheme

-- Add canonical_id column to morphemes table
-- NULL means this is a canonical morpheme, non-NULL means it's a variant
ALTER TABLE morphemes ADD COLUMN canonical_id INTEGER REFERENCES morphemes(id) ON DELETE SET NULL;

-- Create index for efficient lookups of variants by canonical morpheme
CREATE INDEX idx_morphemes_canonical_id ON morphemes(canonical_id) WHERE canonical_id IS NOT NULL;

-- Example usage:
-- INSERT INTO morphemes (morpheme, type, meaning, origin) VALUES ('ad-', 'prefix', 'to, toward', 'Latin');
-- -- Get the id of ad-, let's say it's 1
-- INSERT INTO morphemes (morpheme, type, meaning, origin, canonical_id) VALUES ('ac-', 'prefix', 'to, toward', 'Latin', 1);
-- INSERT INTO morphemes (morpheme, type, meaning, origin, canonical_id) VALUES ('af-', 'prefix', 'to, toward', 'Latin', 1);
-- etc.
