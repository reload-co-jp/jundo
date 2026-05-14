"use client"
import { useEffect, useState } from "react"
import { api } from "lib/api"
import type { Task, RankingAxis } from "types"
import RankingList from "components/features/RankingList"

const AXES: { axis: RankingAxis; label: string }[] = [
  { axis: "want", label: "やりたい順" },
  { axis: "must", label: "やるべき順" },
  { axis: "urgency", label: "急ぎ順" },
]

export default function RankingsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [orderedIds, setOrderedIds] = useState<Record<RankingAxis, string[]>>({
    want: [],
    must: [],
    urgency: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [allTasks, rankings] = await Promise.all([
        api.tasks.list(),
        api.rankings.list(),
      ])
      const active = allTasks.filter((t) => t.status === "active")
      const ids: Record<RankingAxis, string[]> = { want: [], must: [], urgency: [] }
      for (const { axis } of AXES) {
        const ranking = rankings.find((r) => r.axis === axis)
        const ranked = (ranking?.orderedTaskIds ?? []).filter((id) =>
          active.some((t) => t.id === id)
        )
        const unranked = active.filter((t) => !ranked.includes(t.id)).map((t) => t.id)
        ids[axis] = [...ranked, ...unranked]
      }
      setTasks(active)
      setOrderedIds(ids)
      setLoading(false)
    }
    load()
  }, [])

  const handleReorder = async (axis: RankingAxis, newIds: string[]) => {
    setOrderedIds((prev) => ({ ...prev, [axis]: newIds }))
    await api.rankings.update(axis, newIds)
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      {AXES.map(({ axis, label }) => {
        const ordered = orderedIds[axis]
          .map((id) => tasks.find((t) => t.id === id))
          .filter(Boolean) as Task[]
        return (
          <div key={axis} className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider">{axis}</h2>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
            {ordered.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-8">タスクなし</p>
            ) : (
              <RankingList
                tasks={ordered}
                orderedIds={orderedIds[axis]}
                onReorder={(newIds) => handleReorder(axis, newIds)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
