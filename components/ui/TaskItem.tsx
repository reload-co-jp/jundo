"use client"
import { useState } from "react"
import type { Task } from "types"
import { api } from "lib/api"

type Props = {
  task: Task
  onRefresh: () => void
  onComplete?: () => void
  onArchive?: () => void
  onDelete?: () => void
}

export default function TaskItem({
  task,
  onRefresh,
  onComplete,
  onArchive,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const handleSave = async () => {
    const trimmed = title.trim()
    if (trimmed && trimmed !== task.title) {
      await api.tasks.update(task.id, { title: trimmed })
      onRefresh()
    }
    setEditing(false)
  }

  return (
    <li className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-start gap-3">
      {onComplete && (
        <button
          onClick={onComplete}
          className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-500 hover:border-green-400 flex-shrink-0 transition-colors"
          title="完了"
        />
      )}
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="w-full bg-transparent border-b border-blue-500 focus:outline-none text-sm"
          />
        ) : (
          <p
            className={`text-sm cursor-pointer break-words ${
              task.status === "completed" ? "line-through text-gray-500" : ""
            }`}
            onClick={() => setEditing(true)}
          >
            {task.title}
          </p>
        )}
        {task.description && (
          <p className="text-xs text-gray-400 mt-1 truncate">{task.description}</p>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0 items-center">
        {onArchive && (
          <button
            onClick={onArchive}
            className="text-xs text-gray-500 hover:text-yellow-400 transition-colors"
          >
            archive
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            del
          </button>
        )}
      </div>
    </li>
  )
}
