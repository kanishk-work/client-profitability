import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Unique,
  Index
} from "typeorm";
import { Client } from "./Client";

@Entity("client_monthly_revenue")
@Unique(["client_id", "month"])
@Index("idx_cmr_client_month", ["client_id", "month"])

export class ClientMonthlyRevenue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @ManyToOne(() => Client, (c) => c.monthlyRevenues)
  @JoinColumn({ name: "client_id" })
  client: Client;

  // As YYYY-MM-DD and first day of month e.g. 2024-05-01
  @Column("date")
  month: string;

  @Column("numeric", { precision: 10, scale: 2 })
  revenue: number;

  @Column("numeric", { precision: 10, scale: 2, nullable: true })
  estimated_hours: number | null;
}