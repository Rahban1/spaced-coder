import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Problem } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { getInitialReviewSchedule, calculateNextReview, isReviewDue } from '@/lib/spacedRepetition'
import { format } from 'date-fns'

export function useProblems() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: problems = [], isLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Problem[]
    },
  })

  const { data: dueProblems = [] } = useQuery({
    queryKey: ['problems', 'due'],
    queryFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .lte('next_review_date', today)
        .order('next_review_date', { ascending: true })

      if (error) throw error
      return data as Problem[]
    },
  })

  const addProblem = useMutation({
    mutationFn: async (problem: {
      topic: string
      problemName: string
      problemLink: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const schedule = getInitialReviewSchedule()
      
      const { data, error } = await supabase
        .from('problems')
        .insert([
          {
            user_id: user.id,
            topic: problem.topic,
            problem_name: problem.problemName,
            problem_link: problem.problemLink,
            last_review_date: format(new Date(), 'yyyy-MM-dd'),
            next_review_date: schedule.nextReviewDate,
            correct_streak: schedule.correctStreak,
            interval: schedule.interval,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      toast({
        title: 'Success!',
        description: 'Problem added successfully.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const reviewProblem = useMutation({
    mutationFn: async ({
      problemId,
      isCorrect,
      currentStreak,
      currentInterval,
    }: {
      problemId: string
      isCorrect: boolean
      currentStreak: number
      currentInterval: number
    }) => {
      const review = calculateNextReview(isCorrect, currentStreak, currentInterval)
      
      const { data, error } = await supabase
        .from('problems')
        .update({
          last_review_date: format(new Date(), 'yyyy-MM-dd'),
          next_review_date: review.nextReviewDate,
          correct_streak: review.correctStreak,
          interval: review.interval,
        })
        .eq('id', problemId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      toast({
        title: variables.isCorrect ? 'Great job!' : 'Keep practicing!',
        description: variables.isCorrect 
          ? 'Problem marked as remembered.' 
          : 'Problem scheduled for review tomorrow.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    problems,
    dueProblems,
    isLoading,
    addProblem,
    reviewProblem,
  }
}