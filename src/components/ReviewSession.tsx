import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useProblems } from '@/hooks/useProblems'
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  Cross1Icon, 
  ExternalLinkIcon,
  LightningBoltIcon,
  CalendarIcon
} from '@radix-ui/react-icons'

interface ReviewSessionProps {
  onClose: () => void
}

export function ReviewSession({ onClose }: ReviewSessionProps) {
  const { dueProblems, reviewProblem } = useProblems()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewedCount, setReviewedCount] = useState(0)

  const currentProblem = dueProblems[currentIndex]
  const progress = ((reviewedCount) / dueProblems.length) * 100

  const handleReview = async (isCorrect: boolean) => {
    if (!currentProblem) return

    await reviewProblem.mutateAsync({
      problemId: currentProblem.id,
      isCorrect,
      currentStreak: currentProblem.correct_streak,
      currentInterval: currentProblem.interval,
    })

    setReviewedCount(prev => prev + 1)

    if (currentIndex < dueProblems.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Session complete
      onClose()
    }
  }

  if (!currentProblem) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <LightningBoltIcon className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Review Complete!</h3>
        <p className="text-muted-foreground mb-4">
          Great job! You've reviewed all problems due today.
        </p>
        <Button onClick={onClose} className="glow-button">
          Back to Dashboard
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-secondary"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Problem {currentIndex + 1} of {dueProblems.length}
          </p>
          <Progress value={progress} className="w-32 h-2 mt-1" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentProblem.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">
                    {currentProblem.problem_name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {currentProblem.topic}
                    </Badge>
                    <Badge className="bg-primary/20 text-primary">
                      Streak: {currentProblem.correct_streak}
                    </Badge>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="shrink-0"
                >
                  <a 
                    href={currentProblem.problem_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    Open Problem
                  </a>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Review this problem and mark whether you remembered the solution
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleReview(false)}
                  variant="outline"
                  size="lg"
                  className="h-16 flex-col gap-2 hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                  disabled={reviewProblem.isPending}
                >
                  <Cross1Icon className="w-5 h-5" />
                  Forgot
                </Button>
                <Button
                  onClick={() => handleReview(true)}
                  variant="outline"
                  size="lg"
                  className="h-16 flex-col gap-2 hover:bg-success/10 hover:border-success hover:text-success glow-button"
                  disabled={reviewProblem.isPending}
                >
                  <CheckIcon className="w-5 h-5" />
                  Remembered
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Current interval: {currentProblem.interval} day{currentProblem.interval !== 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}