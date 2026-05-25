-- Create the query_history table if it doesn't exist at all
CREATE TABLE IF NOT EXISTS public.query_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    original_query TEXT NOT NULL,
    optimized_query TEXT NOT NULL,
    performance_gain TEXT NOT NULL,
    explanation TEXT NOT NULL,
    db_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add new columns to existing table
ALTER TABLE public.query_history 
    ADD COLUMN IF NOT EXISTS issues_found JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS index_suggestions JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS index_sql JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS complexity_score INTEGER,
    ADD COLUMN IF NOT EXISTS estimated_execution_time_before TEXT,
    ADD COLUMN IF NOT EXISTS estimated_execution_time_after TEXT,
    ADD COLUMN IF NOT EXISTS query_risk_level TEXT,
    ADD COLUMN IF NOT EXISTS detected_risks JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Enable Row Level Security (RLS)
ALTER TABLE public.query_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running this script cleanly)
DROP POLICY IF EXISTS "Users can view their own history" ON public.query_history;
DROP POLICY IF EXISTS "Users can insert their own history" ON public.query_history;
DROP POLICY IF EXISTS "Users can delete their own history" ON public.query_history;

-- Policy: Users can only SELECT their own rows
CREATE POLICY "Users can view their own history" 
ON public.query_history
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can only INSERT their own rows
CREATE POLICY "Users can insert their own history" 
ON public.query_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own rows
CREATE POLICY "Users can delete their own history" 
ON public.query_history
FOR DELETE
USING (auth.uid() = user_id);

-- Policy: Anyone can view public queries
CREATE POLICY "Anyone can view public queries"
ON public.query_history
FOR SELECT
USING (is_public = true);
