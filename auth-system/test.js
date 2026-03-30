import "dotenv/config";
import { signup, login, refresh, logout } from "./src/auth/index.js";

const run = async () => {
  try {
    console.log("---- SIGNUP ----");
    const signupRes = await signup({
      username: "udit4",
      email: "udit4@gmail.com",
      password: "123456",
    });
    console.log(signupRes);

    console.log("\n---- LOGIN ----");
    const loginRes = await login({
      identifier: "udit", // username OR email
      password: "123456",
    });
    console.log(loginRes);

    console.log("\n---- REFRESH ----");
    const refreshRes = await refresh(loginRes.refreshToken);
    console.log(refreshRes);

    console.log("\n---- LOGOUT ----");
    const logoutRes = await logout(refreshRes.refreshToken);
    console.log(logoutRes);

  } catch (err) {
    console.error("ERROR:", err.message);
  }
};

run();