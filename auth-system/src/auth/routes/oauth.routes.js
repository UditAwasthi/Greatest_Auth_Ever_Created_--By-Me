import express from "express";
import { googleOAuth } from "../services/oauth.service.js";

const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { code } = req.body;

    const result = await googleOAuth({
      code,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;