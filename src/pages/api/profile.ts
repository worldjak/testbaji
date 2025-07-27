/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  if (req.method === "GET") {
    // For demo, get username from query or default
    const username = req.query.username || req.body?.username || "guest";
    try {
      const user = await users.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // phones: [{ number: string, verified: boolean, primary: boolean }]
      let phones = user.phones || [];
      // fallback for legacy single phone
      if (!phones.length && user.phone) {
        phones = [
          { number: user.phone, verified: !!user.phoneVerified, primary: true },
        ];
      }
      return res.status(200).json({
        username: user.username,
        vipPoints: user.vipPoints || 0,
        balance: user.balance || 0,
        avatar: user.avatar || null,
        fullname: user.fullname || null,
        birthday: user.birthday || null,
        phone: user.phone || null,
        phones,
        email: user.email || null,
        createdAt: user.createdAt ? user.createdAt.toISOString() : null,
        isKycVerified: user.isKycVerified || false,
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
  } else if (req.method === "PUT") {
    // Update avatar, fullname, or add phone
    const { username, avatar, fullname, addPhone } = req.body;
    if (!username || (!avatar && !fullname && !addPhone)) {
      return res.status(400).json({
        message: "Username and avatar or fullname or addPhone required",
      });
    }
    try {
      const user = await users.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updateFields: any = {};
      if (avatar) updateFields.avatar = avatar;
      if (fullname) updateFields.fullname = fullname;
      if (addPhone) {
        // addPhone: { number: string }
        let phones = user.phones || [];
        if (!phones.length && user.phone) {
          phones = [
            {
              number: user.phone,
              verified: !!user.phoneVerified,
              primary: true,
            },
          ];
        }
        // Only allow if primary is verified and less than 3 phones
        const primary = phones.find((p: any) => p.primary);
        if (!primary || !primary.verified) {
          return res.status(400).json({
            message: "Primary phone must be verified before adding more.",
          });
        }
        if (phones.length >= 3) {
          return res
            .status(400)
            .json({ message: "Maximum 3 phone numbers allowed." });
        }
        // Add new phone as not verified
        phones.push({
          number: addPhone.number,
          verified: false,
          primary: false,
        });
        updateFields.phones = phones;
      }
      const result = await users.updateOne(
        { username },
        { $set: updateFields }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "Profile updated" });
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}
