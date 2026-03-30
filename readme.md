# 🔐 Greatest Auth System (Modular Auth Engine)

A **production-ready, reusable authentication module** built with modern backend practices.
Designed to plug into any Node.js project (web, mobile, microservices) with minimal setup.

---

# 🚀 Overview

This project is a **modular auth engine**, not just a set of routes.

It provides:

* Clean architecture (service + repository pattern)
* Multi-identifier login (username / email)
* Secure password handling
* JWT-based authentication
* Refresh token session system
* Database-agnostic logic (currently using Neon + PostgreSQL)

---

# 🧠 Architecture

```
src/
│── db/
│   ├── schema.js        # Drizzle schema
│   ├── index.js         # DB connection
│
│── auth/
│   ├── services/        # Business logic (core engine)
│   ├── repositories/    # DB abstraction layer
│   ├── utils/           # Helpers
│   ├── index.js         # Public API exports
```

---

# ⚙️ Tech Stack

* Node.js
* Express (optional usage layer)
* PostgreSQL (via Neon)
* Drizzle ORM
* JWT (jsonwebtoken)
* bcrypt (password hashing)

---

# 🔑 Features

## ✅ Authentication

* Signup (username + email + password)
* Login using:

  * username + password
  * email + password

## 🔐 Security

* Password hashing with bcrypt
* JWT access tokens (short-lived)
* Refresh tokens (long-lived)
* Refresh token rotation
* Session invalidation on logout

## 📦 Session System

* Refresh tokens stored in database
* Expiry-based session validation
* Multiple sessions per user supported

---

# 🔄 Auth Flow

## Signup

1. Validate username + email uniqueness
2. Create user
3. Hash password
4. Create account (provider = local)
5. Generate tokens
6. Store refresh session

---

## Login

1. Detect identifier (username/email)
2. Find corresponding account
3. Verify password
4. Generate tokens
5. Store new session

---

## Refresh Token

1. Validate session
2. Check expiry
3. Delete old token
4. Issue new access + refresh token
5. Store new session

---

## Logout

1. Delete refresh token session

---

# 📦 Public API

You can import the module anywhere:

```js
import { signup, login, refresh, logout } from "./src/auth/index.js";
```

---

## Example Usage

```js
const user = await signup({
  username: "udit",
  email: "udit@gmail.com",
  password: "123456"
});

const session = await login({
  identifier: "udit",
  password: "123456"
});

const newTokens = await refresh(session.refreshToken);

await logout(newTokens.refreshToken);
```

---

# 🗄️ Database Design

## Users

* id
* username (unique)
* 2FA fields (future-ready)

## Accounts

* userId
* provider (local / future OAuth)
* providerId (email)
* password (hashed)

## Sessions

* refreshToken
* userId
* expiresAt

## Verifications

* OTP / email verification (future use)

---

# ⚠️ Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_secret_key
```

---

# 🧪 Testing

Run the test script:

```bash
node test.js
```

Expected:

* Signup → success
* Login → success
* Refresh → new tokens
* Logout → session removed

---

# 🔥 Current Limitations

* No OAuth yet (Google, GitHub)
* No phone/OTP login yet
* No 2FA enforcement (only schema ready)
* No rate limiting
* No role-based access control

---

# 🚀 Upcoming Features

* Google OAuth integration
* Phone OTP login
* Authenticator (TOTP 2FA)
* Device/session tracking (IP + user agent)
* Logout all sessions
* Role & permission system
* Redis support for scaling

---

# 🧠 Design Philosophy

This system is built as:

> ❌ Not a simple login system
> ✅ A reusable identity/authentication engine

Key principles:

* Separation of concerns
* Provider-based authentication (local, OAuth, phone)
* Stateless access + stateful sessions
* Extensibility for future auth methods

---

# 🏁 Status

✅ Core auth system complete
🚧 Advanced production features in progress

---

# 👨‍💻 Author

Built as a **high-performance, reusable auth system** for real-world applications.

---

# ⚡ License

MIT (or your choice)
