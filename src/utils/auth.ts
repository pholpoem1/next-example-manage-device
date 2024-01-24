import { NextRequest } from "next/server";
import { config } from "./config";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const secretKey = config.secretJWT as string;

export const authenticateJWT = (req: NextRequest) => {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return "Unauthorized";
    }
  } catch (error) {
    console.error("Error during middleware:", error);
    // res.status(500).json({ error: "Internal Server Error" });
  }
};
