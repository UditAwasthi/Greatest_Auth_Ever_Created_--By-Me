import crypto from "crypto";
import { db } from "../../db/index.js";
import { verifications } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

const OTP_EXPIRY = 1000 * 60 * 5; // 5 min


// generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// hash OTP
const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};


// ================= CREATE OTP =================
export const createOTP = async ({ identifier, purpose }) => {
  const otp = generateOTP();
  const hashed = hashOTP(otp);

  await db.delete(verifications).where(
    and(
      eq(verifications.identifier, identifier),
      eq(verifications.purpose, purpose)
    )
  );

  await db.insert(verifications).values({
    identifier,
    purpose,
    code: hashed,
    expiresAt: new Date(Date.now() + OTP_EXPIRY),
  });

  return {
    otp,
    expiresIn: OTP_EXPIRY,
  };
};


// ================= VERIFY OTP =================
export const verifyOTP = async ({ identifier, otp, purpose }) => {
  const hashed = hashOTP(otp);

  const [record] = await db
    .select()
    .from(verifications)
    .where(
      and(
        eq(verifications.identifier, identifier),
        eq(verifications.purpose, purpose)
      )
    );

  if (!record) throw new Error("OTP not found");

  if (record.code !== hashed) throw new Error("Invalid OTP");

  if (new Date() > record.expiresAt) {
    throw new Error("OTP expired");
  }

 
  await db.delete(verifications).where(
    and(
      eq(verifications.identifier, identifier),
      eq(verifications.purpose, purpose)
    )
  );

  return { verified: true };
};