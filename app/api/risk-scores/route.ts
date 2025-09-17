import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

export async function POST(req: Request) {
  try {
    const { Tscore, Financial, Health, TimeHori } = await req.json()

    const token = req.headers.get("Authorization")?.split(" ")[1]
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId

    const newScore = await prisma.riskScore.create({
      data: { userId, Tscore, Financial, Health, TimeHori },
    })

    return new Response(JSON.stringify({ score: newScore }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error adding score", error }), { status: 500 })
  }
}
