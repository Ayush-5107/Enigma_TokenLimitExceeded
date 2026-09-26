import { apiFetch } from './api';

export interface ExtractionJob {
  id: string;
  document_id: string;
  status: string;
  tee_enclave_id: string;
  tee_attestation_quote?: string;
  extracted_data_json: Record<string, any>;
  confidence_score: number;
  low_confidence_fields_json: string[];
  source_regions_json: Record<string, { page: number; box: number[] }>;
  created_at: string;
  completed_at?: string;
}

export const extractionApi = {
  async createJob(documentId: string): Promise<ExtractionJob> {
    return apiFetch('/extraction/jobs', {
      method: 'POST',
      body: JSON.stringify({ document_id: documentId }),
    });
  },

  async getJob(jobId: string): Promise<ExtractionJob> {
    return apiFetch(`/extraction/jobs/${jobId}`);
  },

  async confirmExtraction(extractionId: string, payload: {
    confirmed_fields: Record<string, any>;
    entity_type: 'asset' | 'liability';
    category: string;
    name: string;
    institution_or_creditor: string;
    amount_or_value: number;
    account_or_ref_number?: string;
    due_date?: string;
  }): Promise<any> {
    return apiFetch(`/extraction/${extractionId}/confirm`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
