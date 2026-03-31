import { verifyOTP } from "./otp.service.js";

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
  generateRefreshToken
} from "./token.service.js";

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7;


export const loginWithOTP = async ({ identifier, otp, ip, userAgent }) => {
  // 1. verify OTP
  await verifyOTP({
    identifier,
    otp,
    purpose: "login",
  });

  // 2. find or create account
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
      type: "otp",
      provider: "phone",
      providerId: identifier,
    });
  }

  // 3. session
  const refreshToken = generateRefreshToken();

  await createSession({
    userId: user.id,
    refreshToken,
    ip,
    userAgent,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
  });

  const accessToken = generateAccessToken(user);

  return { accessToken, refreshToken };
};