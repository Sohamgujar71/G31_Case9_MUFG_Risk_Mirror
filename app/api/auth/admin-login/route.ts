import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

  // Hardcoded admin credentials
  const token = jwt.sign(
    { email: "admin@gmail.com", role: "admin" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return NextResponse.json({ token });
}
