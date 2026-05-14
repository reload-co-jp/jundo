"use client"
import { useEffect, useState } from "react"
import { api } from "lib/api"
import type { Task } from "types"
import TaskItem from "components/ui/TaskItem"
import TaskForm from "components/ui/TaskForm"

export default function InboxPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await api.tasks.list()
    setTasks(data.filter((t) => t.status === "active"))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (title: string, description?: string) => {
    await api.tasks.create({ title, description })
    load()
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <TaskForm onSubmit={handleCreate} />
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-12">タスクなし</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onRefresh={load}
              onComplete={async () => {
                await api.tasks.update(task.id, { status: "completed" })
                load()
              }}
              onArchive={async () => {
                await api.tasks.update(task.id, { status: "archived" })
                load()
              }}
              onDelete={async () => {
                await api.tasks.delete(task.id)
                load()
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
