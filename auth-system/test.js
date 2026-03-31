import "dotenv/config";
import {
  signup,
  login,
  refresh,
  logout,
  logoutAll
} from "./src/auth/index.js";

const run = async () => {
  try {
    console.log("==== DEVICE 1 SIGNUP ====");
    const signupRes = await signup({
      username: "udit6",
      email: "udit6@gmail.com",
      password: "123456",
      ip: "192.168.1.1",
      userAgent: "Chrome - Windows",
    });
    console.log(signupRes);

    console.log("\n==== DEVICE 2 LOGIN ====");
    const loginRes1 = await login({
      identifier: "udit6",
      password: "123456",
      ip: "192.168.1.2",
      userAgent: "Firefox - Linux",
    });
    console.log(loginRes1);

    console.log("\n==== DEVICE 3 LOGIN ====");
    const loginRes2 = await login({
      identifier: "udit5",
      password: "123456",
      ip: "10.0.0.1",
      userAgent: "Mobile - Android",
    });
    console.log(loginRes2);

    console.log("\n==== REFRESH (DEVICE 2) ====");
    const refreshRes = await refresh(
      loginRes1.refreshToken,
      "192.168.1.2",
      "Firefox - Linux"
    );
    console.log(refreshRes);

    console.log("\n==== LOGOUT (DEVICE 3 ONLY) ====");
    const logoutRes = await logout(loginRes2.refreshToken);
    console.log(logoutRes);

    console.log("\n==== LOGIN AGAIN (DEVICE 3 NEW SESSION) ====");
    const loginRes3 = await login({
      identifier: "udit5",
      password: "123456",
      ip: "10.0.0.1",
      userAgent: "Mobile - Android",
    });
    console.log(loginRes3);

    console.log("\n==== LOGOUT ALL DEVICES ====");
    const logoutAllRes = await logoutAll(signupRes.user.id);
    console.log(logoutAllRes);

  } catch (err) {
    console.error("ERROR:", err.message);
  }
};

run();