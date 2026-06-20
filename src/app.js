import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import farmingRoutes from "./routes/farmingRoutes.js";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/uploads",
  express.static("src/uploads")
);

app.use(
  "/api/farming",
  farmingRoutes
);

app.get("/", (req, res) => {
  res.send("CitySprout Backend Running 🚀");
});

export default app;