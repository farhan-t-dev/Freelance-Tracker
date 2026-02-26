import axios from 'axios';
import type { Client, Project, Invoice, TimeEntry } from './types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// --- Clients ---
export const getClients = async () => {
  const response = await api.get<Client[]>('/clients/');
  return response.data;
};

export const createClient = async (client: any) => {
  const response = await api.post<Client>('/clients/', client);
  return response.data;
};

export const getClient = async (id: number) => {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
};

// --- Projects ---
export const getProjects = async () => {
  const response = await api.get<Project[]>('/projects/');
  return response.data;
};

export const createProject = async (project: any) => {
  const response = await api.post<Project>('/projects/', project);
  return response.data;
};

export const getProject = async (id: number) => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

// --- Invoices ---
export const getInvoices = async () => {
  const response = await api.get<Invoice[]>('/invoices/');
  return response.data;
};

export const createInvoice = async (invoice: any) => {
  const response = await api.post<Invoice>('/invoices/', invoice);
  return response.data;
};

// --- Time Entries ---
export const getTimeEntries = async () => {
  const response = await api.get<TimeEntry[]>('/time-entries/');
  return response.data;
};

export const createTimeEntry = async (timeEntry: any) => {
  const response = await api.post<TimeEntry>('/time-entries/', timeEntry);
  return response.data;
};

export const updateTimeEntry = async (id: number, timeEntry: any) => {
  const response = await api.put<TimeEntry>(`/time-entries/${id}`, timeEntry);
  return response.data;
};

export default api;
