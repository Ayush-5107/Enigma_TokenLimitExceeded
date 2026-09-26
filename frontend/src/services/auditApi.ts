import { apiFetch } from './api';

export interface AuditEvent {
  id: string;
  estate_id?: string;
  user_id?: string;
  user_name: string;
  action_type: string;
  description: string;
  target_resource?: string;
  ip_address: string;
  timestamp: string;
}

export const auditApi = {
  async getAuditTrail(estateId: string): Promise<AuditEvent[]> {
    return apiFetch(`/estate/${estateId}/audit`);
  }
};
