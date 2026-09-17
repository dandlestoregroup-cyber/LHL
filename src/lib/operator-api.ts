import type {
  OperatorPortfolioCandidate,
  OperatorPortfolioImport,
  OperatorWorkspace,
  OperatorWorkspaceInput,
  PortfolioPreview,
  PortfolioSourceRow,
} from './operator-workspace';

export interface OperatorWorkspaceBundle {
  workspace: OperatorWorkspace | null;
  candidates: OperatorPortfolioCandidate[];
  imports: OperatorPortfolioImport[];
}

export class OperatorApiError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
    this.name = 'OperatorApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });
  if (!response.ok) {
    let code = `request_failed_${response.status}`;
    try {
      const body = await response.json() as { error?: string };
      if (body.error) code = body.error;
    } catch {
      // Keep status-derived code.
    }
    throw new OperatorApiError(code, response.status);
  }
  return response.json() as Promise<T>;
}

export function fetchOperatorWorkspaceBundle(): Promise<OperatorWorkspaceBundle> {
  return request('/api/live/operator/workspace');
}

export async function saveOperatorWorkspace(input: OperatorWorkspaceInput): Promise<OperatorWorkspace> {
  const result = await request<{ workspace: OperatorWorkspace }>('/api/live/operator/workspace', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return result.workspace;
}

export async function previewOperatorPortfolio(rows: PortfolioSourceRow[]): Promise<PortfolioPreview> {
  const result = await request<{ preview: PortfolioPreview }>('/api/live/operator/portfolio/preview', {
    method: 'POST',
    body: JSON.stringify({ rows }),
  });
  return result.preview;
}

export function importOperatorPortfolio(rows: PortfolioSourceRow[], sourceName: string): Promise<{
  importJob: OperatorPortfolioImport;
  candidates: OperatorPortfolioCandidate[];
  preview: PortfolioPreview;
}> {
  return request('/api/live/operator/portfolio/import', {
    method: 'POST',
    body: JSON.stringify({ rows, sourceName, sourceType: 'csv' }),
  });
}
