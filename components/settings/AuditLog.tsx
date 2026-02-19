'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Edit2, Trash2, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './AuditLog.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type Action = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT' | 'LOCK' | 'APPROVE' | 'REJECT';
type Module = 'Master Data' | 'Leave' | 'Deductions' | 'Loans' | 'Payroll' | 'Reports' | 'Settings' | 'Auth';

interface AuditEntry {
    id: string;
    timestamp: string;
    user: string;
    role: string;
    action: Action;
    module: Module;
    record: string;
    detail: string;
    ipAddress: string;
    before?: Record<string, string>;
    after?: Record<string, string>;
}

/* ─── Mock Data ─────────────────────────────────────────── */
const AUDIT_DATA: AuditEntry[] = [
    { id: 'A001', timestamp: '2026-02-19 09:42:11', user: 'Nimali Jayawardene', role: 'Admin', action: 'UPDATE', module: 'Settings', record: 'Role Config', detail: 'Updated Accounts role — removed delete permission from Deductions module', ipAddress: '10.0.1.15', before: { delete: 'true' }, after: { delete: 'false' } },
    { id: 'A002', timestamp: '2026-02-19 09:15:03', user: 'Chamari Atapattu', role: 'HR', action: 'CREATE', module: 'Master Data', record: 'BT-017 Priya Kumari', detail: 'New employee record created — Production department, Machinist designation', ipAddress: '10.0.1.22', after: { name: 'Priya Kumari', dept: 'Production' } },
    { id: 'A003', timestamp: '2026-02-19 09:01:44', user: 'Chamari Atapattu', role: 'HR', action: 'APPROVE', module: 'Leave', record: 'LV-2026-055', detail: 'Approved annual leave for Ajith Bandara — 3 days (Feb 20–22)', ipAddress: '10.0.1.22' },
    { id: 'A004', timestamp: '2026-02-19 08:55:30', user: 'Kasun Perera', role: 'Accounts', action: 'LOCK', module: 'Payroll', record: '2026-01', detail: 'Payroll period 2026-01 attendance locked — 87 employees', ipAddress: '10.0.1.30' },
    { id: 'A005', timestamp: '2026-02-19 08:32:18', user: 'Nimali Jayawardene', role: 'Admin', action: 'LOGIN', module: 'Auth', record: 'Session', detail: 'Successful login from Colombo office network', ipAddress: '10.0.1.15' },
    { id: 'A006', timestamp: '2026-02-18 17:12:00', user: 'Gayani Alwis', role: 'HR', action: 'UPDATE', module: 'Master Data', record: 'BT-005 Ruwan Fernando', detail: 'Updated basic salary from LKR 36,000 to LKR 38,000 — increment approved', ipAddress: '10.0.1.41', before: { basic: '36000' }, after: { basic: '38000' } },
    { id: 'A007', timestamp: '2026-02-18 16:05:22', user: 'Kasun Perera', role: 'Accounts', action: 'EXPORT', module: 'Reports', record: 'Payroll Summary', detail: 'Exported payroll summary for 2026-01 as Excel — 87 employees', ipAddress: '10.0.1.30' },
    { id: 'A008', timestamp: '2026-02-18 14:30:09', user: 'Chamari Atapattu', role: 'HR', action: 'REJECT', module: 'Leave', record: 'LV-2026-054', detail: 'Rejected leave request for Sandya Kumari — reason: peak production period', ipAddress: '10.0.1.22' },
    { id: 'A009', timestamp: '2026-02-18 11:20:45', user: 'Gayani Alwis', role: 'HR', action: 'CREATE', module: 'Loans', record: 'L006', detail: 'New loan application submitted — BT-012 Saman Perera, LKR 40,000', ipAddress: '10.0.1.41', after: { amount: '40000', installments: '10' } },
    { id: 'A010', timestamp: '2026-02-18 10:05:33', user: 'Kasun Perera', role: 'Accounts', action: 'CREATE', module: 'Deductions', record: 'DED-2026-02-088', detail: 'Manual deduction added — BT-003 Ajith Bandara, No Pay LKR 2,800', ipAddress: '10.0.1.30', after: { type: 'No Pay', amount: '2800' } },
    { id: 'A011', timestamp: '2026-02-17 15:44:01', user: 'Nimali Jayawardene', role: 'Admin', action: 'DELETE', module: 'Master Data', record: 'BT-016', detail: 'Employee record deleted — Nuwan Rajapaksa (resigned)', ipAddress: '10.0.1.15', before: { name: 'Nuwan Rajapaksa', status: 'Resigned' } },
    { id: 'A012', timestamp: '2026-02-17 09:10:18', user: 'Thilak Dissanayake', role: 'Viewer', action: 'LOGIN', module: 'Auth', record: 'Session', detail: 'Login failed — incorrect password (3rd attempt)', ipAddress: '10.0.2.11' },
];

const ACTION_VARIANT: Record<Action, 'success' | 'info' | 'danger' | 'warning' | 'muted' | 'purple'> = {
    CREATE: 'success', UPDATE: 'info', DELETE: 'danger', LOGIN: 'muted', EXPORT: 'purple', LOCK: 'warning', APPROVE: 'success', REJECT: 'danger',
};

