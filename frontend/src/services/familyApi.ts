import { apiFetch } from './api';

export interface FamilyMember {
  id: string;
  estate_id: string;
  user_id?: string;
  name: string;
  email: string;
  relationship_type: string;
  role: string;
  permissions_json: {
    vault: boolean;
    documents: boolean;
    estate: boolean;
    actions: boolean;
    audit: boolean;
  };
  status: string;
  joined_at: string;
}

export const familyApi = {
  async getMembers(estateId: string): Promise<FamilyMember[]> {
    return apiFetch(`/estate/${estateId}/members`);
  },

  async addMember(estateId: string, data: {
    name: string;
    email: string;
    relationship_type: string;
    role?: string;
    permissions?: Record<string, boolean>;
  }): Promise<FamilyMember> {
    return apiFetch(`/estate/${estateId}/members`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePermissions(memberId: string, permissions: Record<string, boolean>): Promise<any> {
    return apiFetch(`/members/${memberId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
  }
};
