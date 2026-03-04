'use client';

import React, { useState } from 'react';
import {
    Clock, AlertTriangle, TrendingDown, Users, ChevronRight,
    Shield, CheckCircle, XCircle, Info, Gauge, Timer, CalendarClock,
    Edit2, X, Save
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmployeeForm from '@/components/master-data/EmployeeForm';
import type { Employee } from '@/components/master-data/EmployeeTable';
import styles from './page.module.css';

/* ─── Static Alert Data ──────────────────────────────────── */
const PROBATION_ALERTS = [
    { empNo: 'BT-004', name: 'Nimali Jayawardene', dept: 'HR', joinDate: '2024-01-15', probationEnd: '2024-07-14', daysLeft: 12 },
    { empNo: 'BT-008', name: 'Gayani Alwis', dept: 'HR', joinDate: '2023-08-15', probationEnd: '2024-02-14', daysLeft: 5 },
    { empNo: 'BT-012', name: 'Madhavi Wickrama', dept: 'Finance', joinDate: '2024-06-01', probationEnd: '2024-11-30', daysLeft: 30 },
];

const RETIREMENT_ALERTS = [
    { empNo: 'BT-003', name: 'Ajith Bandara', dept: 'Production', dob: '1966-03-10', age: 59, retireIn: '1 year' },
    { empNo: 'BT-015', name: 'Sumith Karunathilaka', dept: 'Production', dob: '1965-07-22', age: 60, retireIn: 'Overdue' },
];

const MINWAGE_ALERTS = [
    { empNo: 'BT-005', name: 'Ruwan Fernando', dept: 'Production', category: 'Shop & Office', basic: 38000, minWage: 42500, gap: 4500 },
    { empNo: 'BT-010', name: 'Dilani Rajapaksa', dept: 'Production', category: 'Shop & Office', basic: 36000, minWage: 42500, gap: 6500 },
    { empNo: 'BT-016', name: 'Saman Priyantha', dept: 'Production', category: 'Shop & Office', basic: 39000, minWage: 42500, gap: 3500 },
];

const CONTRACT_ALERTS = [
    { empNo: 'BT-017', name: 'Priya Maheshwary', dept: 'Admin', contractEnd: '2026-03-01', daysLeft: 10 },
    { empNo: 'BT-018', name: 'Ruwanthi Senanayake', dept: 'Finance', contractEnd: '2026-04-15', daysLeft: 55 },
];

const MAX_HOURS_ALERTS = [
    { empNo: 'BT-005', name: 'Ruwan Fernando', dept: 'Production', weeklyHours: 58, legalMax: 45, excess: 13 },
    { empNo: 'BT-009', name: 'Thilak Dissanayake', dept: 'Logistics', weeklyHours: 52, legalMax: 45, excess: 7 },
    { empNo: 'BT-003', name: 'Ajith Bandara', dept: 'Production', weeklyHours: 49, legalMax: 45, excess: 4 },
];

const OT_LIMIT_ALERTS = [
    { empNo: 'BT-005', name: 'Ruwan Fernando', dept: 'Production', weeklyOT: 18, otLimit: 12, excess: 6 },
    { empNo: 'BT-003', name: 'Ajith Bandara', dept: 'Production', weeklyOT: 15, otLimit: 12, excess: 3 },
];

/* ─── Leave Rule Type ────────────────────────────────────── */
type LeaveRule = {
    type: string;
    entitlement: number;
    maxCarry: number;
    expiry: string;
    carries: boolean;
};

const INITIAL_LEAVE_RULES: LeaveRule[] = [
    { type: 'Annual Leave', entitlement: 14, maxCarry: 14, expiry: '31 Mar', carries: true },
    { type: 'Casual Leave', entitlement: 7, maxCarry: 0, expiry: 'Year End', carries: false },
    { type: 'Medical Leave', entitlement: 14, maxCarry: 0, expiry: 'Year End', carries: false },
    { type: 'Maternity Leave', entitlement: 84, maxCarry: 0, expiry: 'N/A', carries: false },
    { type: 'No Pay Leave', entitlement: 0, maxCarry: 0, expiry: 'N/A', carries: false },
];

/* Auto-generates the enforced rule sentence from the actual config values */
const computeRule = (r: LeaveRule): string => {
    if (!r.carries) {
        if (r.expiry === 'N/A') return `No carry forward applicable — leave is deducted or statutory.`;
        return `Balance lapses at ${r.expiry} each year. No carry forward permitted.`;
    }
    if (r.maxCarry === 0) return `Carry forward enabled but no days cap set. Entire unused balance rolls over.`;
    return `Up to ${r.maxCarry} unused day${r.maxCarry > 1 ? 's' : ''} carry forward. Unused excess lapses on ${r.expiry}.`;
};

/* ─── Helpers ────────────────────────────────────────────── */
const URGENCY = (days: number): 'danger' | 'warning' | 'info' => {
    if (days <= 7) return 'danger';
    if (days <= 30) return 'warning';
    return 'info';
};
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');
const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

const MOCK_EMP: Employee = { id: '4', empNo: 'BT-004', fullName: 'Nimali Jayawardene', nic: '940123456V', dept: 'HR', section: 'Recruitment', designation: 'Accounts Officer', category: 'Management', joinDate: '2024-01-15', status: 'Probation', basic: 65000, alerts: ['probation'] };

/* ─── Page ─────────────────────────────────────────────────*/
export default function CompliancePage() {
    const [showForm, setShowForm] = useState(false);
    const [leaveRules, setLeaveRules] = useState<LeaveRule[]>(INITIAL_LEAVE_RULES);
    const [editIdx, setEditIdx] = useState<number>(-1);
    const [draft, setDraft] = useState<LeaveRule | null>(null);

    const openEdit = (idx: number) => { setEditIdx(idx); setDraft({ ...leaveRules[idx] }); };
    const closeEdit = () => { setEditIdx(-1); setDraft(null); };
    const saveRule = () => {
        if (!draft || editIdx === -1) return;
        setLeaveRules(prev => prev.map((r, i) => i === editIdx ? draft : r));
        closeEdit();
    };

    const totalAlerts = PROBATION_ALERTS.length + RETIREMENT_ALERTS.length + MINWAGE_ALERTS.length +
        CONTRACT_ALERTS.length + MAX_HOURS_ALERTS.length + OT_LIMIT_ALERTS.length;
    const critical = PROBATION_ALERTS.filter(a => a.daysLeft <= 7).length +
        RETIREMENT_ALERTS.filter(a => a.retireIn === 'Overdue').length +
        CONTRACT_ALERTS.filter(a => a.daysLeft <= 7).length +
        MAX_HOURS_ALERTS.filter(a => a.excess >= 10).length +
        OT_LIMIT_ALERTS.filter(a => a.excess >= 5).length;

    return (
        <div className={styles.page}>

            {/* ── Header ── */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Compliance Controls</h1>
                    <p className={styles.pageSubtitle}>
                        Proactive alerts for probation expiry, retirement age, minimum wage compliance, and contract renewals.
                    </p>
                </div>
                <Button variant="primary" size="sm" icon={<Shield size={15} />}>Generate Report</Button>
            </div>

            {/* ── Alert Summary Banner ── */}
            <div className={styles.banner}>
                <div className={styles.bannerLeft}>
                    <AlertTriangle size={22} className={styles.bannerIcon} />
                    <div>
                        <p className={styles.bannerTitle}>{totalAlerts} compliance alerts require attention</p>
                        <p className={styles.bannerSub}>{critical} critical · {totalAlerts - critical} non-critical</p>
                    </div>
                </div>
                <div className={styles.bannerStatsRow}>
                    <div className={styles.bannerStat}><span className={styles.bannerNum} style={{ color: '#F59E0B' }}>{PROBATION_ALERTS.length}</span><span>Probation</span></div>
                    <div className={styles.bannerStat}><span className={styles.bannerNum} style={{ color: '#EF4444' }}>{RETIREMENT_ALERTS.length}</span><span>Retirement</span></div>
                    <div className={styles.bannerStat}><span className={styles.bannerNum} style={{ color: '#8B5CF6' }}>{MINWAGE_ALERTS.length}</span><span>Min Wage</span></div>
                    <div className={styles.bannerStat}><span className={styles.bannerNum} style={{ color: '#3B82F6' }}>{CONTRACT_ALERTS.length}</span><span>Contracts</span></div>
                    <div className={styles.bannerStat}><span className={styles.bannerNum} style={{ color: '#10B981' }}>{MAX_HOURS_ALERTS.length}</span><span>Max Hours</span></div>
                    <div className={styles.bannerStat}><span className={styles.bannerNum} style={{ color: '#F97316' }}>{OT_LIMIT_ALERTS.length}</span><span>OT Limit</span></div>
                </div>
            </div>

            {/* ── Alert Sections ── */}
            <div className={styles.alertsGrid}>

                <AlertCard icon={<Clock size={18} />} title="Probation Expiry" color="#F59E0B" count={PROBATION_ALERTS.length}>
                    {PROBATION_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>{initials(a.name)}</div>
                            <div className={styles.alertInfo}>
                                <span className={styles.alertName}>{a.name}</span>
                                <span className={styles.alertMeta}>{a.empNo} · {a.dept} · Ends {fmtDate(a.probationEnd)}</span>
                            </div>
                            <div className={styles.alertRight}>
                                <Badge variant={URGENCY(a.daysLeft)} dot>{a.daysLeft}d left</Badge>
                                <button className={styles.actionArrow} onClick={() => setShowForm(true)}><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    ))}
                </AlertCard>

                <AlertCard icon={<Users size={18} />} title="Retirement Age" color="#EF4444" count={RETIREMENT_ALERTS.length}>
                    {RETIREMENT_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{initials(a.name)}</div>
                            <div className={styles.alertInfo}>
                                <span className={styles.alertName}>{a.name}</span>
                                <span className={styles.alertMeta}>{a.empNo} · {a.dept} · Age {a.age} · DOB {fmtDate(a.dob)}</span>
                            </div>
                            <div className={styles.alertRight}>
                                <Badge variant={a.retireIn === 'Overdue' ? 'danger' : 'warning'} dot>{a.retireIn}</Badge>
                                <button className={styles.actionArrow}><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    ))}
                </AlertCard>

                <AlertCard icon={<TrendingDown size={18} />} title="Below Minimum Wage" color="#8B5CF6" count={MINWAGE_ALERTS.length}>
                    {MINWAGE_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>{initials(a.name)}</div>
                            <div className={styles.alertInfo}>
                                <span className={styles.alertName}>{a.name}</span>
                                <span className={styles.alertMeta}>{a.empNo} · {a.dept} · Basic {fmt(a.basic)} (Min: {fmt(a.minWage)})</span>
                            </div>
                            <div className={styles.alertRight}>
                                <span className={styles.gapBadge}>+{fmt(a.gap)} required</span>
                                <button className={styles.actionArrow} onClick={() => setShowForm(true)}><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    ))}
                </AlertCard>

                <AlertCard icon={<Info size={18} />} title="Contract Renewals" color="#3B82F6" count={CONTRACT_ALERTS.length}>
                    {CONTRACT_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>{initials(a.name)}</div>
                            <div className={styles.alertInfo}>
                                <span className={styles.alertName}>{a.name}</span>
                                <span className={styles.alertMeta}>{a.empNo} · {a.dept} · Expires {fmtDate(a.contractEnd)}</span>
                            </div>
                            <div className={styles.alertRight}>
                                <Badge variant={URGENCY(a.daysLeft)} dot>{a.daysLeft}d left</Badge>
                                <button className={styles.actionArrow}><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    ))}
                </AlertCard>

                <AlertCard icon={<Gauge size={18} />} title="Max Working Hours Exceeded" color="#10B981" count={MAX_HOURS_ALERTS.length}>
                    {MAX_HOURS_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>{initials(a.name)}</div>
                            <div className={styles.alertInfo}>
                                <span className={styles.alertName}>{a.name}</span>
                                <span className={styles.alertMeta}>{a.empNo} · {a.dept} · {a.weeklyHours}h/wk (Legal max: {a.legalMax}h)</span>
                            </div>
                            <div className={styles.alertRight}>
                                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.14)', color: '#10B981', whiteSpace: 'nowrap' }}>+{a.excess}h over</span>
                                <button className={styles.actionArrow}><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    ))}
                </AlertCard>

                <AlertCard icon={<Timer size={18} />} title="OT Limit Exceeded" color="#F97316" count={OT_LIMIT_ALERTS.length}>
                    {OT_LIMIT_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316' }}>{initials(a.name)}</div>
                            <div className={styles.alertInfo}>
                                <span className={styles.alertName}>{a.name}</span>
                                <span className={styles.alertMeta}>{a.empNo} · {a.dept} · {a.weeklyOT}h OT (Limit: {a.otLimit}h/wk)</span>
                            </div>
                            <div className={styles.alertRight}>
                                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(249,115,22,0.14)', color: '#F97316', whiteSpace: 'nowrap' }}>+{a.excess}h excess</span>
                                <button className={styles.actionArrow}><ChevronRight size={14} /></button>
                            </div>
                        </div>
                    ))}
                </AlertCard>

            </div>

            {/* ── Leave Balance Carry Forward Rules (above status) ── */}
            <div className={styles.checklistCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <CalendarClock size={20} style={{ color: 'var(--color-primary)' }} />
                    <h3 className={styles.checklistTitle} style={{ margin: 0 }}>Leave Balance Carry Forward Rules</h3>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--color-text-muted)' }}>Click Edit to modify any rule</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr>
                                {['Leave Type', 'Entitlement (Days)', 'Max Carry Forward', 'Expiry / Reset', 'Carries?', 'Rule', ''].map(h => (
                                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--color-main-bg)', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {leaveRules.map((r, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                                    <td style={{ padding: '11px 14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{r.type}</td>
                                    <td style={{ padding: '11px 14px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>{r.entitlement === 0 ? '—' : r.entitlement}</td>
                                    <td style={{ padding: '11px 14px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>{r.maxCarry}</td>
                                    <td style={{ padding: '11px 14px', color: 'var(--color-text-secondary)' }}>{r.expiry}</td>
                                    <td style={{ padding: '11px 14px' }}>
                                        {r.carries
                                            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}><CheckCircle size={12} /> Yes</span>
                                            : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}><XCircle size={12} /> No</span>
                                        }
                                    </td>
                                    <td style={{ padding: '11px 14px', fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic', maxWidth: '260px' }}>{computeRule(r)}</td>
                                    <td style={{ padding: '11px 14px' }}>
                                        <button
                                            onClick={() => openEdit(i)}
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-secondary)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)' }}
                                        >
                                            <Edit2 size={12} /> Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Company-Wide Compliance Status ── */}
            <div className={styles.checklistCard}>
                <h3 className={styles.checklistTitle}>Company-Wide Compliance Status</h3>
                <div className={styles.checklist}>
                    {[
                        { label: 'EPF / ETF contributions up to date', pass: true },
                        { label: 'All employees with EPF numbers registered', pass: true },
                        { label: 'Minimum wage compliance — all employees', pass: false, detail: `${MINWAGE_ALERTS.length} employees below threshold` },
                        { label: 'Probation periods within legal limits', pass: true },
                        { label: 'Retirement-age employees actioned', pass: false, detail: `${RETIREMENT_ALERTS.length} require attention` },
                        { label: 'Annual leave balances posted', pass: true },
                        { label: 'APIT / Tax deductions configured', pass: true },
                        { label: 'Bank payment details complete', pass: true },
                        { label: 'Max working hours within legal limit (45h/wk)', pass: false, detail: `${MAX_HOURS_ALERTS.length} employees exceeded` },
                        { label: 'OT hours within permitted limit (12h/wk)', pass: false, detail: `${OT_LIMIT_ALERTS.length} employees exceeded` },
                    ].map((item, i) => (
                        <div key={i} className={`${styles.checkItem} ${item.pass ? styles.checkPass : styles.checkFail}`}>
                            {item.pass ? <CheckCircle size={16} className={styles.checkIconPass} /> : <XCircle size={16} className={styles.checkIconFail} />}
                            <span className={styles.checkLabel}>{item.label}</span>
                            {item.detail && <span className={styles.checkDetail}>{item.detail}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Employee Edit Form ── */}
            {showForm && <EmployeeForm employee={MOCK_EMP} onClose={() => setShowForm(false)} initialTab="employment" />}

            {/* ── Leave Rule Edit Modal ── */}
            {draft && editIdx !== -1 && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                    onClick={e => { if (e.target === e.currentTarget) closeEdit(); }}>
                    <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

                        {/* Modal Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Edit Leave Rule</h2>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '3px' }}>{draft.type}</p>
                            </div>
                            <button onClick={closeEdit} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Annual Entitlement (Days)</span>
                                    <input type="number" min={0} value={draft.entitlement}
                                        onChange={e => setDraft(d => d ? { ...d, entitlement: Number(e.target.value) } : d)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-family)', outline: 'none' }} />
                                </label>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Max Carry Forward (Days)</span>
                                    <input type="number" min={0} value={draft.maxCarry}
                                        onChange={e => setDraft(d => d ? { ...d, maxCarry: Number(e.target.value) } : d)}
                                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-family)', outline: 'none' }} />
                                </label>
                            </div>

                            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Expiry / Reset Date</span>
                                <input type="text" value={draft.expiry}
                                    onChange={e => setDraft(d => d ? { ...d, expiry: e.target.value } : d)}
                                    placeholder="e.g. 31 Mar or Year End"
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-family)', outline: 'none' }} />
                            </label>

                            {/* Live Rule Preview — auto-generated, not manually typed */}
                            <div style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-main-bg)' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Effective Rule (auto-generated)</span>
                                <span style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: '1.5' }}>{computeRule(draft)}</span>
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', background: draft.carries ? 'var(--color-success-light)' : 'var(--color-danger-light)', transition: 'background 0.2s' }}>
                                <input type="checkbox" checked={draft.carries}
                                    onChange={e => setDraft(d => d ? { ...d, carries: e.target.checked } : d)}
                                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-success)', cursor: 'pointer' }} />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: draft.carries ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                    {draft.carries ? '✓ Carry Forward Enabled' : '✗ No Carry Forward'}
                                </span>
                            </label>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--color-border)' }}>
                            <Button variant="ghost" size="sm" onClick={closeEdit}>Cancel</Button>
                            <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={saveRule}>Save Rule</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* ─── Alert Card wrapper ─────────────────────────────────── */
function AlertCard({ icon, title, color, count, children }: {
    icon: React.ReactNode; title: string; color: string; count: number; children: React.ReactNode;
}) {
    return (
        <div className={styles.alertCard} style={{ borderTopColor: color }}>
            <div className={styles.alertCardHeader}>
                <div className={styles.alertCardIcon} style={{ color, background: color + '22' }}>{icon}</div>
                <span className={styles.alertCardTitle}>{title}</span>
                <span className={styles.alertCardCount} style={{ background: color + '22', color }}>{count}</span>
            </div>
            <div className={styles.alertCardBody}>{children}</div>
        </div>
    );
}
