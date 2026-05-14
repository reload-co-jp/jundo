import type { Task, Ranking, RankingAxis, MatrixPoint } from "types"

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, options)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export const api = {
  tasks: {
    list: () => req<Task[]>("/api/tasks"),
    create: (data: { title: string; description?: string }) =>
      req<Task>("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    update: (
      id: string,
      data: Partial<Pick<Task, "title" | "description" | "status">>
    ) =>
      req<Task>(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetch(`/api/tasks/${id}`, { method: "DELETE" }),
  },
  rankings: {
    list: () => req<Ranking[]>("/api/rankings"),
    update: (axis: RankingAxis, orderedTaskIds: string[]) =>
      req<Ranking>(`/api/rankings/${axis}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedTaskIds }),
      }),
  },
  matrix: {
    get: (x: RankingAxis, y: RankingAxis) =>
      req<MatrixPoint[]>(`/api/matrix?x=${x}&y=${y}`),
  },
}
