import { httpClient } from '../lib/axios';

export interface CivicProject {
  id: string;
  title: string;
  department: string;
  budget: number;
  status: 'In Progress' | 'Planned' | 'Completed' | 'Delayed' | string;
  location: string;
  timeline: string;
  progress: number;
  risk?: 'Low' | 'Medium' | 'High';
  postedBy?: string;
  photoUrl?: string;
  pdfDocName?: string;
  pdfDocSize?: string;
}

export interface BudgetAllocation {
  department: string;
  allocated: number;
  spent: number;
}

export interface BudgetSummary {
  fiscal_year: number;
  total_budget: number;
  allocations: BudgetAllocation[];
}

export interface CitizenFeedback {
  id: string;
  type: string;
  location: string;
  description: string;
  submittedAt: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | string;
  isAnonymous?: boolean;
  contactEmail?: string;
  priority?: 'High' | 'Medium' | 'Low';
  comments?: Array<{
    id: string;
    author: string;
    isAnonymous: boolean;
    text: string;
    createdAt: string;
  }>;
}

export interface AIChatMessageTurn {
  role: 'user' | 'assistant' | 'ai';
  content: string;
}

export interface AIChatResponse {
  session_id: string;
  response: string;
  confidence_score: number;
  model_used?: string;
  generated_sql?: string;
  data_sources?: string[];
  pdf_attachment_name?: string;
  pdf_snippet?: string;
  suggested_followups?: string[];
}

export interface CortexModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  badge?: string;
}

export interface AuditDocumentInfo {
  filename: string;
  title: string;
  contract_id: string;
  abc_budget: string;
  agency: string;
  progress_pct: number;
  safety_score: string;
  status: string;
}

// 1. Projects API
export const fetchProjects = async (department?: string): Promise<CivicProject[]> => {
  const params = department ? { department } : {};
  const res = await httpClient.get<CivicProject[]>('/projects', { params });
  return res.data;
};

export const createProject = async (data: Partial<CivicProject>): Promise<CivicProject> => {
  const res = await httpClient.post<CivicProject>('/projects', data);
  return res.data;
};

// 2. Budgets API
export const fetchBudgetSummary = async (): Promise<BudgetSummary> => {
  const res = await httpClient.get<BudgetSummary>('/budgets/summary');
  return res.data;
};

export const createBudgetAllocation = async (data: {
  fiscal_year?: number;
  department: string;
  allocated: number;
  spent?: number;
}): Promise<any> => {
  const res = await httpClient.post('/budgets', data);
  return res.data;
};

// 3. Feedback API
export const fetchFeedback = async (): Promise<CitizenFeedback[]> => {
  const res = await httpClient.get<CitizenFeedback[]>('/feedback');
  return res.data;
};

export const submitFeedback = async (data: {
  report_type: string;
  address: string;
  description: string;
  citizen_contact?: string;
  submit_anonymously?: boolean;
}): Promise<CitizenFeedback> => {
  const res = await httpClient.post<CitizenFeedback>('/feedback/submit', data);
  return res.data;
};

// 4. AI Chat & Document Audit API
export const sendAIChatQuery = async (
  query: string,
  sessionId: string = 'session-default',
  history: AIChatMessageTurn[] = [],
  model: string = 'llama3-70b',
  datasetScope: string = 'All Datasets (Snowflake Hybrid)'
): Promise<AIChatResponse> => {
  const formattedHistory = history.map((h) => ({
    role: h.role === 'user' ? 'user' : 'assistant',
    content: h.content,
  }));

  const res = await httpClient.post<AIChatResponse>('/ai/chat', {
    query,
    session_id: sessionId,
    history: formattedHistory,
    model,
    dataset_scope: datasetScope,
  });
  return res.data;
};

export const fetchAIModels = async (): Promise<{ active_default: string; models: CortexModelInfo[] }> => {
  try {
    const res = await httpClient.get<{ active_default: string; models: CortexModelInfo[] }>('/ai/models');
    return res.data;
  } catch (err) {
    return {
      active_default: 'llama3-70b',
      models: [
        {
          id: 'llama3-70b',
          name: 'Cortex Llama 3 70B',
          provider: 'Meta / Snowflake Cortex',
          description: 'Optimized for civic data reasoning & audit analytics',
          badge: 'Recommended'
        },
        {
          id: 'llama3.1-405b',
          name: 'Cortex Llama 3.1 405B',
          provider: 'Meta / Snowflake Cortex',
          description: 'Frontier AI model for deep technical verification',
          badge: 'Frontier AI'
        },
        {
          id: 'mistral-large',
          name: 'Cortex Mistral Large',
          provider: 'Mistral AI / Snowflake Cortex',
          description: 'Multilingual contract & technical audit evaluation',
          badge: 'Enterprise'
        }
      ]
    };
  }
};

export const fetchAIDocuments = async (): Promise<{ total_documents: number; documents: AuditDocumentInfo[] }> => {
  try {
    const res = await httpClient.get<{ total_documents: number; documents: AuditDocumentInfo[] }>('/ai/documents');
    return res.data;
  } catch (err) {
    return {
      total_documents: 5,
      documents: [
        {
          filename: 'DPWH_Contract_23CSX012_Davao_Bypass_Tunnel.pdf',
          title: 'Davao City Bypass Construction Project Audit',
          contract_id: '23CSX012',
          abc_budget: 'PHP 13,200,000,000.00',
          agency: 'DPWH Region XI / JICA',
          progress_pct: 64.0,
          safety_score: '98.5%',
          status: 'On Track'
        },
        {
          filename: 'DPWH_Contract_24C00088_Metro_Manila_Flood_Control.pdf',
          title: 'Metro Manila Flood Control & Drainage Improvement',
          contract_id: '24C00088',
          abc_budget: 'PHP 4,750,000,000.00',
          agency: 'DPWH National Capital Region',
          progress_pct: 41.2,
          safety_score: '88.0%',
          status: 'Delayed by 14 weeks'
        },
        {
          filename: 'DPWH_Contract_24Z00001_Bataan_Cavite_Bridge.pdf',
          title: 'Bataan-Cavite Interlink Bridge Project',
          contract_id: '24Z00001',
          abc_budget: 'PHP 15,480,000,000.00',
          agency: 'DPWH UPMO',
          progress_pct: 32.4,
          safety_score: '95.2%',
          status: 'On Track'
        },
        {
          filename: 'Maple_Bridge_Structural_Inspection_Report.pdf',
          title: 'Maple Street Bridge Structural Inspection 2026',
          contract_id: 'MUNI-MB-2026',
          abc_budget: 'USD $45,000.00 Overrun',
          agency: 'Municipal Infrastructure Bureau',
          progress_pct: 82.0,
          safety_score: '76.4%',
          status: 'Defect Flagged'
        },
        {
          filename: 'Oakridge_Solar_Technical_Audit_Proof.pdf',
          title: 'Oakridge High School Solar Conversion Audit',
          contract_id: 'EDU-SOLAR-09',
          abc_budget: 'USD $1,250,000.00',
          agency: 'Department of Education',
          progress_pct: 68.0,
          safety_score: '99.1%',
          status: 'Verified Tier 1'
        }
      ]
    };
  }
};

export const summarizeDocument = async (filename: string): Promise<AIChatResponse> => {
  try {
    const res = await httpClient.post<AIChatResponse>(`/ai/summarize-document?filename=${encodeURIComponent(filename)}`);
    return res.data;
  } catch (err) {
    return sendAIChatQuery(`Summarize technical audit findings in document ${filename}`);
  }
};


