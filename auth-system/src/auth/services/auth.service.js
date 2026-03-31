import {
    createUser,
    findUserByUsername,
    findUserById
} from "../repositories/user.repo.js";

import {
    createAccount,
    findAccount,
    findAccountsByUserId
} from "../repositories/account.repo.js";

import {
    createSession,
    findSession,
    deleteSession,
    deleteAllSessionsByUserId
} from "../repositories/session.repo.js";

import { hashPassword, comparePassword } from "./hash.service.js";

import {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} from "./token.service.js";

import { detectIdentifierType } from "../utils/identifier.util.js";


// ================= CONFIG =================
const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7; // 7 days


// ================= SIGNUP =================
export const signup = async ({ username, email, password, ip, userAgent }) => {
    // check username
    const existingUser = await findUserByUsername(username);
    if (existingUser) throw new Error("Username already taken");

    // check email
    const existingEmail = await findAccount("local", email);
    if (existingEmail) throw new Error("Email already registered");

    // create user
    const user = await createUser({ username });

    // hash password
    const hashed = await hashPassword(password);

    // create account
    await createAccount({
        userId: user.id,
        type: "email",
        provider: "local",
        providerId: email,
        password: hashed,
    });

    // tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const hashedR = hashToken(refreshToken);
    // session
    await createSession({
        userId: user.id,
        refreshToken: hashedR,
        ip,
        userAgent,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    });

    return { user, accessToken, refreshToken };
};


// ================= LOGIN =================
export const login = async ({ identifier, password, ip, userAgent }) => {
    const type = detectIdentifierType(identifier);

    let account;

    // username login
    if (type === "username") {
        const user = await findUserByUsername(identifier);
        if (!user) throw new Error("User not found");

        const accs = await findAccountsByUserId(user.id);

        account = accs.find(acc => acc.provider === "local");

        if (!account) throw new Error("Password login not available");
    }
    // email / phone login
    else {
        account = await findAccount("local", identifier);
    }

    if (!account) throw new Error("Account not found");

    // safety check
    if (!account.password) {
        throw new Error("Password login not available");
    }

    const valid = await comparePassword(password, account.password);
    if (!valid) throw new Error("Invalid credentials");

    const user = await findUserById(account.userId);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const hashedR = hashToken(refreshToken);
    // session
    await createSession({
        userId: user.id,
        refreshToken: hashedR,
        ip,
        userAgent,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    });
    return { accessToken, refreshToken };
};


// ================= REFRESH =================
export const refresh = async (refreshToken, ip, userAgent) => {
    const hashed = hashToken(refreshToken);

    const session = await findSession(hashed);
    if (!session) throw new Error("Invalid refresh token");

    // expiry check
    if (session.expiresAt && new Date() > session.expiresAt) {
        await deleteSession(refreshToken);
        throw new Error("Refresh token expired");
    }

    // rotation (invalidate old)
    await deleteSession(refreshToken);

    const newRefresh = generateRefreshToken();
    const newHashed = hashToken(newRefresh);

    await createSession({
        userId: session.userId,
        refreshToken: newHashed, 
        ip,
        userAgent,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    });

    const user = await findUserById(session.userId);

    const accessToken = generateAccessToken(user);

    return { accessToken, refreshToken: newRefresh };
};


// ================= LOGOUT =================
export const logout = async (refreshToken) => {
    const hashed = hashToken(refreshToken);
    await deleteSession(hashed);
    return { message: "Logged out" };
};
// ================= LOGOUT All =================
export const logoutAll = async (userId) => {
    await deleteAllSessionsByUserId(userId);
    return { message: "Logged out from all devices" };
};