import { verifyOTP } from "./otp.service.js";
import { db } from "../../db/index.js";
import { accounts } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

import { hashPassword } from "./hash.service.js";


export const resetPassword = async ({
  identifier,
  otp,
  newPassword
}) => {

  // 1. verify OTP
  await verifyOTP({
    identifier,
    otp,
    purpose: "reset_password",
  });

  // 2. hash new password
  const hashed = await hashPassword(newPassword);

  // 3. update account
  await db
    .update(accounts)
    .set({ password: hashed })
    .where(
      and(
        eq(accounts.provider, "local"),
        eq(accounts.providerId, identifier)
      )
    );

  return { message: "Password reset successful" };
};