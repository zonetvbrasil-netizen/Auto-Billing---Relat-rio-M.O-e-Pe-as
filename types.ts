
export interface BillingRecord {
  id: string;
  date: string;
  insurance: string;
  brand: string;
  model: string;
  plate: string;
  laborInsuranceValue: number; // Mão de obra Seguradora
  laborDealershipValue: number; // Mão de obra Concessionária
  partsValue: number;
  totalValue: number;
}

export type ViewType = 'dashboard' | 'records' | 'reports' | 'ai-insights';

export interface DashboardStats {
  totalRevenue: number;
  totalLaborInsurance: number;
  totalLaborDealership: number;
  totalParts: number;
  recordCount: number;
}
