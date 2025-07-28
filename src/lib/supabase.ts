import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Problem = {
  id: string
  user_id: string
  topic: string
  problem_name: string
  problem_link: string
  last_review_date: string
  next_review_date: string
  correct_streak: number
  interval: number
  created_at: string
}

export type Profile = {
  id: string
  username: string
  email: string
  created_at: string
}