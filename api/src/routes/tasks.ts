import type { FastifyPluginAsync } from "fastify"
import { prisma } from "../prisma"

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID ?? "default"

const tasksRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/tasks", async () => {
    return prisma.task.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: "desc" },
    })
  })

  fastify.post<{
    Body: { title: string; description?: string }
  }>("/tasks", async (req) => {
    const { title, description } = req.body
    return prisma.task.create({
      data: { title, description, userId: DEFAULT_USER_ID },
    })
  })

  fastify.patch<{
    Params: { id: string }
    Body: {
      title?: string
      description?: string
      status?: "active" | "completed" | "archived"
    }
  }>("/tasks/:id", async (req) => {
    const { id } = req.params
    const { title, description, status } = req.body
    return prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    })
  })

  fastify.delete<{
    Params: { id: string }
  }>("/tasks/:id", async (req, reply) => {
    const { id } = req.params
    await prisma.task.delete({ where: { id } })
    return reply.status(204).send()
  })
}

export default tasksRoutes
