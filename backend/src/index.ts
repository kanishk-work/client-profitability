import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./db/data-source";
import { errorHandler } from "./middleware/errorHandler";
import rolesRouter from "./routes/roles.routes";
import clientsRouter from "./routes/clients.routes";
import revenueRouter from "./routes/revenue.routes";
import timeEntriesRouter from "./routes/timeEntries.routes";
import profitabilityRouter from "./routes/profitability.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Main Routes
app.use("/api/roles", rolesRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/time-entries", timeEntriesRouter);
app.use("/api/profitability", profitabilityRouter);

// Error handler last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });