'use client';

import React, { useState } from 'react';
import {
    Lock, PlayCircle, FileText, Building2,
    CheckCircle2, Clock, AlertCircle, ChevronRight,
    Users, Calendar, Download, Printer
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './PayrollActions.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type StepStatus = 'pending' | 'ready' | 'processing' | 'done' | 'error';

interface PayrollStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: StepStatus;
    actionLabel: string;
    actionIcon: React.ReactNode;
    details: string[];
    completedAt?: string;
}

/* ─── Months available ───────────────────────────────────── */
const MONTHS = ['2026-02', '2026-01', '2025-12'];

/* ─── Status helpers ─────────────────────────────────────── */
const STATUS_CONFIG: Record<StepStatus, { label: string; badgeVariant: 'muted' | 'warning' | 'info' | 'success' | 'danger'; icon: React.ReactNode }> = {
    pending: { label: 'Pending', badgeVariant: 'muted', icon: <Clock size={14} /> },
    ready: { label: 'Ready', badgeVariant: 'warning', icon: <AlertCircle size={14} /> },
    processing: { label: 'Processing', badgeVariant: 'info', icon: <Clock size={14} /> },
    done: { label: 'Done', badgeVariant: 'success', icon: <CheckCircle2 size={14} /> },
    error: { label: 'Error', badgeVariant: 'danger', icon: <AlertCircle size={14} /> },
};

/* ─── Initial Steps ──────────────────────────────────────── */
const INITIAL_STEPS: PayrollStep[] = [
    {
        id: 1,
        title: 'Lock Attendance',
        description: 'Finalise and lock the attendance register for the selected payroll period. No further changes will be allowed after locking.',
        icon: <Lock size={22} />,
        status: 'ready',
        actionLabel: 'Lock Attendance',
        actionIcon: <Lock size={15} />,
        details: [
            '1,240 employees in scope',
            '3 attendance records still pending review',
            'Payroll period: February 2026 (1–28 Feb)',
        ],
    },
    {
        id: 2,
        title: 'Process Salary',
        description: 'Run payroll calculations — basic salary, allowances, OT hours, deductions, EPF/ETF contributions — for all active employees.',
        icon: <PlayCircle size={22} />,
        status: 'pending',
        actionLabel: 'Process Salary',
        actionIcon: <PlayCircle size={15} />,
        details: [
            'Calculates gross earnings and net pay per employee',
            'Applies all approved deductions and additions',
            'Computes EPF 8%/12% + ETF 3%',
            'Validates minimum wage compliance before processing',
        ],
    },
    {
        id: 3,
        title: 'Generate Payslips',
        description: 'Produce individual payslips in English and Sinhala for all employees. Payslips can be printed or sent digitally.',
        icon: <FileText size={22} />,
        status: 'pending',
        actionLabel: 'Generate Payslips',
        actionIcon: <Printer size={15} />,
        details: [
            'English and Sinhala bilingual payslip template',
            'Individual PDF per employee',
            'Batch download as ZIP',
            'Print-ready A5 format',
        ],
    },
    {
        id: 4,
        title: 'Generate Bank File',
        description: 'Export a bank-ready CSV / Excel file containing net pay amounts and bank account details for bulk salary transfers.',
        icon: <Building2 size={22} />,
        status: 'pending',
        actionLabel: 'Export Bank File',
        actionIcon: <Download size={15} />,
        details: [
            'BOC / Commercial / People\'s Bank formats supported',
            'Includes: Employee Name, Account No., Branch, Amount',
            'Separate file per bank',
            'Totals verified before export',
        ],
    },
];

/* ─── Payroll History ────────────────────────────────────── */
const HISTORY = [
    { month: '2026-01', processedAt: '2026-01-30', employees: 1238, gross: 12450000, net: 10980000, status: 'Completed' },
    { month: '2025-12', processedAt: '2025-12-29', employees: 1235, gross: 13100000, net: 11560000, status: 'Completed' },
    { month: '2025-11', processedAt: '2025-11-28', employees: 1230, gross: 12280000, net: 10840000, status: 'Completed' },
];

