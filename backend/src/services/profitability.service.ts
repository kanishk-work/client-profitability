import { AppDataSource } from "../db/data-source";
import { Client } from "../entities/Client";
import { TimeEntry } from "../entities/TimeEntry";

export const ProfitabilityService = {
  // Full dashboard for a given month
  async getByMonth(month: string) {
    const result = await AppDataSource.getRepository(Client)
      .createQueryBuilder("c")
      .select([
        "c.id AS client_id",
        "c.name AS client_name",
        "cmr.revenue AS revenue",
        "cmr.estimated_hours AS estimated_hours",
      ])
      .addSelect("COALESCE(SUM(te.hours), 0)", "actual_hours")
      .addSelect(
        "COALESCE(SUM(te.hours * (r.monthly_salary / r.productive_hours_per_month)), 0)",
        "delivery_cost"
      )
      .addSelect(
        "cmr.revenue - COALESCE(SUM(te.hours * (r.monthly_salary / r.productive_hours_per_month)), 0)",
        "gross_margin"
      )
      .addSelect(
        `CASE WHEN cmr.revenue > 0
          THEN ROUND(((cmr.revenue - COALESCE(SUM(te.hours * (r.monthly_salary / r.productive_hours_per_month)), 0)) / cmr.revenue * 100)::numeric, 2)
          ELSE 0
        END`,
        "margin_pct"
      )
      .addSelect(
        `CASE WHEN cmr.estimated_hours IS NOT NULL AND cmr.estimated_hours > 0
          THEN ROUND(((COALESCE(SUM(te.hours), 0) - cmr.estimated_hours) / cmr.estimated_hours * 100)::numeric, 2)
          ELSE NULL
        END`,
        "hours_variance_pct"
      )
      .innerJoin("c.monthlyRevenues", "cmr", "cmr.month = :month", { month })
      .leftJoin(
        "c.timeEntries",
        "te",
        "DATE_TRUNC('month', te.date::date) = :month::date",
        { month }
      )
      .leftJoin("te.role", "r")
      .groupBy("c.id, c.name, cmr.revenue, cmr.estimated_hours")
      .orderBy("gross_margin", "DESC")
      .getRawMany();

    return result;
  },

  // Per-client breakdown by role for a given month
  async getClientDetail(client_id: number, month: string) {
    const result = await AppDataSource.getRepository(TimeEntry)
      .createQueryBuilder("te")
      .select([
        "r.id AS role_id",
        "r.name AS role_name",
      ])
      .addSelect(
        "ROUND((r.monthly_salary / r.productive_hours_per_month)::numeric, 2)",
        "cost_per_hour"
      )
      .addSelect("COALESCE(SUM(te.hours), 0)", "hours")
      .addSelect(
        "COALESCE(SUM(te.hours * (r.monthly_salary / r.productive_hours_per_month)), 0)",
        "cost"
      )
      .innerJoin("te.role", "r")
      .where("te.client_id = :client_id", { client_id })
      .andWhere("DATE_TRUNC('month', te.date::date) = :month::date", { month })
      .groupBy("r.id, r.name, r.monthly_salary, r.productive_hours_per_month")
      .orderBy("cost", "DESC")
      .getRawMany();

    return result;
  },
};