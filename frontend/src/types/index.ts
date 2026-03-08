export interface Role {
  id: number;
  name: string;
  monthly_salary: number;
  productive_hours_per_month: number;
  cost_per_hour: number;
}

export interface Client {
  id: number;
  name: string;
  created_at: string;
}

export interface ClientMonthlyRevenue {
  id: number;
  client_id: number;
  month: string;
  revenue: number;
  estimated_hours: number | null;
  client?: Client;
}

export interface TimeEntry {
  id: number;
  client_id: number;
  role_id: number;
  hours: number;
  date: string;
  client?: Client;
  role?: Role;
}

export interface ProfitabilityRow {
  client_id: number;
  client_name: string;
  revenue: number;
  estimated_hours: number | null;
  actual_hours: number;
  delivery_cost: number;
  gross_margin: number;
  margin_pct: number;
  hours_variance_pct: number | null;
}

export interface RoleBreakdown {
  role_id: number;
  role_name: string;
  cost_per_hour: number;
  hours: number;
  cost: number;
}