import express from "express";
import "dotenv/config";
import oauthRoutes from "./src/auth/routes/oauth.routes.js";
const app = express();

app.use(express.json());

//THIS IS STEP 5 (mounting the route)
app.use("/auth/oauth", oauthRoutes);


// test route
app.get("/", (req, res) => {
  res.send("Auth server running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});