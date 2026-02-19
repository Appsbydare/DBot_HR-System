'use client';

import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, CheckCircle2, Clock, XCircle, CreditCard, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './LoanTracker.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type LoanStatus = 'Active' | 'Settled' | 'Rejected' | 'Pending';

interface Installment {
    no: number;
    month: string;
    amount: number;
    paid: boolean;
}

interface Loan {
    id: string;
    empNo: string;
    empName: string;
    dept: string;
    loanAmount: number;
    installment: number;
    balance: number;
    paidInstallments: number;
    totalInstallments: number;
    startMonth: string;
    status: LoanStatus;
    reason: string;
    schedule: Installment[];
}

/* ─── Helper to build schedule ───────────────────────────── */
function buildSchedule(startMonth: string, totalInst: number, instAmt: number, paidCount: number): Installment[] {
    const [y, m] = startMonth.split('-').map(Number);
    return Array.from({ length: totalInst }, (_, i) => {
        const date = new Date(y, m - 1 + i, 1);
        return {
            no: i + 1,
            month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            amount: instAmt,
            paid: i < paidCount,
        };
    });
}

/* ─── Mock Data ─────────────────────────────────────────── */
const LOANS: Loan[] = [
    {
        id: 'L001', empNo: 'BT-001', empName: 'Kasun Perera', dept: 'IT', loanAmount: 50000, installment: 5000, balance: 35000, paidInstallments: 3, totalInstallments: 10,
        startMonth: '2025-11', status: 'Active', reason: 'Emergency medical',
        schedule: buildSchedule('2025-11', 10, 5000, 3),
    },
    {
        id: 'L002', empNo: 'BT-003', empName: 'Ajith Bandara', dept: 'Production', loanAmount: 30000, installment: 3000, balance: 0, paidInstallments: 10, totalInstallments: 10,
        startMonth: '2025-01', status: 'Settled', reason: 'Home renovation',
        schedule: buildSchedule('2025-01', 10, 3000, 10),
    },
    {
        id: 'L003', empNo: 'BT-006', empName: 'Sandya Kumari', dept: 'Admin', loanAmount: 20000, installment: 2000, balance: 16000, paidInstallments: 2, totalInstallments: 10,
        startMonth: '2025-12', status: 'Active', reason: 'Educational expenses',
        schedule: buildSchedule('2025-12', 10, 2000, 2),
    },
    {
        id: 'L004', empNo: 'BT-007', empName: 'Pradeep Silva', dept: 'Production', loanAmount: 80000, installment: 8000, balance: 80000, paidInstallments: 0, totalInstallments: 10,
        startMonth: '2026-03', status: 'Pending', reason: 'Vehicle purchase',
        schedule: buildSchedule('2026-03', 10, 8000, 0),
    },
    {
        id: 'L005', empNo: 'BT-009', empName: 'Thilak Dissanayake', dept: 'Logistics', loanAmount: 25000, installment: 5000, balance: 25000, paidInstallments: 0, totalInstallments: 5,
        startMonth: '2026-02', status: 'Rejected', reason: 'Personal reasons',
        schedule: buildSchedule('2026-02', 5, 5000, 0),
    },
];

const STATUS_VARIANT: Record<LoanStatus, 'success' | 'info' | 'danger' | 'warning'> = {
    Active: 'info', Settled: 'success', Rejected: 'danger', Pending: 'warning',
};

const STATUS_ICON: Record<LoanStatus, React.ReactNode> = {
    Active: <Clock size={14} />, Settled: <CheckCircle2 size={14} />,
    Rejected: <XCircle size={14} />, Pending: <Clock size={14} />,
};

const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');
const fmtM = (s: string) => new Date(s + '-01').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

