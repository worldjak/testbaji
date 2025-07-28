import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    // Find user by username
    const user = await users.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // For demo: no session, just success
    return res
      .status(200)
      .json({ message: "Login successful", username: user.username });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}
