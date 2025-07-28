import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProblems } from '@/hooks/useProblems'
import { ArrowLeftIcon, PlusIcon, Link1Icon } from '@radix-ui/react-icons'

interface AddProblemFormProps {
  onClose: () => void
}

export function AddProblemForm({ onClose }: AddProblemFormProps) {
  const [form, setForm] = useState({
    topic: '',
    problemName: '',
    problemLink: '',
  })
  const { addProblem } = useProblems()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    addProblem.mutate(form, {
      onSuccess: () => {
        setForm({ topic: '', problemName: '', problemLink: '' })
        onClose()
      }
    })
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-secondary"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="text-xl">Add New Problem</CardTitle>
              <CardDescription>
                Add a coding problem to your spaced repetition collection
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Arrays, Dynamic Programming, Trees"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemName">Problem Name</Label>
              <Input
                id="problemName"
                placeholder="e.g., Two Sum, Longest Palindromic Substring"
                value={form.problemName}
                onChange={(e) => setForm({ ...form, problemName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemLink">Problem Link</Label>
              <div className="relative">
                <Link1Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="problemLink"
                  type="url"
                  placeholder="https://leetcode.com/problems/two-sum/"
                  value={form.problemLink}
                  onChange={(e) => setForm({ ...form, problemLink: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              {form.problemLink && !isValidUrl(form.problemLink) && (
                <p className="text-sm text-destructive">Please enter a valid URL</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={addProblem.isPending || !isValidUrl(form.problemLink)}
                className="flex-1 glow-button"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {addProblem.isPending ? 'Adding...' : 'Add Problem'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}