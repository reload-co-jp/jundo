"use client"
import { useState } from "react"
import type { RankingAxis } from "types"
import MatrixChart from "components/features/MatrixChart"

const AXES: RankingAxis[] = ["want", "must", "urgency"]

export default function MatrixPage() {
  const [xAxis, setXAxis] = useState<RankingAxis>("want")
  const [yAxis, setYAxis] = useState<RankingAxis>("urgency")

  return (
    <div className="space-y-4">
      <div className="flex gap-6 items-end">
        <div>
          <label className="text-xs text-gray-400 block mb-1">X軸（横）</label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value as RankingAxis)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none"
          >
            {AXES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Y軸（縦）</label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value as RankingAxis)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none"
          >
            {AXES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>
      <MatrixChart xAxis={xAxis} yAxis={yAxis} />
    </div>
  )
}
