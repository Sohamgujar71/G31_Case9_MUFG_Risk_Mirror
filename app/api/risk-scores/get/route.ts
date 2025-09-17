import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const scores = await prisma.riskScore.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, // most recent first
    });

    return new Response(JSON.stringify({ scores }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching scores", error }), { status: 500 });
  }
}
