import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  BarChart3,
  Calendar,
  CarFront,
  Crown,
  Download,
  Edit3,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAurex } from '../context/AurexContext';
import { AUREX_ASSETS } from '../data/seedData';
import type { AdminSubTab, InquiryStatus, TestDriveStatus } from '../types/aurex';
import { formatCurrency } from '../utils/finance';
import { AdminVehicleStudio } from '../components/AdminVehicleStudio';
import { AurexImage } from '../components/AurexImage';

const ADMIN_TABS: { id: AdminSubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: CarFront },
  { id: 'add-vehicle', label: 'Vehicle Studio', icon: Plus },
  { id: 'leads', label: 'Lead Desk', icon: FileText },
  { id: 'appointments', label: 'Salon Schedule', icon: Calendar },
  { id: 'brands', label: 'Marque Stock', icon: Crown },
  { id: 'analytics', label: 'Telemetry', icon: BarChart3 },
];

const MARQUE_VALUATION_DATA = [
  { name: 'Porsche', pct: 34, amount: '$23.2M', color: '#f2ca7d', dash: '85 166' },
  { name: 'Ferrari', pct: 26, amount: '$17.8M', color: '#bfcfff', dash: '65 186' },
  { name: 'Aston Martin', pct: 18, amount: '$12.3M', color: '#d4af65', dash: '45 206' },
  { name: 'McLaren & AMG', pct: 22, amount: '$15.1M', color: '#9a8f80', dash: '56 195' },
];

const VELOCITY_SERIES: Record<
  '6M' | 'YTD' | '12M',
  { label: string; inquiries: number; placements: number }[]
> = {
  '6M': [
    { label: 'May', inquiries: 42, placements: 18 },
    { label: 'Jun', inquiries: 54, placements: 22 },
    { label: 'Jul', inquiries: 49, placements: 24 },
    { label: 'Aug', inquiries: 63, placements: 29 },
    { label: 'Sep', inquiries: 58, placements: 26 },
    { label: 'Oct', inquiries: 74, placements: 34 },
  ],
  YTD: [
    { label: 'Q1', inquiries: 118, placements: 48 },
    { label: 'Q2', inquiries: 145, placements: 61 },
    { label: 'Q3', inquiries: 170, placements: 79 },
    { label: 'Q4*', inquiries: 74, placements: 34 },
  ],
  '12M': [
    { label: 'Nov', inquiries: 38, placements: 16 },
    { label: 'Jan', inquiries: 44, placements: 19 },
    { label: 'Mar', inquiries: 51, placements: 23 },
    { label: 'May', inquiries: 42, placements: 18 },
    { label: 'Jul', inquiries: 49, placements: 24 },
    { label: 'Oct', inquiries: 74, placements: 34 },
  ],
};