const ACTION_ICON: Record<Action, React.ReactNode> = {
    CREATE: <CheckCircle2 size={12} />,
    UPDATE: <Edit2 size={12} />,
    DELETE: <Trash2 size={12} />,
    LOGIN: <Info size={12} />,
    EXPORT: <Download size={12} />,
    LOCK: <AlertCircle size={12} />,
    APPROVE: <CheckCircle2 size={12} />,
    REJECT: <AlertCircle size={12} />,
};

const ALL_ACTIONS: Action[] = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'EXPORT', 'LOCK', 'APPROVE', 'REJECT'];
const ALL_MODULES: Module[] = ['Master Data', 'Leave', 'Deductions', 'Loans', 'Payroll', 'Reports', 'Settings', 'Auth'];

export default function AuditLog() {
    const [search, setSearch] = useState('');
    const [actionF, setActionF] = useState<Action | 'All'>('All');
    const [moduleF, setModuleF] = useState<Module | 'All'>('All');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return AUDIT_DATA.filter(e =>
            (actionF === 'All' || e.action === actionF) &&
            (moduleF === 'All' || e.module === moduleF) &&
            (!q || e.user.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q) || e.record.toLowerCase().includes(q))
        );
    }, [search, actionF, moduleF]);

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    return (
        <div className={styles.root}>
            {/* ── Filters ── */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                    <Search size={14} className={styles.searchIcon} />
                    <input id="audit-search" className={styles.searchInput} placeholder="Search user, record, detail…"
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <div className={styles.toolbarRight}>
                    <div className={styles.filterGroup}>
                        <Filter size={13} className={styles.filterIcon} />
                        <select id="audit-action-filter" className={styles.filterSel} value={actionF}
                            onChange={e => { setActionF(e.target.value as Action | 'All'); setPage(1); }}>
                            <option value="All">All Actions</option>
                            {ALL_ACTIONS.map(a => <option key={a}>{a}</option>)}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <select id="audit-module-filter" className={styles.filterSel} value={moduleF}
                            onChange={e => { setModuleF(e.target.value as Module | 'All'); setPage(1); }}>
                            <option value="All">All Modules</option>
                            {ALL_MODULES.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <Button variant="ghost" size="sm" icon={<Download size={14} />}>Export Log</Button>
                </div>
            </div>

            <div className={styles.countBar}>
                <span className={styles.count}>{filtered.length} events found</span>
                <Eye size={13} /> Audit trail is immutable and retained for 12 months.
            </div>

            {/* ── Table ── */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Timestamp</th>
                            <th className={styles.th}>User</th>
                            <th className={styles.th}>Action</th>
                            <th className={styles.th}>Module</th>
                            <th className={styles.th}>Record</th>
                            <th className={styles.th}>Detail</th>
                            <th className={styles.th}>IP</th>
                            <th className={styles.th} />
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(entry => {
                            const isExp = expanded === entry.id;
                            const hasDiff = !!(entry.before || entry.after);
                            return (
                                <React.Fragment key={entry.id}>
                                    <tr className={`${styles.row} ${entry.action === 'DELETE' ? styles.rowDelete : entry.action === 'LOGIN' && entry.detail.includes('failed') ? styles.rowWarn : ''}`}>
                                        <td className={`${styles.td} ${styles.mono}`}>{entry.timestamp}</td>
                                        <td className={styles.td}>
                                            <div className={styles.userCell}>
                                                <div className={styles.avatar}>{entry.user.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                                <div>
                                                    <span className={styles.userName}>{entry.user}</span>
                                                    <span className={styles.userRole}>{entry.role}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.td}><Badge variant={ACTION_VARIANT[entry.action]}>{ACTION_ICON[entry.action]} {entry.action}</Badge></td>
                                        <td className={styles.td}>{entry.module}</td>
                                        <td className={`${styles.td} ${styles.mono}`}>{entry.record}</td>
                                        <td className={styles.td}><span className={styles.detailText}>{entry.detail}</span></td>
                                        <td className={`${styles.td} ${styles.mono} ${styles.ipCell}`}>{entry.ipAddress}</td>
                                        <td className={styles.td}>
                                            {hasDiff && (
                                                <button id={`audit-expand-${entry.id}`} className={styles.expandBtn}
                                                    onClick={() => setExpanded(isExp ? null : entry.id)}>
                                                    {isExp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    {isExp && hasDiff && (
                                        <tr className={styles.diffRow}>
                                            <td colSpan={8} className={styles.diffCell}>
                                                <div className={styles.diffGrid}>
                                                    {entry.before && (
                                                        <div className={styles.diffSection}>
                                                            <span className={styles.diffLabel}>Before</span>
                                                            {Object.entries(entry.before).map(([k, v]) => (
                                                                <div key={k} className={styles.diffItem}>
                                                                    <span className={styles.diffKey}>{k}</span>
                                                                    <span className={styles.diffValOld}>{v}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {entry.after && (
                                                        <div className={styles.diffSection}>
                                                            <span className={styles.diffLabel}>After</span>
                                                            {Object.entries(entry.after).map(([k, v]) => (
                                                                <div key={k} className={styles.diffItem}>
                                                                    <span className={styles.diffKey}>{k}</span>
                                                                    <span className={styles.diffValNew}>{v}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                    <div className={styles.pageButtons}>
                        <button id="audit-prev" className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} id={`audit-page-${p}`}
                                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                                onClick={() => setPage(p)}>{p}</button>
                        ))}
                        <button id="audit-next" className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                </div>
            )}
        </div>
    );
}
