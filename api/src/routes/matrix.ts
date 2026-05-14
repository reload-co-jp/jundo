import type { FastifyPluginAsync } from "fastify"
import { prisma } from "../prisma"

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID ?? "default"

function rankToScore(rank: number, total: number): number {
  if (total <= 1) return 1
  return 1 - (rank - 1) / (total - 1)
}

const matrixRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Querystring: { x: "want" | "must" | "urgency"; y: "want" | "must" | "urgency" }
  }>("/matrix", async (req) => {
    const { x, y } = req.query

    const [tasks, xRanking, yRanking] = await Promise.all([
      prisma.task.findMany({
        where: { userId: DEFAULT_USER_ID, status: "active" },
      }),
      prisma.ranking.findUnique({
        where: { userId_axis: { userId: DEFAULT_USER_ID, axis: x } },
      }),
      prisma.ranking.findUnique({
        where: { userId_axis: { userId: DEFAULT_USER_ID, axis: y } },
      }),
    ])

    const xOrder = xRanking?.orderedTaskIds ?? []
    const yOrder = yRanking?.orderedTaskIds ?? []
    const total = tasks.length

    return tasks.map((task) => {
      const xIdx = xOrder.indexOf(task.id)
      const yIdx = yOrder.indexOf(task.id)
      const xRank = xIdx !== -1 ? xIdx + 1 : total
      const yRank = yIdx !== -1 ? yIdx + 1 : total

      return {
        task,
        x: rankToScore(xRank, total),
        y: rankToScore(yRank, total),
      }
    })
  })
}

export default matrixRoutes
