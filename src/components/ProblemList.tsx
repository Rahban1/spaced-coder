import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useProblems } from '@/hooks/useProblems'
import { format, parseISO } from 'date-fns'
import { 
  ExternalLinkIcon, 
  CalendarIcon, 
  LightningBoltIcon,
  ReloadIcon 
} from '@radix-ui/react-icons'

export function ProblemList() {
  const { problems, dueProblems, isLoading } = useProblems()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ReloadIcon className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <LightningBoltIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No problems yet</h3>
          <p className="text-muted-foreground mb-4">
            Start building your collection by adding your first coding problem!
          </p>
        </div>
      </motion.div>
    )
  }

  const upcomingProblems = problems.filter(p => 
    !dueProblems.some(due => due.id === p.id)
  )

  return (
    <div className="space-y-8">
      {/* Due Problems */}
      {dueProblems.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Due for Review ({dueProblems.length})
          </h2>
          <div className="grid gap-4">
            {dueProblems.map((problem, index) => (
              <ProblemCard 
                key={problem.id} 
                problem={problem} 
                isDue={true}
                index={index}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Upcoming Problems */}
      {upcomingProblems.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            All Problems ({problems.length})
          </h2>
          <div className="grid gap-4">
            {upcomingProblems.map((problem, index) => (
              <ProblemCard 
                key={problem.id} 
                problem={problem} 
                isDue={false}
                index={index}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}

interface ProblemCardProps {
  problem: any
  isDue: boolean
  index: number
}

function ProblemCard({ problem, isDue, index }: ProblemCardProps) {
  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'bg-muted text-muted-foreground'
    if (streak < 3) return 'bg-warning/20 text-warning'
    if (streak < 5) return 'bg-primary/20 text-primary'
    return 'bg-success/20 text-success'
  }

  const getIntervalText = (interval: number) => {
    if (interval === 1) return '1 day'
    if (interval < 7) return `${interval} days`
    if (interval < 30) return `${Math.round(interval / 7)} weeks`
    return `${Math.round(interval / 30)} months`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`glass-card transition-all duration-200 hover:shadow-card ${
        isDue ? 'ring-1 ring-primary/50 shadow-glow' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg font-medium">
                {problem.problem_name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {problem.topic}
                </Badge>
                {isDue && (
                  <Badge className="text-xs bg-primary/20 text-primary">
                    Due Today
                  </Badge>
                )}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-primary/10"
            >
              <a 
                href={problem.problem_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <LightningBoltIcon className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Streak:</span>
                <Badge className={`text-xs ${getStreakColor(problem.correct_streak)}`}>
                  {problem.correct_streak}
                </Badge>
              </div>
              <div className="text-muted-foreground">
                Interval: {getIntervalText(problem.interval)}
              </div>
            </div>
            <div className="text-muted-foreground">
              Next: {format(parseISO(problem.next_review_date), 'MMM d')}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}