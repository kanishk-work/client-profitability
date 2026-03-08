import { AppDataSource } from "../db/data-source";
import { TimeEntry } from "../entities/TimeEntry";

const teRepo = AppDataSource.getRepository(TimeEntry);

export const TimeEntriesService = {
  async getAll(filters: { client_id?: number; month?: string }) {
    const qb = teRepo.createQueryBuilder("te")
      .leftJoinAndSelect("te.client", "client")
      .leftJoinAndSelect("te.role", "role")
      .orderBy("te.date", "DESC");

    if (filters.client_id) {
      qb.andWhere("te.client_id = :client_id", { client_id: filters.client_id });
    }
    if (filters.month) {
      // month = YYYY-MM-DD (first day), filter whole month
      qb.andWhere("DATE_TRUNC('month', te.date::date) = :month", { month: filters.month });
    }

    return qb.getMany();
  },

  async create(data: { client_id: number; role_id: number; hours: number; date: string }) {
    const entry = teRepo.create(data);
    return teRepo.save(entry);
  },

  async update(id: number, data: Partial<{ client_id: number; role_id: number; hours: number; date: string }>) {
    const entry = await teRepo.findOneBy({ id });
    if (!entry) throw { status: 404, message: "Time entry not found" };
    Object.assign(entry, data);
    return teRepo.save(entry);
  },

  async remove(id: number) {
    const entry = await teRepo.findOneBy({ id });
    if (!entry) throw { status: 404, message: "Time entry not found" };
    return teRepo.remove(entry);
  },
};