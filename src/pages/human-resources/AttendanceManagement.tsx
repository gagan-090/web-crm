import React, { useState, useEffect } from 'react';
import { useGetHrAttendanceQuery } from '../../services/api/webCrmApi';

interface AttendanceRecord {
  id: number;
  callerId: number;
  callerName: string;
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
  workingHours: number;
  breakTime: string;
  totalCalls: number;
}

export const AttendanceManagement: React.FC = () => {
  const { data: realAttendanceData } = useGetHrAttendanceQuery();
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (realAttendanceData?.attendance && realAttendanceData.attendance.length > 0) {
      setLogs(realAttendanceData.attendance);
      setSelectedRecord(realAttendanceData.attendance[0]);
    } else {
      const mockLogs = [
        { id: 1, callerId: 101, callerName: 'Amit Kumar', date: '24 Jun 2026', status: 'present', checkIn: '09:25 AM', checkOut: '06:00 PM', workingHours: 7.8, breakTime: '45m', totalCalls: 42 },
        { id: 2, callerId: 102, callerName: 'Sonam Singh', date: '24 Jun 2026', status: 'present', checkIn: '09:28 AM', checkOut: '05:30 PM', workingHours: 7.2, breakTime: '30m', totalCalls: 38 },
        { id: 3, callerId: 103, callerName: 'Rahul Prasad', date: '24 Jun 2026', status: 'present', checkIn: '08:55 AM', checkOut: '06:00 PM', workingHours: 8.5, breakTime: '40m', totalCalls: 45 },
        { id: 4, callerId: 104, callerName: 'Vikas Joshi', date: '24 Jun 2026', status: 'absent', checkIn: '09:00 AM', checkOut: '06:00 PM', workingHours: 0, breakTime: '0m', totalCalls: 0 }
      ];
      setLogs(mockLogs);
      setSelectedRecord(mockLogs[1]); // Sonam Singh default
    }
  }, [realAttendanceData]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <main className=" p-margin-page text-xs">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Attendance Management</h2>
          <p className="text-body-md text-on-surface-variant">Real-time presence monitoring &amp; compliance tracking</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-label-md rounded flex items-center gap-2 hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            June 2026
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary text-label-md rounded font-bold hover:bg-primary-container transition-colors">
            Export Monthly Report
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-gutter">
        {/* Presence Heatmap */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title-sm text-title-sm text-primary">Team Presence Heatmap</h3>
            <span className="text-label-md text-on-surface-variant">Avg: 88.4%</span>
          </div>
          <div className="calendar-grid mb-4">
            <div className="text-center text-[10px] font-bold text-on-surface-variant">M</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant">T</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant">W</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant">T</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant">F</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant">S</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant">S</div>

            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">1</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">2</div>
            <div className="heatmap-cell bg-tertiary-container/30 text-tertiary-container">3</div>
            <div className="heatmap-cell bg-tertiary-container/80 text-white">4</div>
            <div className="heatmap-cell bg-tertiary-container text-white">5</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">6</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">7</div>
            <div className="heatmap-cell bg-tertiary-container/60 text-white">8</div>
            <div className="heatmap-cell bg-secondary-container text-white">9</div>
            <div className="heatmap-cell bg-tertiary-container text-white">10</div>
            <div className="heatmap-cell bg-error/70 text-white">11</div>
            <div className="heatmap-cell bg-tertiary-container text-white">12</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">13</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">14</div>
            <div className="heatmap-cell bg-tertiary-container/90 text-white">15</div>
            <div className="heatmap-cell bg-tertiary-container text-white">16</div>
            <div className="heatmap-cell bg-tertiary-container text-white">17</div>
            <div className="heatmap-cell bg-secondary-container/80 text-white">18</div>
            <div className="heatmap-cell bg-tertiary-container text-white">19</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">20</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">21</div>
            <div className="heatmap-cell bg-tertiary-container text-white ring-2 ring-primary ring-inset">22</div>
            <div className="heatmap-cell bg-tertiary-container text-white">23</div>
            <div className="heatmap-cell bg-tertiary-container text-white">24</div>
            <div className="heatmap-cell bg-tertiary-container text-white">25</div>
            <div className="heatmap-cell bg-tertiary-container text-white">26</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">27</div>
            <div className="heatmap-cell bg-surface-container-high text-on-surface-variant">28</div>
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-outline-variant">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-tertiary-container"></div>
              <span className="text-[10px] text-on-surface-variant">&gt;90%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-secondary-container"></div>
              <span className="text-[10px] text-on-surface-variant">70-90%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-error"></div>
              <span className="text-[10px] text-on-surface-variant">&lt;70%</span>
            </div>
          </div>
        </div>

        {/* Presence Logs Table */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-title-sm text-title-sm text-primary">Caller Presence Logs ({selectedRecord?.date})</h3>
            <button className="text-primary text-label-md font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter Team
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Employee</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Check In</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center font-bold">Check Out</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center">Working Hours</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center">Break</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center">Calls Made</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-medium text-gray-700">
                {logs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedRecord(log)}
                    className={`hover:bg-surface-container transition-colors cursor-pointer ${selectedRecord?.id === log.id ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-density-table-px py-density-table-py flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center text-[10px] font-bold">
                        {getInitials(log.callerName)}
                      </div>
                      <div>
                        <span className="text-body-sm font-semibold block">{log.callerName}</span>
                        <span className="text-[9.5px] px-1 py-0.2 bg-gray-100 text-gray-500 rounded uppercase font-extrabold">{log.status}</span>
                      </div>
                    </td>
                    <td className="px-density-table-px py-density-table-py text-body-sm font-mono">{log.status === 'present' ? log.checkIn : '—'}</td>
                    <td className="px-density-table-px py-density-table-py text-body-sm text-center font-mono">{log.status === 'present' ? log.checkOut : '—'}</td>
                    <td className="px-density-table-px py-density-table-py text-body-sm text-center font-mono">{log.status === 'present' ? `${log.workingHours} hrs` : '—'}</td>
                    <td className="px-density-table-px py-density-table-py text-body-sm text-center font-mono">{log.status === 'present' ? log.breakTime : '—'}</td>
                    <td className="px-density-table-px py-density-table-py text-body-sm text-center font-mono font-bold text-primary">{log.totalCalls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-auto p-3 border-t border-outline-variant bg-surface-container-low flex justify-end">
            <button className="text-label-md font-bold text-primary hover:underline">View All {logs.length} Callers</button>
          </div>
        </div>

        {/* Selected Caller Detail Card */}
        {selectedRecord && (
          <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full"></div>
            <div className="flex items-start justify-between mb-6 relative">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                    {getInitials(selectedRecord.callerName)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${selectedRecord.status === 'present' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                </div>
                <div>
                  <h4 className="font-title-sm text-title-sm text-primary">{selectedRecord.callerName}</h4>
                  <span className="text-label-md px-2 py-0.5 bg-secondary-container/10 text-secondary border border-secondary-container/20 rounded">Telecaller</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Compliance</span>
                <span className="text-label-md font-bold text-tertiary-container">
                  {selectedRecord.status === 'present' ? '100% Compliant' : 'Absent'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-surface-container-low p-3 rounded">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Availability Window</p>
                <p className="text-body-sm font-bold text-primary">09:00 AM – 01:00 PM</p>
                <p className="text-body-sm font-bold text-primary">02:00 PM – 06:00 PM</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Today's Stats</p>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm">Login:</span>
                    <span className="text-body-sm font-data-mono font-bold">{selectedRecord.checkIn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm">CRM Activity:</span>
                    <span className="text-body-sm font-data-mono font-bold">{selectedRecord.totalCalls} Calls</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-label-md">
                <span className="text-on-surface-variant">Session Progress</span>
                <span className="font-bold text-primary">{selectedRecord.workingHours} / 8.0 Hours</span>
              </div>
              <div className="w-full bg-outline-variant h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${(selectedRecord.workingHours / 8.0) * 100}%` }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Requests */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded">
          <div className="p-4 border-b border-outline-variant">
            <h3 className="font-title-sm text-title-sm text-primary">Pending Leave Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Employee</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Period</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Reason</th>
                  <th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr>
                  <td className="px-density-table-px py-density-table-py">
                    <p className="text-body-sm font-bold text-primary">Priya Sharma</p>
                    <p className="text-[10px] text-on-surface-variant">Accountant</p>
                  </td>
                  <td className="px-density-table-px py-density-table-py text-body-sm">
                    Oct 24 - Oct 25 <br />
                    <span className="text-[10px] font-bold text-on-surface-variant">(2 Days)</span>
                  </td>
                  <td className="px-density-table-px py-density-table-py text-body-sm text-on-surface-variant italic">Family function in hometown.</td>
                  <td className="px-density-table-px py-density-table-py text-right">
                    <div className="flex justify-end gap-2">
                      <button className="w-8 h-8 rounded-full border border-error text-error hover:bg-error hover:text-white transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                      <button className="w-8 h-8 rounded-full border border-tertiary-container text-tertiary-container hover:bg-tertiary-container hover:text-white transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-density-table-px py-density-table-py">
                    <p className="text-body-sm font-bold text-primary">Arjun Mehta</p>
                    <p className="text-[10px] text-on-surface-variant">IT Support</p>
                  </td>
                  <td className="px-density-table-px py-density-table-py text-body-sm">
                    Oct 28 <br />
                    <span className="text-[10px] font-bold text-on-surface-variant">(1 Day)</span>
                  </td>
                  <td className="px-density-table-px py-density-table-py text-body-sm text-on-surface-variant italic">Medical Checkup.</td>
                  <td className="px-density-table-px py-density-table-py text-right">
                    <div className="flex justify-end gap-2">
                      <button className="w-8 h-8 rounded-full border border-error text-error hover:bg-error hover:text-white transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                      <button className="w-8 h-8 rounded-full border border-tertiary-container text-tertiary-container hover:bg-tertiary-container hover:text-white transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AttendanceManagement;
