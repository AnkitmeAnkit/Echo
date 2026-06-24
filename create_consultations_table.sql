-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cmervqrrwhydjppeftrp/editor

CREATE TABLE IF NOT EXISTS consultations (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name     text        NOT NULL,
  email         text        NOT NULL,
  phone         text        NOT NULL,
  details       text        NOT NULL,
  submitted_at  timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anonymous visitors) to INSERT
CREATE POLICY "Allow public inserts" ON consultations
  FOR INSERT WITH CHECK (true);
