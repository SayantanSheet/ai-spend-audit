CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  total_spend NUMERIC,
  potential_savings NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Protect table with RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (only inserts, no reads or updates)
CREATE POLICY "Allow anonymous inserts on leads" 
ON leads FOR INSERT 
TO anon 
WITH CHECK (true);