export const AdminConsolePage: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    navigate,
    vehicles,
    marques,
    inquiries,
    updateInquiryStatus,
    testDriveBookings,
    updateTestDriveStatus,
    setEditingVehicleId,
    archiveVehicle,
    pushToast,
    signOut,
  } = useAurex();

  const [velocityRange, setVelocityRange] = useState<'6M' | 'YTD' | '12M'>('6M');
  const [invSearch, setInvSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'All' | InquiryStatus>('All');

  const totalInventoryValue = useMemo(
    () => vehicles.reduce((acc, v) => acc + v.price, 0),
    [vehicles]
  );

  const liveCount = useMemo(
    () => vehicles.filter((v) => v.syndicatePublic).length,
    [vehicles]
  );

  const filteredInventory = useMemo(() => {
    const q = invSearch.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      `${v.title} ${v.stockCode} ${v.make} ${v.vin}`.toLowerCase().includes(q)
    );
  }, [vehicles, invSearch]);

  const filteredLeads = useMemo(() => {
    if (leadStatusFilter === 'All') return inquiries;
    return inquiries.filter((i) => i.status === leadStatusFilter);
  }, [inquiries, leadStatusFilter]);

  const handleExportCsv = () => {
    const header = 'StockCode,Year,Make,Model,Condition,Price,Mileage,Status\n';
    const rows = vehicles
      .map(
        (v) =>
          `${v.stockCode},${v.year},"${v.make}","${v.model}",${v.condition},${v.price},${v.mileage},"${v.allocationStatus}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aurex-motors-inventory.csv';
    link.click();
    URL.revokeObjectURL(url);
    pushToast('Inventory Ledger Exported', `${vehicles.length} chassis exported to CSV.`, 'success');
  };

  const velocityBars = VELOCITY_SERIES[velocityRange];
  const maxBarVal = Math.max(...velocityBars.map((b) => b.inquiries), 1);

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Desktop Dark Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col justify-between bg-surface-container-lowest border-r border-outline-variant/40 p-5 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/40">
            <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/50 flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif text-base font-semibold text-on-surface">
                EXECUTIVE CONSOLE
              </div>
              <div className="text-[10px] font-mono text-primary">MARCUS STERLING • GM</div>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Executive Admin Navigation">
            {ADMIN_TABS.map((item) => {
              const Icon = item.icon;
              const active = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'add-vehicle') {
                      setEditingVehicleId(null);
                    }
                    setAdminTab(item.id);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'leads' && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                        active ? 'bg-on-primary text-primary' : 'bg-surface-container-high text-primary'
                      }`}
                    >
                      {inquiries.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-outline-variant/40">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container border border-outline-variant/50 text-xs text-on-surface hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Showroom</span>
          </button>
          <button
            type="button"
            onClick={signOut}
            className="w-full px-3.5 py-2 rounded-lg text-xs text-outline hover:text-error flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Admin Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pb-24 lg:pb-12">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-30 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/40 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="lg:hidden p-2 rounded-lg bg-surface-container border border-outline-variant/50 text-primary"
              aria-label="Back to Public Showroom"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-outline">
                Aurex Motors • Beverly Hills Operations
              </div>
              <div className="font-serif text-base font-semibold text-on-surface">
                {ADMIN_TABS.find((t) => t.id === adminTab)?.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/60 text-xs text-on-surface hover:border-primary hover:text-primary"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingVehicleId(null);
                setAdminTab('add-vehicle');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Chassis</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
          {adminTab === 'dashboard' && (
            <>
              {/* Priority Protocol Alert Banner */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs">
                  <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-on-surface">
                    <strong>Priority Protocol:</strong> {inquiries.filter((i) => i.status === 'In-Review').length}{' '}
                    high-net-worth acquisition dossiers awaiting concierge assignment in Beverly Hills Salon.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminTab('leads')}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Open Lead Desk →
                </button>
              </div>

              {/* 8 Executive KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Active Vault Valuation', val: formatCurrency(totalInventoryValue), sub: 'Live Registry Sum' },
                  { label: 'Total Fleet Units', val: `${vehicles.length} Chassis`, sub: `${liveCount} Publicly Syndicated` },
                  { label: 'Open Inquiries', val: `${inquiries.length} Dossiers`, sub: `${inquiries.filter((i) => i.status === 'In-Review').length} In-Review` },
                  { label: 'Salon & Track Drives', val: `${testDriveBookings.length} Booked`, sub: 'Beverly Hills & Thermal' },
                  { label: 'Registered Clients', val: '1,420', sub: 'Private Vault Tier' },
                  { label: 'Live Syndicated', val: `${liveCount} Live`, sub: 'Showroom Visible' },
                  { label: 'In-Process Deals', val: '36 Active', sub: 'Escrow & Wire Desk' },
                  { label: 'Avg Turn Velocity', val: '16.4 Days', sub: '-2.1d vs Q3 Target' },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="p-4 rounded-xl bg-surface-container border border-outline-variant/40"
                  >
                    <div className="text-[10px] uppercase tracking-[0.14em] text-outline">{kpi.label}</div>
                    <div className="font-serif text-xl sm:text-2xl font-semibold text-primary mt-1 tabular-nums">
                      {kpi.val}
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row: SVG Donut + Grouped Velocity Bar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Valuation by Marque SVG Donut */}
                <div className="lg:col-span-5 p-6 rounded-xl bg-surface-container border border-outline-variant/40 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-semibold text-on-surface">
                      Valuation by Marque
                    </h2>
                    <span className="text-[11px] font-mono text-primary">$68.4M Annualized</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <svg viewBox="0 0 100 100" className="w-36 h-36 shrink-0" aria-label="Valuation by Marque Donut Chart">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#2a2a2c" strokeWidth="12" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#f2ca7d"
                        strokeWidth="12"
                        strokeDasharray="85 251"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#bfcfff"
                        strokeWidth="12"
                        strokeDasharray="65 251"
                        strokeDashoffset="-85"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#d4af65"
                        strokeWidth="12"
                        strokeDasharray="45 251"
                        strokeDashoffset="-150"
                        transform="rotate(-90 50 50)"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#9a8f80"
                        strokeWidth="12"
                        strokeDasharray="56 251"
                        strokeDashoffset="-195"
                        transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="48" textAnchor="middle" fill="#e5e1e4" fontSize="11" fontWeight="600">
                        {vehicles.length}
                      </text>
                      <text x="50" y="60" textAnchor="middle" fill="#9a8f80" fontSize="6">
                        CHASSIS
                      </text>
                    </svg>

                    <div className="flex-1 w-full space-y-2.5 text-xs">
                      {MARQUE_VALUATION_DATA.map((item) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-2 text-on-surface">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              {item.name}
                            </span>
                            <span className="font-mono text-on-surface-variant">
                              {item.amount} ({item.pct}%)
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Monthly Inquiries & Turn Velocity Grouped Bar Chart */}
                <div className="lg:col-span-7 p-6 rounded-xl bg-surface-container border border-outline-variant/40 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-lg font-semibold text-on-surface">
                        Monthly Inquiries &amp; Turn Velocity
                      </h2>
                      <p className="text-[11px] text-outline">
                        Gold: Qualified Inquiries • Slate Blue: Completed Placements
                      </p>
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-container-lowest border border-outline-variant/50">
                      {(['6M', 'YTD', '12M'] as const).map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => setVelocityRange(range)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                            velocityRange === range
                              ? 'bg-primary text-on-primary font-semibold'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <svg
                    viewBox="0 0 420 155"
                    className="w-full h-44"
                    aria-label="Monthly Inquiries and Turn Velocity Grouped Bar Chart"
                  >
                    {[30, 62, 93].map((yPos) => (
                      <line
                        key={yPos}
                        x1="20"
                        y1={yPos}
                        x2="405"
                        y2={yPos}
                        stroke="#2a2a2c"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                    ))}
                    <line x1="20" y1="125" x2="405" y2="125" stroke="#4d4639" strokeWidth="1" />
                    {velocityBars.map((bar, idx) => {
                      const groupW = 365 / velocityBars.length;
                      const xCenter = 28 + (idx + 0.5) * groupW;
                      const xBase = xCenter - 18;
                      const inqH = (bar.inquiries / maxBarVal) * 90;
                      const plcH = (bar.placements / maxBarVal) * 90;
                      return (
                        <g key={bar.label}>
                          <text
                            x={xBase + 8}
                            y={121 - inqH}
                            textAnchor="middle"
                            fill="#f2ca7d"
                            fontSize="8"
                            fontFamily="monospace"
                          >
                            {bar.inquiries}
                          </text>
                          <rect
                            x={xBase}
                            y={125 - inqH}
                            width="16"
                            height={inqH}
                            rx="2"
                            fill="#f2ca7d"
                          />
                          <text
                            x={xBase + 28}
                            y={121 - plcH}
                            textAnchor="middle"
                            fill="#bfcfff"
                            fontSize="8"
                            fontFamily="monospace"
                          >
                            {bar.placements}
                          </text>
                          <rect
                            x={xBase + 20}
                            y={125 - plcH}
                            width="16"
                            height={plcH}
                            rx="2"
                            fill="#bfcfff"
                          />
                          <text
                            x={xCenter}
                            y="142"
                            textAnchor="middle"
                            fill="#9a8f80"
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            {bar.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Client Inquiries & Lead Desk Table */}
              <section className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-serif text-lg font-semibold text-on-surface">
                    Client Inquiries &amp; Lead Desk
                  </h2>
                  <select
                    aria-label="Filter leads by status"
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value as 'All' | InquiryStatus)}
                    className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg px-3 py-1.5 text-xs text-on-surface"
                  >
                    <option value="All">All Statuses</option>
                    <option value="In-Review">In-Review</option>
                    <option value="Concierge Assigned">Concierge Assigned</option>
                    <option value="Allocation Confirmed">Allocation Confirmed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low text-outline uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Vehicle</th>
                        <th className="py-3 px-4">Specialist</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {filteredLeads.map((inq) => (
                        <tr key={inq.id} className="hover:bg-surface-container-high/40">
                          <td className="py-3 px-4 font-mono text-primary">{inq.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-on-surface">{inq.clientName}</div>
                            <div className="text-[11px] text-outline">{inq.clientEmail}</div>
                          </td>
                          <td className="py-3 px-4 text-on-surface">{inq.vehicleTitle}</td>
                          <td className="py-3 px-4">
                            <select
                              aria-label={`Assign specialist for ${inq.id}`}
                              value={inq.assignedSpecialist}
                              onChange={(e) =>
                                updateInquiryStatus(inq.id, inq.status, e.target.value)
                              }
                              className="bg-surface-container-lowest border border-outline-variant/50 rounded px-2 py-1 text-xs text-on-surface"
                            >
                              <option>Marcus Sterling</option>
                              <option>Elena Rostova</option>
                              <option>Julian Thorne</option>
                              <option>Alexander Vance</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              aria-label={`Update status for ${inq.id}`}
                              value={inq.status}
                              onChange={(e) =>
                                updateInquiryStatus(inq.id, e.target.value as InquiryStatus)
                              }
                              className="bg-surface-container-lowest border border-primary/40 rounded px-2 py-1 text-xs text-primary font-medium"
                            >
                              <option value="In-Review">In-Review</option>
                              <option value="Concierge Assigned">Concierge Assigned</option>
                              <option value="Allocation Confirmed">Allocation Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Active Marque Inventory Table */}
              <section className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-serif text-lg font-semibold text-on-surface">
                    Active Marque Inventory ({filteredInventory.length})
                  </h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={invSearch}
                      onChange={(e) => setInvSearch(e.target.value)}
                      placeholder="Search stock, VIN, model..."
                      aria-label="Search admin inventory"
                      className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low text-outline uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Vehicle</th>
                        <th className="py-3 px-4">Condition</th>
                        <th className="py-3 px-4 text-right">Asking</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {filteredInventory.slice(0, 8).map((v) => (
                        <tr key={v.id} className="hover:bg-surface-container-high/40">
                          <td className="py-3 px-4 font-mono text-primary">{v.stockCode}</td>
                          <td className="py-3 px-4 font-medium text-on-surface">{v.title}</td>
                          <td className="py-3 px-4 text-on-surface-variant">{v.condition}</td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-on-surface">
                            {formatCurrency(v.price)}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingVehicleId(v.id);
                                setAdminTab('add-vehicle');
                              }}
                              className="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant/50 text-on-surface hover:text-primary inline-flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => archiveVehicle(v.id)}
                              className="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant/50 text-outline hover:text-primary inline-flex items-center gap-1"
                            >
                              <Archive className="w-3 h-3" />
                              <span>{v.syndicatePublic ? 'Hide' : 'Show'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {adminTab === 'inventory' && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-serif text-3xl font-semibold text-on-surface">
                  Master Fleet Ledger ({filteredInventory.length})
                </h1>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    placeholder="Filter fleet..."
                    className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVehicleId(null);
                      setAdminTab('add-vehicle');
                    }}
                    className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider"
                  >
                    + Add Chassis
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-surface-container border border-outline-variant/40 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-outline uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Chassis</th>
                      <th className="py-3 px-4">Mileage</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4">Public</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {filteredInventory.map((v) => (
                      <tr key={v.id}>
                        <td className="py-3 px-4 font-mono text-primary">{v.stockCode}</td>
                        <td className="py-3 px-4 font-medium text-on-surface">{v.title}</td>
                        <td className="py-3 px-4 font-mono">{v.mileage.toLocaleString()} mi</td>
                        <td className="py-3 px-4 text-right font-mono text-primary">
                          {formatCurrency(v.price)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] font-mono">
                            {v.syndicatePublic ? 'Live' : 'Vault Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVehicleId(v.id);
                              setAdminTab('add-vehicle');
                            }}
                            className="text-primary hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => archiveVehicle(v.id)}
                            className="text-outline hover:text-on-surface"
                          >
                            {v.syndicatePublic ? 'Unpublish' : 'Publish'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {adminTab === 'add-vehicle' && (
            <AdminVehicleStudio onComplete={() => setAdminTab('inventory')} />
          )}

          {adminTab === 'leads' && (
            <section className="space-y-5">
              <h1 className="font-serif text-3xl font-semibold text-on-surface">
                Client Inquiries &amp; Lead Desk
              </h1>
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 rounded-xl bg-surface-container border border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-mono text-primary">{inq.id} • {inq.createdAt}</div>
                      <div className="font-serif text-lg font-semibold text-on-surface">
                        {inq.clientName} — {inq.vehicleTitle}
                      </div>
                      <p className="text-xs text-on-surface-variant">{inq.notes}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <select
                        aria-label={`Status for ${inq.id}`}
                        value={inq.status}
                        onChange={(e) =>
                          updateInquiryStatus(inq.id, e.target.value as InquiryStatus)
                        }
                        className="bg-surface-container-lowest border border-primary/40 rounded-lg px-3 py-2 text-xs text-primary"
                      >
                        <option value="In-Review">In-Review</option>
                        <option value="Concierge Assigned">Concierge Assigned</option>
                        <option value="Allocation Confirmed">Allocation Confirmed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {adminTab === 'appointments' && (
            <section className="space-y-5">
              <h1 className="font-serif text-3xl font-semibold text-on-surface">
                Beverly Hills Salon &amp; Track Schedule
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testDriveBookings.map((td) => (
                  <div
                    key={td.id}
                    className="p-5 rounded-xl bg-surface-container border border-outline-variant/40 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-primary">{td.id}</span>
                      <select
                        aria-label={`Booking status for ${td.id}`}
                        value={td.status}
                        onChange={(e) =>
                          updateTestDriveStatus(td.id, e.target.value as TestDriveStatus)
                        }
                        className="bg-surface-container-lowest border border-primary/40 rounded px-2 py-1 text-xs text-primary"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                      </select>
                    </div>
                    <div className="font-serif text-xl font-semibold text-on-surface">
                      {td.vehicleTitle}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      Client: {td.clientName} • {td.date} ({td.timeWindow})
                    </div>
                    <div className="text-xs text-outline">{td.location}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {adminTab === 'brands' && (
            <section className="space-y-5">
              <h1 className="font-serif text-3xl font-semibold text-on-surface">
                Partner Marque Allocation Ledger
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {marques.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 flex items-center gap-4"
                  >
                    <AurexImage
                      src={m.heroImage}
                      alt={m.name}
                      className="w-16 h-12 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-base font-semibold text-on-surface">{m.name}</div>
                      <div className="text-[11px] text-outline truncate">{m.category}</div>
                    </div>
                    <span className="font-mono text-xs text-primary shrink-0">
                      {m.availableCount} Units
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {adminTab === 'analytics' && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Showroom Performance Telemetry</span>
              </div>
              <h1 className="font-serif text-3xl font-semibold text-on-surface">
                Portfolio Valuation &amp; Turn Velocity
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MARQUE_VALUATION_DATA.map((item) => (
                  <div key={item.name} className="p-5 rounded-xl bg-surface-container border border-outline-variant/40 space-y-2">
                    <div className="text-xs text-outline uppercase tracking-wider">{item.name}</div>
                    <div className="font-serif text-2xl font-semibold text-primary">{item.amount}</div>
                    <div className="text-xs text-on-surface-variant">{item.pct}% of Active Vault</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Mobile Admin Console Tabs"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/40 flex items-center justify-around px-1 py-2"
      >
        {ADMIN_TABS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = adminTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setAdminTab(item.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] ${
                active ? 'text-primary font-semibold' : 'text-outline'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[60px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
