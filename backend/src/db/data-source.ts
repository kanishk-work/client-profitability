import "reflect-metadata";
import { DataSource } from "typeorm";
import { Role } from "../entities/Role";
import { Client } from "../entities/Client";
import { ClientMonthlyRevenue } from "../entities/ClientMonthlyRevenue";
import { TimeEntry } from "../entities/TimeEntry";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "client_profitability",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [Role, Client, ClientMonthlyRevenue, TimeEntry],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
});