import crypto from 'node:crypto';
import {
  normalizeOperatorWorkspaceInput,
  previewPortfolioRows,
  type OperatorPortfolioCandidate,
  type OperatorPortfolioImport,
  type OperatorWorkspace,
  type OperatorWorkspaceInput,
  type PortfolioPreview,
  type PortfolioSourceRow,
} from '../lib/operator-workspace';
import { commitDocuments, createDocument, getDocument, listDocuments, replaceDocument, type AtomicDocumentWrite } from './firestore-rest';
import { LiveStoreError, sessionPartner } from './live-store';
import type { LiveSession } from './session-auth';

const chunk = <T>(items: T[], size: number): T[][] => {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) groups.push(items.slice(index, index + size));
  return groups;
};

const sourceName = (value: unknown): string => {
  if (typeof value !== 'string' || !value.trim()) return 'portfolio.csv';
  return value.trim().slice(0, 180);
};

const sourceType = (value: unknown): OperatorPortfolioImport['sourceType'] => {
  if (value === 'api' || value === 'manual') return value;
  return 'csv';
};

async function requireOperator(session: LiveSession) {
  const partner = await sessionPartner(session);
  if (!partner || partner.status !== 'active' || partner.role !== 'operator') {
    throw new LiveStoreError('operator_authority_required', 403);
  }
  return partner;
}

const candidateId = (operatorPartnerId: string, externalPropertyId: string): string =>
  `opc_${crypto.createHash('sha256').update(`${operatorPartnerId}\n${externalPropertyId}`).digest('hex').slice(0, 32)}`;

export async function getOperatorWorkspace(session: LiveSession): Promise<OperatorWorkspace | null> {
  const operator = await requireOperator(session);
  const stored = await getDocument<OperatorWorkspace>('operatorWorkspaces', operator.id);
  if (!stored || stored.data.dataMode !== 'live' || stored.data.synthetic || stored.data.operatorPartnerId !== operator.id) return null;
  return stored.data;
}

export async function saveOperatorWorkspace(session: LiveSession, input: Partial<OperatorWorkspaceInput>): Promise<OperatorWorkspace> {
  const operator = await requireOperator(session);
  let normalized: OperatorWorkspaceInput;
  try {
    normalized = normalizeOperatorWorkspaceInput(input);
  } catch (error) {
    throw new LiveStoreError(error instanceof Error ? error.message : 'invalid_operator_workspace');
  }
  const now = new Date().toISOString();
  const existing = await getDocument<OperatorWorkspace>('operatorWorkspaces', operator.id);
  const workspace: OperatorWorkspace = {
    id: operator.id,
    dataMode: 'live',
    synthetic: false,
    operatorPartnerId: operator.id,
    version: existing ? existing.data.version + 1 : 1,
    createdAt: existing?.data.createdAt || now,
    updatedAt: now,
    ...normalized,
  };
  if (existing) {
    try {
      await replaceDocument('operatorWorkspaces', workspace.id, workspace as unknown as Record<string, unknown>, existing.updateTime);
    } catch (error) {
      if (error instanceof Error && error.message === 'record_changed_concurrently') throw new LiveStoreError('operator_workspace_changed_concurrently', 409);
      throw error;
    }
  } else {
    await createDocument('operatorWorkspaces', workspace.id, workspace as unknown as Record<string, unknown>);
  }
  return workspace;
}

