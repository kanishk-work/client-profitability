import { AppDataSource } from "../db/data-source";
import { Client } from "../entities/Client";

const clientRepo = AppDataSource.getRepository(Client);

export const ClientsService = {
  async getAll() {
    return clientRepo.find();
  },

  async getById(id: number) {
    const client = await clientRepo.findOneBy({ id });
    if (!client) throw { status: 404, message: "Client not found" };
    return client;
  },

  async create(data: { name: string }) {
    const existing = await clientRepo.findOneBy({ name: data.name });
    if (existing) throw { status: 409, message: "Client with this name already exists" };
    const client = clientRepo.create(data);
    return clientRepo.save(client);
  },

  async update(id: number, data: Partial<{ name: string }>) {
    const client = await clientRepo.findOneBy({ id });
    if (!client) throw { status: 404, message: "Client not found" };
    Object.assign(client, data);
    return clientRepo.save(client);
  },

  async remove(id: number) {
    const client = await clientRepo.findOneBy({ id });
    if (!client) throw { status: 404, message: "Client not found" };
    return clientRepo.remove(client);
  },
};