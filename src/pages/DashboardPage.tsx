import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FileText, LifeBuoy, Mic2 } from 'lucide-react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { TaskList } from '../components/dashboard/TaskList';
import { getProjects } from '../services/portalService';
import { useAuth } from '../contexts/AuthContext';
import { filterProjectsForUser } from '../utils/permissions';
import { productBrand } from '../constants/branding';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
  const scopedProjects = filterProjectsForUser(projects, user);
  const recentActivity = scopedProjects.flatMap((project) => project.activity).slice(0, 4);
  const todayTasks = [...new Set(scopedProjects.flatMap((project) => project.tasks.filter((task) => !task.completed).map((task) => task.text)))].slice(0, 3);
  const metrics = [
    { label: 'Projects', value: scopedProjects.length },
    { label: 'Completed', value: scopedProjects.filter((project) => project.status === 'completed').length },
    { label: 'In Progress', value: scopedProjects.filter((project) => ['in_progress', 'awaiting_approval'].includes(project.status)).length },
    { label: 'Awaiting Approval', value: scopedProjects.filter((project) => project.status === 'awaiting_approval').length },
    { label: 'Delayed', value: scopedProjects.filter((project) => project.status === 'delayed').length },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.18),rgba(2,6,23,0.65))] p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.32em] text-teal-200/80">{productBrand.workspace}</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Dashboard</h2>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Link to={user?.isPlatformOwner ? '/voice-updates' : '/search'} className="group rounded-3xl border border-sky-300/20 bg-sky-500/10 p-5 shadow-soft transition hover:border-sky-200/40 hover:bg-sky-500/15">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-400 text-slate-950"><Mic2 className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-semibold text-white">Voice updates</p>
              <p className="text-xs text-slate-400">{user?.isPlatformOwner ? 'Batch project updates' : 'Leave a voice note'}</p>
            </div>
          </div>
        </Link>
        <Link to="/projects" className="group rounded-3xl border border-emerald-300/20 bg-emerald-500/10 p-5 shadow-soft transition hover:border-emerald-200/40 hover:bg-emerald-500/15">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400 text-slate-950"><FileText className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-semibold text-white">Text project updates</p>
              <p className="text-xs text-slate-400">Search, open, update</p>
            </div>
          </div>
        </Link>
        <Link to="/support" className="group rounded-3xl border border-teal-300/20 bg-teal-500/10 p-5 shadow-soft transition hover:border-teal-200/40 hover:bg-teal-500/15">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-300 text-slate-950"><LifeBuoy className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-semibold text-white">User interaction</p>
              <p className="text-xs text-slate-400">Requests and support</p>
            </div>
          </div>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <ActivityFeed items={recentActivity} />
        <TaskList tasks={todayTasks} />
      </section>
    </div>
  );
}
