import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password, phone, currency, referCode } = req.body;
  if (!username || !password || !phone || !currency) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Check if user exists
    const existing = await users.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Insert new user
    await users.insertOne({
      username,
      password,
      phone,
      currency,
      referCode,
      createdAt: new Date(),
    });
    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}
