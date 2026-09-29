import type { LucideIcon } from 'lucide-react';

export type Status = 'ok' | 'warning' | 'error' | 'info';

export type ServiceCategory =
  | 'Cómputo'
  | 'Almacenamiento'
  | 'Base de datos'
  | 'Seguridad'
  | 'Redes'
  | 'Monitoreo';

export interface AWSService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  mainFunction: string;
  pricing: string;
  used: boolean;
  icon: LucideIcon;
}

export interface CloudRegion {
  id: string;
  code: string;
  name: string;
  location: string;
  continent: string;
  azCount: number;
  latencyMs: number;
  services: string[];
  status: Status;
  note: string;
}

export interface CostItem {
  id: string;
  serviceId: string;
  service: string;
  quantity: number;
  hours: number;
  unitRate: number;
  unitLabel: string;
}

export interface CostableService {
  id: string;
  service: string;
  unitRate: number;
  unitLabel: string;
}

export interface CloudProposal {
  id: string;
  name: string;
  appType: string;
  description: string;
  regionCode: string;
  users: number;
  availability: string;
  services: string[];
  objective: string;
  createdAt: string;
}

export type SecurityCategory =
  | 'Modelo de responsabilidad compartida'
  | 'IAM'
  | 'Protección de cuentas'
  | 'Protección de datos'
  | 'Cumplimiento';

export interface SecurityCheckItem {
  id: string;
  category: SecurityCategory;
  title: string;
  description: string;
  recommendation: string;
  status: Status;
}

export interface IamUser {
  name: string;
  role: string;
  mfa: boolean;
  credential: string;
  lastActivity: string;
}

export interface IamRole {
  name: string;
  purpose: string;
  policy: string;
}

export interface NetworkNodeInfo {
  id: string;
  name: string;
  sub: string;
  scope: string;
  description: string;
  details: string[];
  protocol: string;
  icon: LucideIcon;
}
