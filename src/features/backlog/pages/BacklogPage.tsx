import React, { useState } from 'react';
import KPIWidget from '../../../shared/components/business/KPIWidget';

interface SprintTask {
  id: string;
  title: string;
  processArea: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'QC Review' | 'Done';
  assignee: string;
}

export const BacklogPage: React.FC = () => {
  const [tasks, setTasks] = useState<SprintTask[]>([
    { id: 'TM-784', title: 'Setup auto-routing for DW leads based on language preference', processArea: 'Driver Welcome', priority: 'High', status: 'In Progress', assignee: 'Dev Lead' },
    { id: 'TM-785', title: 'Implement fatal error notification alert trigger for TH supervisors', processArea: 'QC Compliance', priority: 'High', status: 'To Do', assignee: 'QC Dev' },
    { id: 'TM-786', title: 'Add fastag pricing combobox inside MM dialer console page', processArea: 'Matchmaking', priority: 'Medium', status: 'QC Review', assignee: 'Frontend Dev' },
    { id: 'TM-787', title: 'Fix callback date selection timezone sync in Laravel API', processArea: 'Dialer Core', priority: 'Low', status: 'Done', assignee: 'Backend Dev' }
  ]);

  const handleNextStatus = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const statusOrder: SprintTask['status'][] = ['To Do', 'In Progress', 'QC Review', 'Done'];
          const currentIdx = statusOrder.indexOf(t.status);
          const nextIdx = (currentIdx + 1) % statusOrder.length;
          return { ...t, status: statusOrder[nextIdx] };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-md">
      {/* Sprint stats */}
      <div className="grid grid-cols-4 gap-md">
        <KPIWidget title="Active Sprint" value="Sprint #14" subtext="Ends in 4 days" icon="flag" />
        <KPIWidget title="Sprint progress" value="58% Completed" subtext="12 / 24 tasks done" icon="check_circle" />
        <KPIWidget title="High Priority Tasks" value="2 Items" subtext="Requires immediate fix" color="text-error" icon="priority_high" />
        <KPIWidget title="Story Points Committed" value="62 Points" subtext="48 points resolved" icon="assessment" />
      </div>

      {/* Task Board / Table */}
      <div className="bg-white border border-outline-variant rounded-sm p-md flipkart-shadow">
        <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
          <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface">
            Active Sprint Backlog Issues
          </h3>
          <span className="text-[10px] text-outline uppercase font-bold tracking-wider">
            Click Status to cycle state (Simulation)
          </span>
        </div>

        <div className="overflow-x-auto border border-outline-variant rounded-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="p-sm font-label-caps text-outline font-bold">Task ID</th>
                <th className="p-sm font-label-caps text-outline font-bold">Title</th>
                <th className="p-sm font-label-caps text-outline font-bold">Process Area</th>
                <th className="p-sm font-label-caps text-outline font-bold">Priority</th>
                <th className="p-sm font-label-caps text-outline font-bold">Assignee</th>
                <th className="p-sm font-label-caps text-outline font-bold">Status Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {tasks.map((t) => {
                const statusStyles = {
                  'To Do': 'bg-gray-100 text-gray-800 border-gray-300',
                  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
                  'QC Review': 'bg-amber-100 text-amber-800 border-amber-300',
                  'Done': 'bg-green-100 text-green-800 border-green-300'
                };

                return (
                  <tr key={t.id} className="hover:bg-surface-container-low transition-colors bg-white">
                    <td className="p-sm font-bold text-primary">{t.id}</td>
                    <td className="p-sm font-semibold text-on-surface-variant max-w-[300px] truncate" title={t.title}>
                      {t.title}
                    </td>
                    <td className="p-sm text-outline">{t.processArea}</td>
                    <td className="p-sm">
                      <span className={`font-bold ${t.priority === 'High' ? 'text-error' : t.priority === 'Medium' ? 'text-amber-600' : 'text-outline'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-sm font-semibold">{t.assignee}</td>
                    <td className="p-sm">
                      <button
                        onClick={() => handleNextStatus(t.id)}
                        className={`px-2 py-0.5 border rounded-sm font-bold text-[9px] uppercase transition-all hover:scale-105 active:scale-95 ${
                          statusStyles[t.status]
                        }`}
                      >
                        {t.status}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default BacklogPage;
