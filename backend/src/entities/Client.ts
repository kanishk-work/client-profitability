import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, OneToMany
} from "typeorm";
import { TimeEntry } from "./TimeEntry";
import { ClientMonthlyRevenue } from "./ClientMonthlyRevenue";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => TimeEntry, (te) => te.client)
  timeEntries: TimeEntry[];

  @OneToMany(() => ClientMonthlyRevenue, (cmr) => cmr.client)
  monthlyRevenues: ClientMonthlyRevenue[];

  @CreateDateColumn()
  created_at: Date;
}