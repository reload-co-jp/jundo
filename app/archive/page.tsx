"use client"
import { useEffect, useState } from "react"
import { api } from "lib/api"
import type { Task } from "types"
import TaskItem from "components/ui/TaskItem"

export default function ArchivePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await api.tasks.list()
    setTasks(data.filter((t) => t.status !== "active"))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  const completed = tasks.filter((t) => t.status === "completed")
  const archived = tasks.filter((t) => t.status === "archived")

  if (tasks.length === 0)
    return <p className="max-w-2xl mx-auto text-gray-500 text-sm text-center py-12">なし</p>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {completed.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            完了
          </h2>
          <ul className="space-y-2">
            {completed.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onRefresh={load}
                onArchive={async () => {
                  await api.tasks.update(task.id, { status: "active" })
                  load()
                }}
                onDelete={async () => {
                  await api.tasks.delete(task.id)
                  load()
                }}
              />
            ))}
          </ul>
        </section>
      )}
      {archived.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            アーカイブ
          </h2>
          <ul className="space-y-2">
            {archived.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onRefresh={load}
                onArchive={async () => {
                  await api.tasks.update(task.id, { status: "active" })
                  load()
                }}
                onDelete={async () => {
                  await api.tasks.delete(task.id)
                  load()
                }}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
