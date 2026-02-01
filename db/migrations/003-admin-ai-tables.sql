-- Admin Panel and AI Integration Tables Migration
-- This migration adds tables for admin settings and AI generation logging

-- Admin settings (for storing configuration)
CREATE TABLE IF NOT EXISTS admin_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    encrypted BOOLEAN DEFAULT FALSE,
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI generation audit log
CREATE TABLE IF NOT EXISTS ai_generation_log (
    id SERIAL PRIMARY KEY,
    admin_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    operation_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    tokens_used INTEGER,
    provider VARCHAR(50),
    model VARCHAR(100),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_log_status ON ai_generation_log(status);
CREATE INDEX IF NOT EXISTS idx_ai_log_admin_user ON ai_generation_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_created_at ON ai_generation_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(key);
