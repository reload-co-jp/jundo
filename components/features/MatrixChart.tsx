"use client"
import { useEffect, useState } from "react"
import { api } from "lib/api"
import type { MatrixPoint, RankingAxis } from "types"

type Props = {
  xAxis: RankingAxis
  yAxis: RankingAxis
}

export default function MatrixChart({ xAxis, yAxis }: Props) {
  const [points, setPoints] = useState<MatrixPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.matrix.get(xAxis, yAxis).then((data) => {
      setPoints(data)
      setLoading(false)
    })
  }, [xAxis, yAxis])

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>
  if (points.length === 0)
    return <div className="text-gray-500 text-sm text-center py-12">タスクなし</div>

  return (
    <div className="space-y-3">
      <div
        className="relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden w-full"
        style={{ paddingTop: "min(100%, 480px)" }}
      >
        {/* Quadrant backgrounds */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
          <div className="border-r border-b border-gray-800 bg-blue-950/20" />
          <div className="border-b border-gray-800 bg-green-950/20" />
          <div className="border-r border-gray-800" />
          <div className="bg-yellow-950/10" />
        </div>

        {/* Center lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700" />
        </div>

        {/* Axis labels */}
        <div className="absolute bottom-2 right-3 text-xs text-gray-500 pointer-events-none">
          {xAxis} →
        </div>
        <div className="absolute top-2 left-3 text-xs text-gray-500 pointer-events-none">
          ↑ {yAxis}
        </div>

        {/* Task dots */}
        {points.map(({ task, x, y }) => (
          <div
            key={task.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x * 100}%`, top: `${(1 - y) * 100}%` }}
          >
            <div
              className={`w-3 h-3 rounded-full cursor-pointer transition-transform ${
                hovered === task.id
                  ? "scale-150 bg-blue-300 border-2 border-white"
                  : "bg-blue-500 border-2 border-blue-400 hover:scale-125"
              }`}
              onMouseEnter={() => setHovered(task.id)}
              onMouseLeave={() => setHovered(null)}
            />
            {hovered === task.id && (
              <div className="absolute z-10 bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg pointer-events-none">
                {task.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
