import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ProfitabilityService } from "../services/profitability.service";

const router = Router();

const MonthSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Month must be YYYY-MM-DD");

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const month = MonthSchema.parse(req.query.month);
    const data = await ProfitabilityService.getByMonth(month);
    res.json(data);
  } catch (err) { next(err); }
});

router.get("/:clientId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const month = MonthSchema.parse(req.query.month);
    const data = await ProfitabilityService.getClientDetail(
      Number(req.params.clientId),
      month
    );
    res.json(data);
  } catch (err) { next(err); }
});

export default router;