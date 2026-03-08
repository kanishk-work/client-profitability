import { AppDataSource } from "../db/data-source";
import { ClientMonthlyRevenue } from "../entities/ClientMonthlyRevenue";

const revenueRepo = AppDataSource.getRepository(ClientMonthlyRevenue);

export const RevenueService = {
  async getAll() {
    return revenueRepo.find({ relations: ["client"] });
  },

  async getByClient(client_id: number) {
    return revenueRepo.find({
      where: { client_id },
      relations: ["client"],
      order: { month: "DESC" },
    });
  },

  async upsert(data: {
    client_id: number;
    month: string; // YYYY-MM-DD
    revenue: number;
    estimated_hours?: number | null;
  }) {
    const existing = await revenueRepo.findOneBy({
      client_id: data.client_id,
      month: data.month,
    });

    if (existing) {
      Object.assign(existing, data);
      return revenueRepo.save(existing);
    }

    const entry = revenueRepo.create(data);
    return revenueRepo.save(entry);
  },

  async remove(id: number) {
    const entry = await revenueRepo.findOneBy({ id });
    if (!entry) throw { status: 404, message: "Revenue entry not found" };
    return revenueRepo.remove(entry);
  },
};