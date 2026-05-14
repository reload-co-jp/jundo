"use client"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "types"

type SortableItemProps = {
  task: Task
  rank: number
}

function SortableItem({ task, rank }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3"
    >
      <span className="text-gray-500 text-xs w-5 text-right flex-shrink-0 tabular-nums">
        {rank}
      </span>
      <span
        {...attributes}
        {...listeners}
        className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 select-none text-lg leading-none"
        title="ドラッグで並び替え"
      >
        ⠿
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>
        )}
      </div>
    </li>
  )
}

type Props = {
  tasks: Task[]
  orderedIds: string[]
  onReorder: (newOrderedIds: string[]) => void
}

export default function RankingList({ tasks, orderedIds, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = orderedIds.indexOf(active.id as string)
    const newIndex = orderedIds.indexOf(over.id as string)
    onReorder(arrayMove(orderedIds, oldIndex, newIndex))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {tasks.map((task, idx) => (
            <SortableItem key={task.id} task={task} rank={idx + 1} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
