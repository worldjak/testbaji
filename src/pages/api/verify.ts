import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { username, type, contact, code } = req.body;
  if (!username || !type || !contact || !code) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // For demo: accept any code '1234' as valid
    if (code !== "1234") {
      return res.status(400).json({ message: "Invalid code" });
    }
    if (type === "phone") {
      // Find the phone in phones array and mark as verified
      let phones = user.phones || [];
      let updated = false;
      phones = phones.map((p: any) => {
        if (p.number === contact) {
          updated = true;
          return { ...p, verified: true };
        }
        return p;
      });
      if (!updated) {
        return res.status(400).json({ message: "Phone number not found" });
      }
      await users.updateOne(
        { username },
        { $set: { phones } }
      );
      return res.status(200).json({ message: "Phone verified" });
    } else if (type === "email") {
      // For demo, just set emailVerified: true
      await users.updateOne(
        { username },
        { $set: { emailVerified: true } }
      );
      return res.status(200).json({ message: "Email verified" });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}
