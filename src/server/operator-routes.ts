import type { Express, Request, Response } from 'express';
import type { PortfolioSourceRow } from '../lib/operator-workspace';
import {
  getOperatorWorkspace,
  importOperatorPortfolio,
  listOperatorPortfolioCandidates,
  listOperatorPortfolioImports,
  previewOperatorPortfolio,
  saveOperatorWorkspace,
} from './operator-workspace';
import type { LiveSession } from './session-auth';

type RequireSession = (req: Request) => LiveSession;
type SendError = (res: Response, error: unknown) => Response;

export function registerOperatorRoutes(app: Express, requireSession: RequireSession, sendError: SendError): void {
  app.get('/api/live/operator/workspace', async (req, res) => {
    try {
      const session = requireSession(req);
      const [workspace, candidates, imports] = await Promise.all([
        getOperatorWorkspace(session),
        listOperatorPortfolioCandidates(session),
        listOperatorPortfolioImports(session),
      ]);
      return res.json({ workspace, candidates, imports });
    } catch (error) {
      return sendError(res, error);
    }
  });

  app.put('/api/live/operator/workspace', async (req, res) => {
    try {
      const workspace = await saveOperatorWorkspace(requireSession(req), req.body || {});
      return res.json({ workspace });
    } catch (error) {
      return sendError(res, error);
    }
  });

  app.post('/api/live/operator/portfolio/preview', async (req, res) => {
    try {
      const rows = (Array.isArray(req.body?.rows) ? req.body.rows : []) as PortfolioSourceRow[];
      const preview = await previewOperatorPortfolio(requireSession(req), rows);
      return res.json({ preview });
    } catch (error) {
      return sendError(res, error);
    }
  });

  app.post('/api/live/operator/portfolio/import', async (req, res) => {
    try {
      const result = await importOperatorPortfolio(requireSession(req), {
        rows: Array.isArray(req.body?.rows) ? req.body.rows : [],
        sourceName: req.body?.sourceName,
        sourceType: req.body?.sourceType,
      });
      return res.status(201).json(result);
    } catch (error) {
      return sendError(res, error);
    }
  });
}
