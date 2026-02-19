'use client';

import React, { useState } from 'react';
import {
    Clock, AlertTriangle, TrendingDown, Users, ChevronRight,
    Shield, CheckCircle, XCircle, Info
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmployeeForm from '@/components/master-data/EmployeeForm';
import type { Employee } from '@/components/master-data/EmployeeTable';
import styles from './page.module.css';

/* ─── Alert Data ─────────────────────────────────────────── */
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

const MOCK_EMP: Employee = { id: '4', empNo: 'BT-004', fullName: 'Nimali Jayawardene', nic: '940123456V', dept: 'HR', section: 'Recruitment', designation: 'Accounts Officer', category: 'Management', joinDate: '2024-01-15', status: 'Probation', basic: 65000, alerts: ['probation'] };

/* ─── Severity color map ─────────────────────────────────── */
const URGENCY = (days: number): 'danger' | 'warning' | 'info' => {
    if (days <= 7) return 'danger';
    if (days <= 30) return 'warning';
    return 'info';
};

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');

export default function CompliancePage() {
    const [showForm, setShowForm] = useState(false);

    const totalAlerts = PROBATION_ALERTS.length + RETIREMENT_ALERTS.length + MINWAGE_ALERTS.length + CONTRACT_ALERTS.length;
    const critical = PROBATION_ALERTS.filter(a => a.daysLeft <= 7).length +
        RETIREMENT_ALERTS.filter(a => a.retireIn === 'Overdue').length +
        CONTRACT_ALERTS.filter(a => a.daysLeft <= 7).length;

    return (
        <div className={styles.page}>
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
                </div>
            </div>

            {/* ── Alert Sections ── */}
            <div className={styles.alertsGrid}>

                {/* Probation Expiry */}
                <AlertCard
                    icon={<Clock size={18} />}
                    title="Probation Expiry"
                    color="#F59E0B"
                    count={PROBATION_ALERTS.length}
                >
                    {PROBATION_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                                {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
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

                {/* Retirement Age */}
                <AlertCard
                    icon={<Users size={18} />}
                    title="Retirement Age"
                    color="#EF4444"
                    count={RETIREMENT_ALERTS.length}
                >
                    {RETIREMENT_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: '#FEE2E2', color: '#EF4444' }}>
                                {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
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

                {/* Minimum Wage */}
                <AlertCard
                    icon={<TrendingDown size={18} />}
                    title="Below Minimum Wage"
                    color="#8B5CF6"
                    count={MINWAGE_ALERTS.length}
                >
                    {MINWAGE_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: '#EDE9FE', color: '#8B5CF6' }}>
                                {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
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

                {/* Contract Renewals */}
                <AlertCard
                    icon={<Info size={18} />}
                    title="Contract Renewals"
                    color="#3B82F6"
                    count={CONTRACT_ALERTS.length}
                >
                    {CONTRACT_ALERTS.map(a => (
                        <div key={a.empNo} className={styles.alertRow}>
                            <div className={styles.alertAvatar} style={{ background: '#DBEAFE', color: '#3B82F6' }}>
                                {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
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

            </div>

            {/* ── Compliance Checklist ── */}
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
                    ].map((item, i) => (
                        <div key={i} className={`${styles.checkItem} ${item.pass ? styles.checkPass : styles.checkFail}`}>
                            {item.pass
                                ? <CheckCircle size={16} className={styles.checkIconPass} />
                                : <XCircle size={16} className={styles.checkIconFail} />
                            }
                            <span className={styles.checkLabel}>{item.label}</span>
                            {item.detail && <span className={styles.checkDetail}>{item.detail}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {showForm && <EmployeeForm employee={MOCK_EMP} onClose={() => setShowForm(false)} initialTab="employment" />}
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
                <div className={styles.alertCardIcon} style={{ color, background: color + '18' }}>{icon}</div>
                <span className={styles.alertCardTitle}>{title}</span>
                <span className={styles.alertCardCount} style={{ background: color + '18', color }}>{count}</span>
            </div>
            <div className={styles.alertCardBody}>{children}</div>
        </div>
    );
}
