-- Create problems table for spaced repetition learning
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  problem_name TEXT NOT NULL,
  problem_link TEXT NOT NULL,
  last_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '1 day',
  correct_streak INTEGER NOT NULL DEFAULT 0,
  interval INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own problems" 
ON public.problems 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own problems" 
ON public.problems 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problems" 
ON public.problems 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problems" 
ON public.problems 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_problems_updated_at
BEFORE UPDATE ON public.problems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();