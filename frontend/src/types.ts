export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  status: string;
  deadline?: string;
  hourly_rate?: number;
  owner_id: number;
}

export interface Invoice {
  id: number;
  amount: number;
  status: string;
  issued_date: string;
  project_id: number;
  project?: Project;
}
