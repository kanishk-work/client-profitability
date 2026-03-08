import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { TimeEntriesService } from "../services/timeEntries.service";

const router = Router();

const CreateTimeEntrySchema = z.object({
  client_id: z.number().int().positive(),
  role_id: z.number().int().positive(),
  hours: z.number().positive().max(24),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client_id = req.query.client_id ? Number(req.query.client_id) : undefined;
    const month = req.query.month as string | undefined;
    const entries = await TimeEntriesService.getAll({ client_id, month });
    res.json(entries);
  } catch (err) { next(err); }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateTimeEntrySchema.parse(req.body);
    const entry = await TimeEntriesService.create(data);
    res.status(201).json(entry);
  } catch (err) { next(err); }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateTimeEntrySchema.partial().parse(req.body);
    const entry = await TimeEntriesService.update(Number(req.params.id), data);
    res.json(entry);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await TimeEntriesService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;