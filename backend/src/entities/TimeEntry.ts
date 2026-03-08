import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
  Index
} from "typeorm";
import { Client } from "./Client";
import { Role } from "./Role";

@Entity("time_entries")
@Index("idx_time_entries_client_id", ["client_id"])
@Index("idx_time_entries_role_id", ["role_id"])
@Index("idx_time_entries_date", ["date"])
@Index("idx_time_entries_client_date", ["client_id", "date"]) // composite index, can be useful for profitability query

export class TimeEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @Column()
  role_id: number;

  @ManyToOne(() => Client, (c) => c.timeEntries)
  @JoinColumn({ name: "client_id" })
  client: Client;

  @ManyToOne(() => Role, (r) => r.timeEntries)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @Column("numeric", { precision: 6, scale: 2 })
  hours: number;

  @Column("date")
  date: string;

  @CreateDateColumn()
  created_at: Date;
}