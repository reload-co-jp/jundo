"use client"
import { useEffect, useState, use } from "react"
import { api } from "lib/api"
import type { Task, RankingAxis } from "types"
import RankingList from "components/features/RankingList"

const AXIS_LABELS: Record<RankingAxis, string> = {
  want: "やりたい順",
  must: "やるべき順",
  urgency: "急ぎ順",
}

export default function RankingPage({
  params,
}: {
  params: Promise<{ axis: string }>
}) {
  const { axis } = use(params)
  const rankingAxis = axis as RankingAxis

  const [tasks, setTasks] = useState<Task[]>([])
  const [orderedIds, setOrderedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [allTasks, rankings] = await Promise.all([
        api.tasks.list(),
        api.rankings.list(),
      ])
      const active = allTasks.filter((t) => t.status === "active")
      const ranking = rankings.find((r) => r.axis === rankingAxis)
      const ranked = (ranking?.orderedTaskIds ?? []).filter((id) =>
        active.some((t) => t.id === id)
      )
      const unranked = active
        .filter((t) => !ranked.includes(t.id))
        .map((t) => t.id)
      setTasks(active)
      setOrderedIds([...ranked, ...unranked])
      setLoading(false)
    }
    load()
  }, [rankingAxis])

  const handleReorder = async (newIds: string[]) => {
    setOrderedIds(newIds)
    await api.rankings.update(rankingAxis, newIds)
  }

  const orderedTasks = orderedIds
    .map((id) => tasks.find((t) => t.id === id))
    .filter(Boolean) as Task[]

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold uppercase tracking-wider">
          {rankingAxis}
        </h2>
        <p className="text-sm text-gray-400">{AXIS_LABELS[rankingAxis]}</p>
      </div>
      {orderedTasks.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-12">タスクなし</p>
      ) : (
        <RankingList
          tasks={orderedTasks}
          orderedIds={orderedIds}
          onReorder={handleReorder}
        />
      )}
    </div>
  )
}
