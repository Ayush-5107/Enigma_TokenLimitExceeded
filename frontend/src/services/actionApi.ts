import { apiFetch } from './api';

export interface ActionItem {
  id: string;
  estate_id: string;
  related_asset_id?: string;
  related_liability_id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  urgency_score: number;
  priority_reason: string;
  status: 'pending' | 'in_progress' | 'evidence_submitted' | 'completed';
  due_date?: string;
  assigned_member_id?: string;
  assigned_member_name?: string;
  required_documents_json: string[];
  checklist_steps_json: string[];
  dependencies_json: string[];
  created_at: string;
}

export const actionApi = {
  async getActions(estateId: string): Promise<ActionItem[]> {
    return apiFetch(`/estate/${estateId}/actions`);
  },

  async createAction(estateId: string, data: any): Promise<ActionItem> {
    return apiFetch(`/estate/${estateId}/actions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async assignAction(actionId: string, memberId: string): Promise<any> {
    return apiFetch(`/actions/${actionId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ member_id: memberId }),
    });
  },

  async updateTaskStatus(taskId: string, status: string, note?: string): Promise<any> {
    return apiFetch(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  }
};
