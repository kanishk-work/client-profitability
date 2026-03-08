import { AppDataSource } from "../db/data-source";
import { Role } from "../entities/Role";

const roleRepo = AppDataSource.getRepository(Role);

export const RolesService = {
  async getAll() {
    const roles = await roleRepo.find();
    return roles.map((r) => ({
      ...r,
      cost_per_hour: Number(r.monthly_salary) / Number(r.productive_hours_per_month),
    }));
  },

  async getById(id: number) {
    const role = await roleRepo.findOneBy({ id });
    if (!role) throw { status: 404, message: "Role not found" };
    return role;
  },

  async create(data: { name: string; monthly_salary: number; productive_hours_per_month: number }) {
    const existing = await roleRepo.findOneBy({ name: data.name });
    if (existing) throw { status: 409, message: "Role with this name already exists" };
    const role = roleRepo.create(data);
    return roleRepo.save(role);
  },

  async update(id: number, data: Partial<{ name: string; monthly_salary: number; productive_hours_per_month: number }>) {
    const role = await roleRepo.findOneBy({ id });
    if (!role) throw { status: 404, message: "Role not found" };
    Object.assign(role, data);
    return roleRepo.save(role);
  },

  async remove(id: number) {
    const role = await roleRepo.findOneBy({ id });
    if (!role) throw { status: 404, message: "Role not found" };
    return roleRepo.remove(role);
  },
};