const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');

/* ─── Connector line ─────────────────────────────────────── */
function StepConnector({ done }: { done: boolean }) {
    return <div className={`${styles.connector} ${done ? styles.connectorDone : ''}`} />;
}

/* ─── Main Component ─────────────────────────────────────── */
export default function PayrollActions() {
    const [steps, setSteps] = useState<PayrollStep[]>(INITIAL_STEPS);
    const [month, setMonth] = useState('2026-02');
    const [activeTab, setActiveTab] = useState<'flow' | 'history'>('flow');
    const [processing, setProcessing] = useState<number | null>(null);

    const handleAction = async (stepId: number) => {
        const currentStep = steps.find(s => s.id === stepId);
        if (!currentStep || (currentStep.status !== 'ready')) return;

        setProcessing(stepId);
        setSteps(prev => prev.map(s => s.id === stepId ? { ...s, status: 'processing' } : s));

        await new Promise(r => setTimeout(r, 2000)); // simulate API call

        setSteps(prev => prev.map(s => {
            if (s.id === stepId) return { ...s, status: 'done', completedAt: new Date().toLocaleTimeString() };
            if (s.id === stepId + 1) return { ...s, status: 'ready' };
            return s;
        }));
        setProcessing(null);
    };

    const handleReset = () => setSteps(INITIAL_STEPS);

    const completedSteps = steps.filter(s => s.status === 'done').length;
    const allDone = completedSteps === steps.length;

    return (
        <div className={styles.root}>
            {/* ── Tab Bar ── */}
            <div className={styles.tabRow}>
                <div className={styles.tabBar}>
                    {(['flow', 'history'] as const).map(tab => (
                        <button
                            key={tab}
                            id={`payflow-tab-${tab}`}
                            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >{tab === 'flow' ? '⚡ Process Flow' : '📋 History'}</button>
                    ))}
                </div>

                <div className={styles.headerRight}>
                    <select id="payflow-month" className={styles.monthSel} value={month} onChange={e => setMonth(e.target.value)}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    {completedSteps > 0 && (
                        <button className={styles.resetBtn} onClick={handleReset}>Reset Flow</button>
                    )}
                </div>
            </div>

            {/* ─────────── PROCESS FLOW TAB ─────────── */}
            {activeTab === 'flow' && (
                <>
                    {/* Period Banner */}
                    <div className={styles.periodBanner}>
                        <div className={styles.periodLeft}>
                            <Calendar size={18} className={styles.periodIcon} />
                            <div>
                                <span className={styles.periodTitle}>Payroll Period: February 2026</span>
                                <span className={styles.periodSub}>1 Feb 2026 – 28 Feb 2026 · 1,240 active employees</span>
                            </div>
                        </div>
                        <div className={styles.progressPills}>
                            {steps.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <div className={`${styles.progressDot} ${s.status === 'done' ? styles.progressDotDone : s.status === 'ready' ? styles.progressDotReady : ''}`}>
                                        {s.status === 'done' ? <CheckCircle2 size={12} /> : s.id}
                                    </div>
                                    {i < steps.length - 1 && <div className={`${styles.progressLine} ${steps[i + 1].status !== 'pending' ? styles.progressLineDone : ''}`} />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Completion Banner */}
                    {allDone && (
                        <div className={styles.doneBanner}>
                            <CheckCircle2 size={22} className={styles.doneIcon} />
                            <div>
                                <p className={styles.doneTitle}>Payroll for February 2026 is complete!</p>
                                <p className={styles.doneSub}>All 4 steps completed · Payslips generated · Bank file ready for upload</p>
                            </div>
                            <div className={styles.doneActions}>
                                <Button variant="ghost" size="sm" icon={<Printer size={14} />}>Print All Payslips</Button>
                                <Button variant="success" size="sm" icon={<Download size={14} />}>Download Bank File</Button>
                            </div>
                        </div>
                    )}

                    {/* Steps */}
                    <div className={styles.stepsList}>
                        {steps.map((step, idx) => {
                            const cfg = STATUS_CONFIG[step.status];
                            const isLocked = step.status === 'pending';
                            const isDone = step.status === 'done';
                            const isProc = step.status === 'processing';

                            return (
                                <React.Fragment key={step.id}>
                                    <div className={`${styles.stepCard} ${isDone ? styles.stepDone : isLocked ? styles.stepLocked : ''}`}>
                                        {/* Step number + icon */}
                                        <div className={`${styles.stepIconWrap} ${isDone ? styles.stepIconDone : isLocked ? styles.stepIconLocked : styles.stepIconReady}`}>
                                            {isDone ? <CheckCircle2 size={22} /> : step.icon}
                                        </div>

                                        {/* Content */}
                                        <div className={styles.stepContent}>
                                            <div className={styles.stepHeader}>
                                                <span className={styles.stepNum}>Step {step.id}</span>
                                                <Badge variant={cfg.badgeVariant}>{cfg.icon}{cfg.label}</Badge>
                                                {isDone && step.completedAt && (
                                                    <span className={styles.completedAt}>Completed at {step.completedAt}</span>
                                                )}
                                            </div>
                                            <h3 className={styles.stepTitle}>{step.title}</h3>
                                            <p className={styles.stepDesc}>{step.description}</p>

                                            <ul className={styles.detailList}>
                                                {step.details.map((d, i) => (
                                                    <li key={i} className={styles.detailItem}>
                                                        <ChevronRight size={12} className={styles.detailIcon} />
                                                        {d}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Action */}
                                        <div className={styles.stepAction}>
                                            {!isDone && (
                                                <Button
                                                    id={`payflow-action-step${step.id}`}
                                                    variant={isLocked ? 'ghost' : 'primary'}
                                                    size="md"
                                                    icon={step.actionIcon}
                                                    loading={isProc}
                                                    onClick={() => handleAction(step.id)}
                                                    disabled={isLocked}
                                                >
                                                    {isProc ? 'Processing…' : step.actionLabel}
                                                </Button>
                                            )}
                                            {isDone && (
                                                <Button variant="ghost" size="sm" icon={<Download size={14} />}>Download</Button>
                                            )}
                                        </div>
                                    </div>
                                    {idx < steps.length - 1 && <StepConnector done={isDone} />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </>
            )}

            {/* ─────────── HISTORY TAB ─────────── */}
            {activeTab === 'history' && (
                <div className={styles.historyWrap}>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Payroll Month</th>
                                    <th className={styles.th}>Processed Date</th>
                                    <th className={styles.th}>Employees</th>
                                    <th className={styles.th}>Total Gross</th>
                                    <th className={styles.th}>Net Payable</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {HISTORY.map(h => (
                                    <tr key={h.month} className={styles.row}>
                                        <td className={`${styles.td} ${styles.monthCell}`}><Calendar size={14} />{h.month}</td>
                                        <td className={styles.td}>{new Date(h.processedAt).toLocaleDateString('en-GB')}</td>
                                        <td className={styles.td}><Users size={13} style={{ marginRight: 4, color: 'var(--color-text-muted)' }} />{h.employees.toLocaleString()}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{fmt(h.gross)}</td>
                                        <td className={`${styles.td} ${styles.moneyNet}`}>{fmt(h.net)}</td>
                                        <td className={styles.td}><Badge variant="success" dot>Completed</Badge></td>
                                        <td className={styles.td}>
                                            <div className={styles.rowActions}>
                                                <button id={`view-payslip-${h.month}`} className={styles.actionBtn} title="View Payslips"><FileText size={14} /></button>
                                                <button id={`dl-bank-${h.month}`} className={styles.actionBtn} title="Download Bank File"><Download size={14} /></button>
                                                <button id={`print-${h.month}`} className={styles.actionBtn} title="Print"><Printer size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
