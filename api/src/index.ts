import Fastify from "fastify"
import cors from "@fastify/cors"
import { prisma } from "./prisma"
import tasksRoutes from "./routes/tasks"
import rankingsRoutes from "./routes/rankings"
import matrixRoutes from "./routes/matrix"

async function main() {
  const server = Fastify({ logger: true })

  await server.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "*",
  })

  await server.register(tasksRoutes, { prefix: "/api" })
  await server.register(rankingsRoutes, { prefix: "/api" })
  await server.register(matrixRoutes, { prefix: "/api" })

  server.get("/health", async () => ({ ok: true }))

  server.addHook("onClose", async () => {
    await prisma.$disconnect()
  })

  const port = parseInt(process.env.PORT ?? "3001")
  await server.listen({ port, host: "0.0.0.0" })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
