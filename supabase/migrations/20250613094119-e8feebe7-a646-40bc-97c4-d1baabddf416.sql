-- Create games table to store game sessions
CREATE TABLE public.games (
  id TEXT PRIMARY KEY,
  host_id TEXT, -- Changed from UUID to TEXT since we're not using auth
  host_name TEXT NOT NULL,
  is_started BOOLEAN DEFAULT FALSE,
  is_finished BOOLEAN DEFAULT FALSE,
  current_question_index INTEGER DEFAULT 0,
  show_results BOOLEAN DEFAULT FALSE,
  time_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create players table to store players in each game
CREATE TABLE public.players (
  id TEXT PRIMARY KEY, -- Changed from UUID to TEXT
  game_id TEXT REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  current_answer INTEGER,
  time_to_answer INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create game_questions table to store questions for each game
CREATE TABLE public.game_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id TEXT REFERENCES public.games(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  time_limit INTEGER DEFAULT 15,
  UNIQUE(game_id, question_index)
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for games table
CREATE POLICY "Anyone can view games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Anyone can create games" ON public.games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON public.games FOR UPDATE USING (true);

-- Create policies for players table
CREATE POLICY "Anyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can join games" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);

-- Create policies for game_questions table
CREATE POLICY "Anyone can view game questions" ON public.game_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can create game questions" ON public.game_questions FOR INSERT WITH CHECK (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_questions;
