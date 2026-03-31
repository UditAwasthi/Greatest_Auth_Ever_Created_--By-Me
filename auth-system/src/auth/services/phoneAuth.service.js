import { db } from "../../db/index.js";
import { verifications } from "../../db/schema.js";
import { eq } from "drizzle-orm";

import { hashOTP } from "../utils/otp.util.js";

import {
  createUser,
  findUserById
} from "../repositories/user.repo.js";

import {
  createAccount,
  findAccount
} from "../repositories/account.repo.js";

import {
  createSession
} from "../repositories/session.repo.js";

import {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} from "./token.service.js";

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7;


export const verifyOTP = async ({ identifier, otp, ip, userAgent }) => {
  const hashed = hashOTP(otp);

  const [record] = await db
    .select()
    .from(verifications)
    .where(eq(verifications.identifier, identifier));

  if (!record) throw new Error("OTP not found");

  if (record.code !== hashed) throw new Error("Invalid OTP");

  if (new Date() > record.expiresAt) {
    throw new Error("OTP expired");
  }

  // delete OTP after use (VERY IMPORTANT)
  await db.delete(verifications)
    .where(eq(verifications.identifier, identifier));

  // find or create account
  let account = await findAccount("phone", identifier);

  let user;

  if (account) {
    user = await findUserById(account.userId);
  } else {
    user = await createUser({
      username: "user_" + Date.now(),
    });

    await createAccount({
      userId: user.id,
      type: "phone",
      provider: "phone",
      providerId: identifier,
    });
  }

  const refreshToken = generateRefreshToken();
  const hashedR = hashToken(refreshToken);
  await createSession({
    userId: user.id,
    refreshToken:hashedR,
    ip,
    userAgent,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  });

  const accessToken = generateAccessToken(user);

  return { accessToken, refreshToken };
};