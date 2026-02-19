'use client';

import React, { useState, useMemo } from 'react';
import { Download, Filter, Eye, FileText, Calendar, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './ReportViewer.module.css';

/* ─── Report Definitions ─────────────────────────────────── */
type ReportMode = 'mandatory' | 'statutory';

interface ReportDef {
    id: string;
    title: string;
    description: string;
    category: string;
    badge: 'info' | 'success' | 'warning' | 'purple';
}

const MANDATORY_REPORTS: ReportDef[] = [
    { id: 'master', title: 'Master Data Sheet', description: 'Complete employee register with all personal and employment details.', category: 'HR', badge: 'info' },
    { id: 'payroll', title: 'Payroll Summary', description: 'Monthly payroll totals — gross, deductions, net pay per department.', category: 'Finance', badge: 'success' },
    { id: 'paydetail', title: 'Pay Details', description: 'Itemised earnings and deductions per employee for the selected period.', category: 'Finance', badge: 'success' },
    { id: 'absent', title: 'Absenteeism Report', description: 'No-pay, late arrivals, and absence patterns per employee.', category: 'HR', badge: 'warning' },
    { id: 'ot', title: 'OT Summary', description: 'Overtime hours and amounts per employee — normal, rest day, holiday.', category: 'Finance', badge: 'purple' },
    { id: 'timecard', title: 'Time Card Report', description: 'Daily in/out times, total hours, and attendance status per employee.', category: 'HR', badge: 'info' },
    { id: 'leavebal', title: 'Leave Balance Report', description: 'Remaining annual, sick, and casual leave balances per employee.', category: 'HR', badge: 'warning' },
];

const STATUTORY_REPORTS: ReportDef[] = [
    { id: 'epf-c', title: 'EPF Form C', description: 'Monthly EPF contribution summary (employer + employee) for submission.', category: 'EPF', badge: 'info' },
    { id: 'epf-detail', title: 'EPF Contribution Detail', description: 'Per-employee EPF breakdown including member numbers and amounts.', category: 'EPF', badge: 'info' },
    { id: 'etf', title: 'ETF Monthly Return', description: 'ETF employer contribution report for the Labour Department.', category: 'ETF', badge: 'success' },
    { id: 'salary-tax', title: 'APIT / Salary Tax', description: 'PAYE tax deductions and APIT amounts per employee for IRD.', category: 'Tax', badge: 'warning' },
    { id: 'epf-annual', title: 'EPF Annual Statement', description: 'Annual EPF member statement per employee.', category: 'EPF', badge: 'purple' },
];

/* ─── Fake Preview Data ──────────────────────────────────── */
const PREVIEW_ROWS = [
    { empNo: 'BT-001', name: 'Kasun Perera', dept: 'IT', basic: 85000, gross: 102083, deductions: 11800, net: 90283, epf: 6800, etf: 2550 },
    { empNo: 'BT-002', name: 'Chamari Atapattu', dept: 'Finance', basic: 120000, gross: 158000, deductions: 9600, net: 148400, epf: 9600, etf: 3600 },
    { empNo: 'BT-003', name: 'Ajith Bandara', dept: 'Production', basic: 42000, gross: 52625, deductions: 6160, net: 46465, epf: 3360, etf: 1260 },
    { empNo: 'BT-004', name: 'Nimali Jayawardene', dept: 'HR', basic: 65000, gross: 72000, deductions: 5200, net: 66800, epf: 5200, etf: 1950 },
    { empNo: 'BT-005', name: 'Ruwan Fernando', dept: 'Production', basic: 38000, gross: 43875, deductions: 4940, net: 38935, epf: 3040, etf: 1140 },
    { empNo: 'BT-006', name: 'Sandya Kumari', dept: 'Admin', basic: 45000, gross: 50500, deductions: 5600, net: 44900, epf: 3600, etf: 1350 },
    { empNo: 'BT-008', name: 'Gayani Alwis', dept: 'HR', basic: 72000, gross: 79500, deductions: 5760, net: 73740, epf: 5760, etf: 2160 },
    { empNo: 'BT-009', name: 'Thilak Dissanayake', dept: 'Logistics', basic: 58000, gross: 65000, deductions: 4640, net: 60360, epf: 4640, etf: 1740 },
];

const MONTHS = ['2026-02', '2026-01', '2025-12', '2025-11'];
const DEPTS = ['All', 'IT', 'Finance', 'Production', 'HR', 'Admin', 'Logistics'];
const fmt = (n: number) => n.toLocaleString('en-LK');

interface ReportViewerProps { mode: ReportMode; }

export default function ReportViewer({ mode }: ReportViewerProps) {
    const reports = mode === 'mandatory' ? MANDATORY_REPORTS : STATUTORY_REPORTS;
    const [selected, setSelected] = useState<ReportDef>(reports[0]);
    const [month, setMonth] = useState('2026-02');
    const [dept, setDept] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const previewRows = useMemo(() => {
        const q = search.toLowerCase();
        return PREVIEW_ROWS.filter(r =>
            (dept === 'All' || r.dept === dept) &&
            (!q || r.name.toLowerCase().includes(q) || r.empNo.toLowerCase().includes(q))
        );
    }, [dept, search]);

    const handleGenerate = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
    };

    const totals = {
        gross: previewRows.reduce((s, r) => s + r.gross, 0),
        ded: previewRows.reduce((s, r) => s + r.deductions, 0),
        net: previewRows.reduce((s, r) => s + r.net, 0),
        epf: previewRows.reduce((s, r) => s + r.epf, 0),
        etf: previewRows.reduce((s, r) => s + r.etf, 0),
    };

    return (
        <div className={styles.root}>
            <div className={styles.layout}>

                {/* ── Report List Sidebar ── */}
                <div className={styles.sidebar}>
                    <p className={styles.sidebarLabel}>{mode === 'mandatory' ? 'Mandatory Reports' : 'Statutory Reports'}</p>
                    {reports.map(r => (
                        <div
                            key={r.id}
                            id={`report-${r.id}`}
                            className={`${styles.reportItem} ${selected.id === r.id ? styles.reportItemActive : ''}`}
                            onClick={() => setSelected(r)}
                        >
                            <div className={styles.reportItemTop}>
                                <span className={styles.reportItemTitle}>{r.title}</span>
                                <Badge variant={r.badge}>{r.category}</Badge>
                            </div>
                            <p className={styles.reportItemDesc}>{r.description}</p>
                        </div>
                    ))}
                </div>

                {/* ── Report Viewer Panel ── */}
                <div className={styles.panel}>
                    {/* Panel Header */}
                    <div className={styles.panelHeader}>
                        <div>
                            <h3 className={styles.panelTitle}>{selected.title}</h3>
                            <p className={styles.panelDesc}>{selected.description}</p>
                        </div>
                        <div className={styles.panelActions}>
                            <Button variant="ghost" size="sm" icon={<Eye size={14} />} loading={loading} onClick={handleGenerate}>Preview</Button>
                            <Button variant="primary" size="sm" icon={<Download size={14} />}>Export Excel</Button>
                            <Button variant="ghost" size="sm" icon={<FileText size={14} />}>Export PDF</Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <Calendar size={14} className={styles.filterIcon} />
                            <select id="report-month" className={styles.filterSel} value={month} onChange={e => setMonth(e.target.value)}>
                                {MONTHS.map(m => <option key={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className={styles.filterGroup}>
                            <Filter size={14} className={styles.filterIcon} />
                            <select id="report-dept" className={styles.filterSel} value={dept} onChange={e => setDept(e.target.value)}>
                                {DEPTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className={styles.filterSearch}>
                            <Search size={14} className={styles.filterIcon} />
                            <input id="report-search" className={styles.filterInput} type="text" placeholder="Search employee…"
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <span className={styles.rowCount}>{previewRows.length} employees</span>
                    </div>

                    {/* Table Preview */}
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Emp No</th>
                                    <th className={styles.th}>Name</th>
                                    <th className={styles.th}>Department</th>
                                    <th className={styles.th}>Basic</th>
                                    <th className={styles.th}>Gross</th>
                                    <th className={styles.th}>Deductions</th>
                                    <th className={styles.th}>Net Pay</th>
                                    <th className={styles.th}>EPF (Emp)</th>
                                    <th className={styles.th}>ETF (Er)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewRows.map(r => (
                                    <tr key={r.empNo} className={styles.row}>
                                        <td className={`${styles.td} ${styles.mono}`}>{r.empNo}</td>
                                        <td className={styles.td}><span className={styles.empName}>{r.name}</span></td>
                                        <td className={styles.td}>{r.dept}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{fmt(r.basic)}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{fmt(r.gross)}</td>
                                        <td className={`${styles.td} ${styles.negative}`}>{fmt(r.deductions)}</td>
                                        <td className={`${styles.td} ${styles.netPay}`}>{fmt(r.net)}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{fmt(r.epf)}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{fmt(r.etf)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className={styles.footerRow}>
                                    <td colSpan={3} className={`${styles.td} ${styles.footerLabel}`}>TOTALS ({previewRows.length})</td>
                                    <td className={styles.td} />
                                    <td className={`${styles.td} ${styles.footerVal}`}>LKR {fmt(totals.gross)}</td>
                                    <td className={`${styles.td} ${styles.footerNeg}`}>LKR {fmt(totals.ded)}</td>
                                    <td className={`${styles.td} ${styles.footerNet}`}>LKR {fmt(totals.net)}</td>
                                    <td className={`${styles.td} ${styles.footerEpf}`}>LKR {fmt(totals.epf)}</td>
                                    <td className={`${styles.td} ${styles.footerEpf}`}>LKR {fmt(totals.etf)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
