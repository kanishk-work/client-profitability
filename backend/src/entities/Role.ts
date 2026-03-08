import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, OneToMany, AfterLoad
} from "typeorm";
import { TimeEntry } from "./TimeEntry";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column("numeric", { precision: 10, scale: 2 })
  monthly_salary: number;

  @Column("numeric", { precision: 10, scale: 2 })
  productive_hours_per_month: number;

  cost_per_hour: number;

  @AfterLoad()
  computeCostPerHour() {
    this.cost_per_hour = Number(this.monthly_salary) / Number(this.productive_hours_per_month);
  }

  @OneToMany(() => TimeEntry, (te) => te.role)
  timeEntries: TimeEntry[];

  @CreateDateColumn()
  created_at: Date;
}