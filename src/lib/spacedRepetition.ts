import { addDays, format } from 'date-fns'

export interface ReviewResult {
  nextReviewDate: string
  interval: number
  correctStreak: number
}

export function calculateNextReview(
  isCorrect: boolean,
  currentStreak: number,
  currentInterval: number
): ReviewResult {
  if (!isCorrect) {
    // Reset on failure - review tomorrow
    return {
      nextReviewDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      interval: 1,
      correctStreak: 0
    }
  }

  // Successful review - implement SM-2 algorithm
  const newStreak = currentStreak + 1
  let newInterval: number

  if (newStreak === 1) {
    newInterval = 1 // First success: review in 1 day
  } else if (newStreak === 2) {
    newInterval = 3 // Second success: review in 3 days
  } else {
    // Subsequent successes: roughly double the interval
    newInterval = Math.round(currentInterval * 2.2)
  }

  return {
    nextReviewDate: format(addDays(new Date(), newInterval), 'yyyy-MM-dd'),
    interval: newInterval,
    correctStreak: newStreak
  }
}

export function isReviewDue(nextReviewDate: string): boolean {
  const today = new Date()
  const reviewDate = new Date(nextReviewDate)
  return reviewDate <= today
}

export function getInitialReviewSchedule(): ReviewResult {
  return {
    nextReviewDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    interval: 1,
    correctStreak: 0
  }
}