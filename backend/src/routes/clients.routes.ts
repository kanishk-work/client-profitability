import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ClientsService } from "../services/clients.service";

const router = Router();

const CreateClientSchema = z.object({
  name: z.string().min(1),
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await ClientsService.getAll();
    res.json(clients);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await ClientsService.getById(Number(req.params.id));
    res.json(client);
  } catch (err) { next(err); }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateClientSchema.parse(req.body);
    const client = await ClientsService.create(data);
    res.status(201).json(client);
  } catch (err) { next(err); }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateClientSchema.partial().parse(req.body);
    const client = await ClientsService.update(Number(req.params.id), data);
    res.json(client);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ClientsService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;