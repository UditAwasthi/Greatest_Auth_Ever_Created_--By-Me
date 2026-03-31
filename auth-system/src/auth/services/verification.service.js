import { verifyOTP } from "./otp.service.js";

export const verifyUser = async ({ identifier, otp }) => {
  await verifyOTP({
    identifier,
    otp,
    purpose: "verify",
  });

  return { message: "Verified successfully" };
};