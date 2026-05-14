import type { FastifyPluginAsync } from "fastify"
import { prisma } from "../prisma"

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID ?? "default"

const rankingsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/rankings", async () => {
    return prisma.ranking.findMany({
      where: { userId: DEFAULT_USER_ID },
    })
  })

  fastify.put<{
    Params: { axis: "want" | "must" | "urgency" }
    Body: { orderedTaskIds: string[] }
  }>("/rankings/:axis", async (req) => {
    const { axis } = req.params
    const { orderedTaskIds } = req.body
    return prisma.ranking.upsert({
      where: { userId_axis: { userId: DEFAULT_USER_ID, axis } },
      update: { orderedTaskIds },
      create: { userId: DEFAULT_USER_ID, axis, orderedTaskIds },
    })
  })
}

export default rankingsRoutes
