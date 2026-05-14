export type TaskStatus = "active" | "completed" | "archived"
export type RankingAxis = "want" | "must" | "urgency"

export type Task = {
  id: string
  userId: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export type Ranking = {
  id: string
  userId: string
  axis: RankingAxis
  orderedTaskIds: string[]
  createdAt: string
  updatedAt: string
}

export type MatrixPoint = {
  task: Task
  x: number
  y: number
}
