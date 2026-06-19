import React, { useState, useMemo } from 'react';
import DataTable from '../../../shared/components/business/DataTable';
import SLAIndicator from '../../../shared/components/business/SLAIndicator';
import type { ColumnDef } from '@tanstack/react-table';
import { useClickToCall } from '../../../shared/hooks/useClickToCall';

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  process: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'Connected' | 'Callback' | 'Interested' | 'Not Interested';
  lastCalled: string;
  slaStatus: 'optimal' | 'warning' | 'breached';
  assignedCaller: string;
}

export const LeadManagementPage: React.FC = () => {
  const { triggerCall } = useClickToCall();
  const [selectedRowSelection, setSelectedRowSelection] = useState<Record<string, boolean>>({});
  const [drawerLead, setDrawerLead] = useState<LeadItem | null>(null);
  
  // Local filters state
  const [search, setSearch] = useState('');
  const [processFilter, setProcessFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const rawData: LeadItem[] = [
    { id: 'LD-4012', name: 'Rajesh Transports', phone: '+91 98765 43210', process: 'Transporter Welcome', priority: 'High', status: 'Connected', lastCalled: '10 mins ago', slaStatus: 'optimal', assignedCaller: 'WCT Agent 03' },
    { id: 'LD-4013', name: 'Manish Kumar', phone: '+91 91234 56789', process: 'Driver Welcome', priority: 'High', status: 'Callback', lastCalled: '2 hours ago', slaStatus: 'warning', assignedCaller: 'DW Agent 04' },
    { id: 'LD-4014', name: 'Ravi Logistics', phone: '+91 98123 45678', process: 'Transporter Welcome', priority: 'Medium', status: 'New', lastCalled: 'Never', slaStatus: 'optimal', assignedCaller: 'Unassigned' },
    { id: 'LD-4015', name: 'Satish Yadav', phone: '+91 95432 10987', process: 'Driver Welcome', priority: 'Low', status: 'Not Interested', lastCalled: 'Yesterday', slaStatus: 'optimal', assignedCaller: 'DW Agent 01' },
    { id: 'LD-4016', name: 'Sher Singh Freight', phone: '+91 81234 98765', process: 'Matchmaking', priority: 'High', status: 'Interested', lastCalled: '30 mins ago', slaStatus: 'optimal', assignedCaller: 'MM Agent 02' },
    { id: 'LD-4017', name: 'Jai Durga Carriers', phone: '+91 90123 45678', process: 'Special Categories', priority: 'High', status: 'Connected', lastCalled: '5 mins ago', slaStatus: 'breached', assignedCaller: 'SC Agent 08' }
  ];

  // Filtering
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()) || item.phone.includes(search);
      const matchProcess = processFilter === 'ALL' || item.process === processFilter;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
      return matchSearch && matchProcess && matchStatus && matchPriority;
    });
  }, [search, processFilter, statusFilter, priorityFilter]);

  // Table columns definition
  const columns = useMemo<ColumnDef<LeadItem>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="rounded-sm border-outline-variant"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="rounded-sm border-outline-variant"
        />
      ),
    },
    {
      accessorKey: 'id',
      header: 'Lead ID',
      cell: (info) => <span className="font-bold text-primary">{info.getValue() as string}</span>
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => <span className="font-semibold">{info.getValue() as string}</span>
    },
    {
      accessorKey: 'process',
      header: 'Process Type'
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: (info) => {
        const p = info.getValue() as string;
        const color = p === 'High' ? 'text-error font-bold' : p === 'Medium' ? 'text-amber-600' : 'text-outline';
        return <span className={color}>{p}</span>;
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const s = info.getValue() as string;
        const color = s === 'Connected' ? 'bg-green-100 text-green-800' : s === 'New' ? 'bg-blue-100 text-blue-800' : s === 'Callback' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800';
        return <span className={`px-2 py-0.5 rounded-sm font-semibold text-[10px] uppercase border border-outline-variant ${color}`}>{s}</span>;
      }
    },
    {
      accessorKey: 'assignedCaller',
      header: 'Caller Assigned'
    },
    {
      accessorKey: 'slaStatus',
      header: 'SLA Status',
      cell: (info) => <SLAIndicator status={info.getValue() as any} />
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDrawerLead(row.original);
          }}
          className="px-2 py-0.5 bg-primary text-white text-[11px] font-bold rounded-sm hover:bg-primary-container transition-colors"
        >
          View Details
        </button>
      )
    }
  ], []);

  const handleBulkAssign = () => {
    alert(`Assigning ${Object.keys(selectedRowSelection).length} selected leads to active caller queue.`);
    setSelectedRowSelection({});
  };

  return (
    <div className="space-y-md relative min-h-[500px]">
      {/* Filtering Header Panel */}
      <section className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow flex items-center justify-between gap-md flex-wrap">
        <div className="flex gap-md flex-wrap flex-grow items-center">
          {/* Search Bar */}
          <div className="relative w-60">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-sm">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-sm pl-8 pr-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Search by name, ID, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
            />
          </div>

          {/* Process Filter */}
          <div className="flex flex-col">
            <select
              className="bg-white border border-outline-variant rounded-sm px-xs py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
              value={processFilter}
              onChange={(e) => setProcessFilter(e.target.value)}
            >
              <option value="ALL">All Processes</option>
              <option value="Driver Welcome">Driver Welcome</option>
              <option value="Transporter Welcome">Transporter Welcome</option>
              <option value="Matchmaking">Matchmaking</option>
              <option value="Special Categories">Special Categories</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <select
              className="bg-white border border-outline-variant rounded-sm px-xs py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="Connected">Connected</option>
              <option value="Callback">Callback</option>
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex flex-col">
            <select
              className="bg-white border border-outline-variant rounded-sm px-xs py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main DataTable Wrapper */}
      <DataTable
        columns={columns}
        data={filteredData}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.ceil(filteredData.length / pageSize) || 1}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        rowSelection={selectedRowSelection}
        onRowSelectionChange={setSelectedRowSelection}
        bulkActions={
          <div className="flex gap-sm">
            <button
              onClick={handleBulkAssign}
              className="px-sm py-1 bg-primary text-white font-bold rounded-sm hover:bg-primary-container"
            >
              Queue Allocations
            </button>
            <button
              onClick={() => setSelectedRowSelection({})}
              className="px-sm py-1 border border-outline text-on-surface bg-white font-semibold rounded-sm hover:bg-surface-container"
            >
              Dismiss
            </button>
          </div>
        }
      />

      {/* Slide-over Lead Detail Drawer */}
      {drawerLead && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setDrawerLead(null)}></div>
          <div className="w-[500px] h-full bg-white border-l border-outline-variant flex flex-col z-50 flipkart-shadow relative animate-slide-in">
            {/* Drawer Header */}
            <div className="p-md border-b border-outline-variant bg-surface-container flex items-center justify-between">
              <div>
                <div className="flex items-center gap-sm">
                  <span className="text-sm font-extrabold text-primary">{drawerLead.id}</span>
                  <span className="px-1.5 py-0.5 bg-inverse-surface text-white text-[9px] font-bold rounded-sm uppercase">
                    {drawerLead.process}
                  </span>
                </div>
                <h3 className="text-md font-bold text-on-surface mt-xs">{drawerLead.name}</h3>
              </div>
              <button
                onClick={() => setDrawerLead(null)}
                className="p-1 hover:bg-surface-container-high rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-md flex-1 overflow-y-auto space-y-md custom-scrollbar">
              {/* Contact Info */}
              <div className="bg-surface-container-low p-sm border border-outline-variant rounded-sm text-xs space-y-sm">
                <div className="flex justify-between">
                  <span className="text-outline">Phone Number:</span>
                  <span 
                    className="font-bold callable-number cursor-pointer text-primary hover:underline flex items-center gap-xs"
                    data-lead-name={drawerLead.name}
                  >
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    {drawerLead.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Assigned Operator:</span>
                  <span className="font-bold text-primary">{drawerLead.assignedCaller}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Last Called Stamp:</span>
                  <span className="font-data-mono">{drawerLead.lastCalled}</span>
                </div>
              </div>

              {/* Dialer Integration Actions */}
              <div className="space-y-sm">
                <h4 className="font-bold text-xs uppercase text-outline">Lead Dialing Controls</h4>
                <div className="flex gap-sm">
                  <button 
                    onClick={() => {
                      triggerCall(drawerLead.name, drawerLead.phone, drawerLead.process, drawerLead.id);
                      setDrawerLead(null);
                    }}
                    className="flex-1 py-1.5 bg-[#2874F0] hover:bg-primary-container text-white font-bold rounded-sm text-xs flex items-center justify-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-sm">phone</span>
                    <span>Start Active Call</span>
                  </button>
                  <button className="flex-1 py-1.5 border border-outline-variant hover:bg-surface-container text-on-surface font-bold rounded-sm text-xs flex items-center justify-center gap-xs bg-white">
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span>Send WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Call History Timeline */}
              <div className="space-y-sm">
                <h4 className="font-bold text-xs uppercase text-outline">Caller Audit History</h4>
                <div className="border-l-2 border-outline-variant ml-sm pl-md space-y-md text-xs">
                  <div className="relative">
                    <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"></span>
                    <p className="font-bold text-on-surface">Call Completed - Connected</p>
                    <p className="text-[10px] text-outline">Logged by {drawerLead.assignedCaller} | Talk duration: 04:12</p>
                    <p className="text-on-surface-variant mt-xs bg-surface-container-low p-sm border border-outline-variant rounded-sm">
                      "Driver wants to sign up next week. Requested callback."
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-outline border-2 border-white"></span>
                    <p className="font-bold text-on-surface">Lead Created</p>
                    <p className="text-[10px] text-outline">System import | Source: Marketing Campaign</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LeadManagementPage;
