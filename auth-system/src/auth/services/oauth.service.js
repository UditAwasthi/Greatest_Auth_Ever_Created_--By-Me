import axios from "axios";

import { createUser,findUserById } from "../repositories/user.repo.js";
import { createAccount, findAccount } from "../repositories/account.repo.js";
import { createSession } from "../repositories/session.repo.js";

import {
  generateAccessToken,
  generateRefreshToken
} from "./token.service.js";

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7;

export const googleOAuth = async ({ code, ip, userAgent }) => {
  try {
    // FIX: redirect_uri must match EXACTLY
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000", 
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenRes.data;

    // 2. get user info
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { id, email } = userRes.data;

    // 3. check account
    let account = await findAccount("google", id);

    let user;

    if (account) {
      user = await findUserById(account.userId);
    } else {
      user = await createUser({
        username: email.split("@")[0] + "_" + Date.now(),
      });

      await createAccount({
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerId: id,
      });
    }

    // 4. session
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

  } catch (err) {
    //  VERY IMPORTANT DEBUG
    console.log("GOOGLE ERROR:", err.response?.data || err.message);
    throw new Error("Google OAuth failed");
  }
};