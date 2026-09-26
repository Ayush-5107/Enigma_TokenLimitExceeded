import { apiFetch } from './api';

export interface EstateSummary {
  estate_id: string;
  title: string;
  deceased_name: string;
  total_asset_value: number;
  total_liability_value: number;
  net_estate_value: number;
  unconfirmed_items_count: number;
  pending_actions_count: number;
  completed_actions_count: number;
  total_actions_count: number;
  closure_progress_percent: number;
}

export interface Asset {
  id: string;
  estate_id: string;
  document_id?: string;
  category: string;
  name: string;
  institution?: string;
  estimated_value: number;
  account_number_masked?: string;
  is_confirmed: boolean;
  confidence_score: number;
  status: string;
  details_json: Record<string, any>;
  created_at: string;
}

export interface Liability {
  id: string;
  estate_id: string;
  document_id?: string;
  category: string;
  name: string;
  creditor?: string;
  total_amount: number;
  emi_amount: number;
  due_date?: string;
  is_confirmed: boolean;
  confidence_score: number;
  status: string;
  details_json: Record<string, any>;
  created_at: string;
}

export const estateApi = {
  async getSummary(estateId: string): Promise<EstateSummary> {
    return apiFetch(`/estate/${estateId}/summary`);
  },

  async getAssets(estateId: string): Promise<Asset[]> {
    return apiFetch(`/estate/${estateId}/assets`);
  },

  async createAsset(estateId: string, data: any): Promise<Asset> {
    return apiFetch(`/estate/${estateId}/assets`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getLiabilities(estateId: string): Promise<Liability[]> {
    return apiFetch(`/estate/${estateId}/liabilities`);
  },

  async createLiability(estateId: string, data: any): Promise<Liability> {
    return apiFetch(`/estate/${estateId}/liabilities`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
