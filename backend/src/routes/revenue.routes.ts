import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { RevenueService } from "../services/revenue.service";

const router = Router();

const RevenueSchema = z.object({
  client_id: z.number().int().positive(),
  month: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Month must be YYYY-MM-DD format"),
  revenue: z.number().positive(),
  estimated_hours: z.number().positive().nullable().optional(),
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await RevenueService.getAll();
    res.json(data);
  } catch (err) { next(err); }
});

router.get("/client/:clientId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await RevenueService.getByClient(Number(req.params.clientId));
    res.json(data);
  } catch (err) { next(err); }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = RevenueSchema.parse(req.body);
    const entry = await RevenueService.upsert(data);
    res.status(201).json(entry);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await RevenueService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;