import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useProblems } from '@/hooks/useProblems'
import { AddProblemForm } from './AddProblemForm'
import { ProblemList } from './ProblemList'
import { ReviewSession } from './ReviewSession'
import { useState } from 'react'
import { 
  PlusIcon, 
  CalendarIcon, 
  BookmarkIcon, 
  ExitIcon,
  LightningBoltIcon
} from '@radix-ui/react-icons'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { problems, dueProblems, isLoading } = useProblems()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const stats = {
    total: problems.length,
    due: dueProblems.length,
    completed: problems.filter(p => p.correct_streak > 0).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <motion.header 
        className="border-b border-border/50 bg-card/50 backdrop-blur-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">CodeMaster</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.user_metadata?.username || user?.email}
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <ExitIcon className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Problems in your collection
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due Today</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.due}</div>
              <p className="text-xs text-muted-foreground">
                Ready for review
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mastered</CardTitle>
              <LightningBoltIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Problems with progress
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={() => setShowAddForm(true)}
            className="glow-button"
            size="lg"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Problem
          </Button>
          
          {stats.due > 0 && (
            <Button 
              onClick={() => setShowReview(true)}
              variant="outline"
              size="lg"
              className="animate-bounce-gentle"
            >
              <LightningBoltIcon className="w-4 h-4 mr-2" />
              Start Review ({stats.due})
            </Button>
          )}
        </motion.div>

        {/* Main Content */}
        {showAddForm ? (
          <AddProblemForm onClose={() => setShowAddForm(false)} />
        ) : showReview && stats.due > 0 ? (
          <ReviewSession onClose={() => setShowReview(false)} />
        ) : (
          <ProblemList />
        )}
      </div>
    </div>
  )
}