export async function listOperatorPortfolioCandidates(session: LiveSession): Promise<OperatorPortfolioCandidate[]> {
  const operator = await requireOperator(session);
  const stored = await listDocuments<OperatorPortfolioCandidate>('operatorPortfolioCandidates');
  return stored
    .map((item) => item.data)
    .filter((item) => item.dataMode === 'live' && !item.synthetic && item.operatorPartnerId === operator.id)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function listOperatorPortfolioImports(session: LiveSession): Promise<OperatorPortfolioImport[]> {
  const operator = await requireOperator(session);
  const stored = await listDocuments<OperatorPortfolioImport>('operatorPortfolioImports');
  return stored
    .map((item) => item.data)
    .filter((item) => item.dataMode === 'live' && !item.synthetic && item.operatorPartnerId === operator.id)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

async function previewForOperator(operatorPartnerId: string, rows: PortfolioSourceRow[]): Promise<PortfolioPreview> {
  const stored = await listDocuments<OperatorPortfolioCandidate>('operatorPortfolioCandidates');
  const existingExternalIds = stored
    .map((item) => item.data)
    .filter((item) => item.dataMode === 'live' && !item.synthetic && item.operatorPartnerId === operatorPartnerId && item.status !== 'dismissed')
    .map((item) => item.externalPropertyId);
  try {
    return previewPortfolioRows(rows, existingExternalIds);
  } catch (error) {
    throw new LiveStoreError(error instanceof Error ? error.message : 'invalid_portfolio_import');
  }
}

export async function previewOperatorPortfolio(session: LiveSession, rows: PortfolioSourceRow[]): Promise<PortfolioPreview> {
  const operator = await requireOperator(session);
  const workspace = await getDocument<OperatorWorkspace>('operatorWorkspaces', operator.id);
  if (!workspace) throw new LiveStoreError('operator_workspace_required', 409);
  return previewForOperator(operator.id, rows);
}

export async function importOperatorPortfolio(
  session: LiveSession,
  input: { rows?: PortfolioSourceRow[]; sourceName?: unknown; sourceType?: unknown },
): Promise<{ importJob: OperatorPortfolioImport; candidates: OperatorPortfolioCandidate[]; preview: PortfolioPreview }> {
  const operator = await requireOperator(session);
  const workspaceStored = await getDocument<OperatorWorkspace>('operatorWorkspaces', operator.id);
  if (!workspaceStored) throw new LiveStoreError('operator_workspace_required', 409);
  const rows = Array.isArray(input.rows) ? input.rows : [];
  const preview = await previewForOperator(operator.id, rows);
  const now = new Date().toISOString();
  const importId = `opi_${crypto.randomUUID()}`;
  const candidates: OperatorPortfolioCandidate[] = preview.rows
    .filter((row) => row.status === 'accepted' && row.normalized)
    .map((row) => {
      const normalized = row.normalized!;
      return {
        id: candidateId(operator.id, normalized.externalPropertyId),
        dataMode: 'live' as const,
        synthetic: false as const,
        workspaceId: workspaceStored.data.id,
        operatorPartnerId: operator.id,
        importId,
        sourceName: sourceName(input.sourceName),
        externalPropertyId: normalized.externalPropertyId,
        propertyName: normalized.propertyName,
        propertyNameAr: normalized.propertyNameAr,
        country: normalized.country,
        region: normalized.region,
        locationLabel: normalized.locationLabel,
        locationLabelAr: normalized.locationLabelAr,
        ownerReference: normalized.ownerReference,
        operatingModel: normalized.operatingModel || workspaceStored.data.operatingModel,
        provenance: 'reported' as const,
        reportedMomentCandidates: row.reportedMomentCandidates,
        unsupportedSourceFields: row.unsupportedSourceFields,
        status: 'ready_for_sourcing' as const,
        nextAction: 'Route to a Scout for source and owner-consent verification. Imported data remains reported until the relevant evidence gate resolves it.',
        createdAt: now,
        updatedAt: now,
      };
    });

  try {
    for (const group of chunk(candidates, 20)) {
      const writes: AtomicDocumentWrite[] = group.map((candidate) => ({
        mode: 'create',
        collection: 'operatorPortfolioCandidates',
        id: candidate.id,
        data: candidate as unknown as Record<string, unknown>,
      }));
      await commitDocuments(writes);
    }
  } catch (error) {
    if (error instanceof Error && ['record_changed_concurrently', 'record_already_exists'].includes(error.message)) {
      throw new LiveStoreError('portfolio_import_changed_concurrently', 409);
    }
    throw error;
  }

  const importJob: OperatorPortfolioImport = {
    id: importId,
    dataMode: 'live',
    synthetic: false,
    workspaceId: workspaceStored.data.id,
    operatorPartnerId: operator.id,
    sourceName: sourceName(input.sourceName),
    sourceType: sourceType(input.sourceType),
    status: preview.reviewRows > 0 || preview.rejectedRows > 0 ? 'needs_review' : 'completed',
    totalRows: preview.totalRows,
    acceptedRows: preview.acceptedRows,
    reviewRows: preview.reviewRows,
    rejectedRows: preview.rejectedRows,
    createdAt: now,
    updatedAt: now,
  };
  await createDocument('operatorPortfolioImports', importJob.id, importJob as unknown as Record<string, unknown>);
  return { importJob, candidates, preview };
}