/* ─── Add Loan Modal ─────────────────────────────────────── */
function ApplyLoanModal({ onClose }: { onClose: () => void }) {
    const [saving, setSaving] = useState(false);
    const [loanAmt, setLoanAmt] = useState(0);
    const [instCount, setInstCount] = useState(10);
    const instAmt = instCount > 0 && loanAmt > 0 ? Math.ceil(loanAmt / instCount) : 0;

    const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 700)); setSaving(false); onClose(); };

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Apply for Staff Loan</h3>
                    <button id="close-loan-modal" className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.formGrid}>
                        <div className={styles.formField}>
                            <label htmlFor="loan-emp-id">Employee ID</label>
                            <input id="loan-emp-id" type="text" className={styles.formInput}
                                placeholder="e.g. BT-001"
                                list="loan-emp-list"
                            />
                            <datalist id="loan-emp-list">
                                {['BT-001', 'BT-002', 'BT-003', 'BT-004', 'BT-005', 'BT-006', 'BT-007', 'BT-008', 'BT-009'].map(id => <option key={id} value={id} />)}
                            </datalist>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="loan-reason">Reason</label>
                            <input id="loan-reason" type="text" className={styles.formInput} placeholder="e.g. Medical emergency" />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="loan-amount">Loan Amount (LKR)</label>
                            <input id="loan-amount" type="number" className={styles.formInput} placeholder="0.00"
                                onChange={e => setLoanAmt(Number(e.target.value))} />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="loan-inst-count">No. of Installments</label>
                            <select id="loan-inst-count" className={styles.formSelect} value={instCount} onChange={e => setInstCount(Number(e.target.value))}>
                                {[3, 6, 10, 12, 18, 24].map(n => <option key={n} value={n}>{n} months</option>)}
                            </select>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="loan-start">Start Month</label>
                            <input id="loan-start" type="month" className={styles.formInput} defaultValue="2026-03" />
                        </div>
                        <div className={styles.formField}>
                            <label>Monthly Installment</label>
                            <div className={styles.calcPreview}>{instAmt > 0 ? fmt(instAmt) : '—'}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" size="sm" icon={<CreditCard size={14} />} loading={saving} onClick={handleSave}>Submit Application</Button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function LoanTracker() {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [statusF, setStatusF] = useState<LoanStatus | 'All'>('All');

    const filtered = statusF === 'All' ? LOANS : LOANS.filter(l => l.status === statusF);

    const totalActive = LOANS.filter(l => l.status === 'Active').reduce((s, l) => s + l.balance, 0);
    const totalLoaned = LOANS.reduce((s, l) => s + l.loanAmount, 0);
    const totalRecov = LOANS.reduce((s, l) => s + (l.loanAmount - l.balance), 0);

    return (
        <div className={styles.root}>
            {/* ── Summary Cards ── */}
            <div className={styles.summaryCards}>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>Outstanding Balance</span>
                    <span className={styles.cardValue} style={{ color: 'var(--color-danger)' }}>{fmt(totalActive)}</span>
                    <span className={styles.cardSub}>{LOANS.filter(l => l.status === 'Active').length} active loans</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>Total Disbursed</span>
                    <span className={styles.cardValue} style={{ color: 'var(--color-primary)' }}>{fmt(totalLoaned)}</span>
                    <span className={styles.cardSub}>{LOANS.length} total loans</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>Total Recovered</span>
                    <span className={styles.cardValue} style={{ color: 'var(--color-success)' }}>{fmt(totalRecov)}</span>
                    <span className={styles.cardSub}>{LOANS.filter(l => l.status === 'Settled').length} settled</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.cardLabel}>Pending Approval</span>
                    <span className={styles.cardValue} style={{ color: 'var(--color-warning)' }}>{LOANS.filter(l => l.status === 'Pending').length}</span>
                    <span className={styles.cardSub}>awaiting review</span>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <div className={styles.filterRow}>
                    {(['All', 'Active', 'Pending', 'Settled', 'Rejected'] as (LoanStatus | 'All')[]).map(s => (
                        <button
                            id={`loan-filter-${s}`}
                            key={s}
                            className={`${styles.filterPill} ${statusF === s ? styles.filterPillActive : ''}`}
                            onClick={() => setStatusF(s)}
                        >{s}</button>
                    ))}
                </div>
                <div className={styles.toolbarRight}>
                    <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export</Button>
                    <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Apply Loan</Button>
                </div>
            </div>

            {/* ── Loan Cards ── */}
            <div className={styles.loanList}>
                {filtered.map(loan => {
                    const paidPct = Math.round((loan.paidInstallments / loan.totalInstallments) * 100);
                    const isExpanded = expanded === loan.id;
                    return (
                        <div key={loan.id} className={`${styles.loanCard} ${loan.status === 'Settled' ? styles.loanSettled : ''}`}>
                            {/* Card Header */}
                            <div className={styles.loanHeader}>
                                <div className={styles.loanEmp}>
                                    <div className={styles.avatar}>{loan.empName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                    <div>
                                        <span className={styles.empId}>{loan.empNo}</span>
                                        <span className={styles.empName}>{loan.empName}</span>
                                        <span className={styles.empMeta}>{loan.dept} · {loan.reason}</span>
                                    </div>
                                </div>
                                <div className={styles.loanHeaderRight}>
                                    <div className={styles.loanAmounts}>
                                        <span className={styles.loanBalance}>{fmt(loan.balance)} <span className={styles.loanBalanceLabel}>remaining</span></span>
                                        <span className={styles.loanTotal}>of {fmt(loan.loanAmount)}</span>
                                    </div>
                                    <Badge variant={STATUS_VARIANT[loan.status]}>{STATUS_ICON[loan.status]} {loan.status}</Badge>
                                    <button
                                        id={`expand-loan-${loan.id}`}
                                        className={styles.expandBtn}
                                        onClick={() => setExpanded(isExpanded ? null : loan.id)}
                                    >
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className={styles.loanProgressRow}>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{
                                        width: `${paidPct}%`,
                                        background: loan.status === 'Settled' ? 'var(--color-success)' : 'var(--color-primary)',
                                    }} />
                                </div>
                                <span className={styles.progressLabel}>
                                    {loan.paidInstallments}/{loan.totalInstallments} installments paid
                                    · LKR {loan.installment.toLocaleString('en-LK')}/mo
                                    · Started {fmtM(loan.startMonth)}
                                </span>
                            </div>

                            {/* Expanded Schedule */}
                            {isExpanded && (
                                <div className={styles.scheduleWrap}>
                                    <div className={styles.scheduleGrid}>
                                        {loan.schedule.map(inst => (
                                            <div key={inst.no} className={`${styles.scheduleItem} ${inst.paid ? styles.paid : styles.unpaid}`}>
                                                <span className={styles.instNo}>#{inst.no}</span>
                                                <span className={styles.instMonth}>{fmtM(inst.month)}</span>
                                                <span className={styles.instAmt}>{fmt(inst.amount)}</span>
                                                {inst.paid
                                                    ? <CheckCircle2 size={14} className={styles.instPaidIcon} />
                                                    : <Clock size={14} className={styles.instPendIcon} />
                                                }
                                            </div>
                                        ))}
                                    </div>
                                    {loan.status === 'Active' && (
                                        <div className={styles.scheduleActions}>
                                            <Button variant="success" size="sm" icon={<CheckCircle2 size={14} />}>Mark Next Installment Paid</Button>
                                            <Button variant="danger" size="sm" icon={<XCircle size={14} />}>Settle Early</Button>
                                        </div>
                                    )}
                                    {loan.status === 'Pending' && (
                                        <div className={styles.scheduleActions}>
                                            <Button variant="success" size="sm" icon={<CheckCircle2 size={14} />}>Approve Loan</Button>
                                            <Button variant="danger" size="sm" icon={<XCircle size={14} />}>Reject</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showModal && <ApplyLoanModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
