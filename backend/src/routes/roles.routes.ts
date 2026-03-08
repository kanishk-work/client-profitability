import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { RolesService } from "../services/roles.service";

const router = Router();

const CreateRoleSchema = z.object({
  name: z.string().min(1),
  monthly_salary: z.number().positive(),
  productive_hours_per_month: z.number().positive(),
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await RolesService.getAll();
    res.json(roles);
  } catch (err) { next(err); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await RolesService.getById(Number(req.params.id));
    res.json(role);
  } catch (err) { next(err); }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateRoleSchema.parse(req.body);
    const role = await RolesService.create(data);
    res.status(201).json(role);
  } catch (err) { next(err); }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateRoleSchema.partial().parse(req.body);
    const role = await RolesService.update(Number(req.params.id), data);
    res.json(role);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await RolesService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
});

export default router;