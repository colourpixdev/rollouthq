import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Project, UserRecord } from '../../types/domain';
import { kanbanColumns, timelineStages } from '../../constants/portal';
import { canChangeProjectStage, getAllowedStageOptions } from '../../utils/permissions';

const columnMatch: Record<string, string[]> = {
  'Awaiting Survey': ['New Project', 'Awaiting Information', 'Site Survey', 'Measurements Received'],
  Artwork: ['Artwork In Progress', 'Artwork Sent'],
  Approval: ['Awaiting Approval', 'Approved'],
  Production: ['Quotation Requested', 'Quotation Received', 'PO Issued', 'Production'],
  Installation: ['Installation Scheduled', 'Installation In Progress', 'Installed', 'Photos Uploaded', 'Client Signoff'],
  Completed: ['Completed'],
};

function KanbanCard({
  project,
  user,
  canMove,
  isMoving,
  onMove,
}: {
  project: Project;
  user?: UserRecord | null;
  canMove: boolean;
  isMoving: boolean;
  onMove: (project: Project, stage: Project['currentStage']) => void;
}) {
  const [selectedStage, setSelectedStage] = useState(project.currentStage);
  const openQuestions = project.comments.filter((comment) => comment.kind === 'question' && comment.status !== 'answered').length;
  const unreadAnswers = project.comments.filter((comment) => comment.kind === 'question' && comment.status === 'answered' && comment.unreadForRequester && (comment.requesterEmail ? comment.requesterEmail === user?.email : comment.author === user?.name)).length;
  const allowedStageOptions = getAllowedStageOptions(user, project, timelineStages);
  const hasAllowedStageChange = allowedStageOptions.some((stage) => stage !== project.currentStage);
  const canApplySelectedStage = selectedStage !== project.currentStage && canChangeProjectStage(user, project, selectedStage);

  useEffect(() => {
    setSelectedStage(project.currentStage);
  }, [project.currentStage]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
      <Link to={`/projects/${project.id}`} className="block transition hover:text-sky-100">
        <p className="font-medium text-white">{project.branch}</p>
        <p className="mt-1 text-slate-400">{project.currentStage}</p>
        <p className="mt-2 text-xs text-slate-500">{project.id}</p>
        {openQuestions > 0 || unreadAnswers > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {unreadAnswers > 0 ? <span className="rounded-full border border-emerald-400/25 bg-emerald-500/15 px-2 py-1 text-[0.68rem] font-semibold text-emerald-100">{unreadAnswers} new</span> : null}
            {openQuestions > 0 ? <span className="rounded-full border border-amber-400/25 bg-amber-500/15 px-2 py-1 text-[0.68rem] font-semibold text-amber-100">{openQuestions} open</span> : null}
          </div>
        ) : null}
      </Link>

      {canMove && hasAllowedStageChange ? (
        <div className="mt-4 grid gap-2">
          <select aria-label={`Move ${project.branch} stage`} value={selectedStage} onChange={(event) => setSelectedStage(event.target.value as Project['currentStage'])} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white outline-none focus:border-sky-400/50">
            {allowedStageOptions.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
          </select>
          <button type="button" aria-label={`Apply stage move for ${project.branch}`} disabled={isMoving || !canApplySelectedStage} onClick={() => onMove(project, selectedStage)} className="rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50">
            {isMoving ? 'Moving...' : 'Move stage'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function KanbanBoard({
  projects,
  user,
  canMove = false,
  movingProjectId = null,
  onMoveProject,
}: {
  projects: Project[];
  user?: UserRecord | null;
  canMove?: boolean;
  movingProjectId?: string | null;
  onMoveProject?: (project: Project, stage: Project['currentStage']) => void;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-6">
      {kanbanColumns.map((column) => {
        const matches = projects.filter((project) => columnMatch[column].includes(project.currentStage));
        return (
          <section key={column} className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">{column}</h3>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-200">{matches.length}</span>
            </div>
            <div className="mt-4 space-y-3">
              {matches.map((project) => (
                <KanbanCard key={project.id} project={project} user={user} canMove={canMove && Boolean(onMoveProject)} isMoving={movingProjectId === project.id} onMove={(item, stage) => onMoveProject?.(item, stage)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
