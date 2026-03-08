import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./data-source";
import { Role } from "../entities/Role";
import { Client } from "../entities/Client";
import { ClientMonthlyRevenue } from "../entities/ClientMonthlyRevenue";
import { TimeEntry } from "../entities/TimeEntry";

async function seed() {
  await AppDataSource.initialize();

  const roleRepo = AppDataSource.getRepository(Role);
  const clientRepo = AppDataSource.getRepository(Client);
  const revenueRepo = AppDataSource.getRepository(ClientMonthlyRevenue);
  const teRepo = AppDataSource.getRepository(TimeEntry);

  // To check if already seeded and exit
  const existingRoles = await roleRepo.count();
  if (existingRoles > 0) {
    console.log("Seed already applied, skipping.");
    process.exit(0);
  }

  // Roles
  const roles = await roleRepo.save([
    { name: "Designer", monthly_salary: 5000, productive_hours_per_month: 160 },
    { name: "Developer", monthly_salary: 7500, productive_hours_per_month: 160 },
    { name: "Content Creator", monthly_salary: 4000, productive_hours_per_month: 160 },
    { name: "Project Manager", monthly_salary: 6000, productive_hours_per_month: 160 },
  ]);

  // Clients
  const clients = await clientRepo.save([
    { name: "Acme Corp" },
    { name: "Globex Inc" },
    { name: "Initech" },
  ]);

  // Revenue for May 2024
  await revenueRepo.save([
    { client_id: clients[0].id, month: "2024-05-01", revenue: 25000, estimated_hours: 120 },
    { client_id: clients[1].id, month: "2024-05-01", revenue: 15000, estimated_hours: 80 },
    { client_id: clients[2].id, month: "2024-05-01", revenue: 8000, estimated_hours: 60 },
  ]);

  // Time entries
  await teRepo.save([
    { client_id: clients[0].id, role_id: roles[1].id, hours: 40, date: "2024-05-10" },
    { client_id: clients[0].id, role_id: roles[0].id, hours: 30, date: "2024-05-12" },
    { client_id: clients[0].id, role_id: roles[3].id, hours: 20, date: "2024-05-15" },
    { client_id: clients[1].id, role_id: roles[1].id, hours: 25, date: "2024-05-08" },
    { client_id: clients[1].id, role_id: roles[2].id, hours: 20, date: "2024-05-09" },
    { client_id: clients[2].id, role_id: roles[0].id, hours: 15, date: "2024-05-20" },
    { client_id: clients[2].id, role_id: roles[2].id, hours: 20, date: "2024-05-22" },
  ]);

  console.log("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});