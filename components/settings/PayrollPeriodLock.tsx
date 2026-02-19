'use client';

import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, CheckCircle2, Calendar, Info, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './PayrollPeriodLock.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type PeriodStatus = 'Open' | 'Locked' | 'Processed' | 'Archived';

interface PayrollPeriod {
    month: string;
    label: string;
    status: PeriodStatus;
    employees: number;
    lockedBy?: string;
    lockedAt?: string;
    processedAt?: string;
    netPayTotal: number;
    notes?: string;
}

/* ─── Mock Data ─────────────────────────────────────────── */
const PERIODS: PayrollPeriod[] = [
    { month: '2026-03', label: 'March 2026', status: 'Open', employees: 87, netPayTotal: 0, notes: 'Not yet started' },
    { month: '2026-02', label: 'February 2026', status: 'Locked', employees: 87, netPayTotal: 8240560, lockedBy: 'Kasun Perera', lockedAt: '2026-02-19 08:55', notes: 'Attendance locked. Processing pending.' },
    { month: '2026-01', label: 'January 2026', status: 'Processed', employees: 87, netPayTotal: 8076300, lockedBy: 'Kasun Perera', lockedAt: '2026-01-28 09:10', processedAt: '2026-01-31 11:22', notes: 'Payslips generated and bank file exported.' },
    { month: '2025-12', label: 'December 2025', status: 'Archived', employees: 85, netPayTotal: 7934200, lockedBy: 'Nimali Jayawardene', lockedAt: '2025-12-27 10:05', processedAt: '2025-12-31 14:40', notes: 'Year-end payroll. Bonus included.' },
    { month: '2025-11', label: 'November 2025', status: 'Archived', employees: 84, netPayTotal: 7812100, lockedBy: 'Nimali Jayawardene', lockedAt: '2025-11-28 09:30', processedAt: '2025-11-30 13:15' },
    { month: '2025-10', label: 'October 2025', status: 'Archived', employees: 84, netPayTotal: 7680400, lockedBy: 'Kasun Perera', lockedAt: '2025-10-29 08:45', processedAt: '2025-10-31 11:00' },
];

const STATUS_BADGE: Record<PeriodStatus, 'success' | 'info' | 'warning' | 'muted'> = {
    Open: 'success', Locked: 'info', Processed: 'warning', Archived: 'muted',
};

const STATUS_ICON: Record<PeriodStatus, React.ReactNode> = {
    Open: <Unlock size={13} />,
    Locked: <Lock size={13} />,
    Processed: <CheckCircle2 size={13} />,
    Archived: <Lock size={13} />,
};

const fmt = (n: number) => n > 0 ? 'LKR ' + n.toLocaleString('en-LK') : '—';

/* ─── Confirm Dialog ─────────────────────────────────────── */
function ConfirmDialog({
    month, action, onConfirm, onClose
}: { month: string; action: 'lock' | 'unlock'; onConfirm: () => void; onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const handleConfirm = async () => { setLoading(true); await new Promise(r => setTimeout(r, 900)); onConfirm(); setLoading(false); onClose(); };

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.confirmDialog}>
                <div className={styles.confirmIcon} style={{ color: action === 'lock' ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                    {action === 'lock' ? <Lock size={28} /> : <Unlock size={28} />}
                </div>
                <h3 className={styles.confirmTitle}>{action === 'lock' ? 'Lock Payroll Period' : 'Unlock Payroll Period'}</h3>
                <p className={styles.confirmBody}>
                    {action === 'lock'
                        ? <>Locking <strong>{month}</strong> will prevent any further attendance or deduction changes. This action can be reversed by an Admin.</>
                        : <>Unlocking <strong>{month}</strong> will allow attendance modifications. All processed payslips will be invalidated and must be reprocessed.</>
                    }
                </p>
                {action === 'unlock' && (
                    <div className={styles.confirmWarn}>
                        <AlertTriangle size={14} /> This will invalidate all generated payslips for this period.
                    </div>
                )}
                <div className={styles.confirmActions}>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button
                        id="confirm-period-action"
                        variant={action === 'lock' ? 'warning' : 'danger'}
                        size="sm"
                        icon={action === 'lock' ? <Lock size={14} /> : <Unlock size={14} />}
                        loading={loading}
                        onClick={handleConfirm}
                    >
                        {action === 'lock' ? 'Lock Period' : 'Unlock Period'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function PayrollPeriodLock() {
    const [periods, setPeriods] = useState<PayrollPeriod[]>(PERIODS);
    const [confirm, setConfirm] = useState<{ month: string; action: 'lock' | 'unlock' } | null>(null);

    const handleAction = (month: string, action: 'lock' | 'unlock') => setConfirm({ month, action });

    const applyAction = (month: string, action: 'lock' | 'unlock') => {
        setPeriods(prev => prev.map(p => p.month === month
            ? action === 'lock'
                ? { ...p, status: 'Locked', lockedBy: 'Kasun Perera', lockedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) }
                : { ...p, status: 'Open', lockedBy: undefined, lockedAt: undefined }
            : p
        ));
    };

    const currentPeriod = periods.find(p => p.status === 'Locked' || p.status === 'Open');

    return (
        <div className={styles.root}>
            {/* ── Info Banner ── */}
            <div className={styles.infoBanner}>
                <Info size={16} className={styles.infoIcon} />
                <div>
                    <strong>Period Locking</strong> — Lock a payroll period to freeze attendance and deductions before processing. Only Admins can unlock a processed period.
                    {currentPeriod && <span className={styles.currentPeriod}> · Current active period: <strong>{currentPeriod.label}</strong> ({currentPeriod.status})</span>}
                </div>
            </div>

            {/* ── Locked Stats ── */}
            <div className={styles.statsRow}>
                {[
                    { label: 'Active Period', value: periods.find(p => p.status === 'Open')?.label ?? '—', color: 'var(--color-success)' },
                    { label: 'Processing Period', value: periods.find(p => p.status === 'Locked')?.label ?? '—', color: 'var(--color-warning)' },
                    { label: 'Processed Periods', value: String(periods.filter(p => p.status === 'Processed' || p.status === 'Archived').length), color: 'var(--color-text-primary)' },
                    { label: 'Latest Net Payroll', value: fmt(periods.find(p => p.status === 'Processed')?.netPayTotal ?? 0), color: 'var(--color-primary)' },
                ].map(s => (
                    <div key={s.label} className={styles.statCard}>
                        <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
                        <span className={styles.statLabel}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Periods Table ── */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}><Calendar size={12} /> Period</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Employees</th>
                            <th className={styles.th}>Net Payroll</th>
                            <th className={styles.th}>Locked By</th>
                            <th className={styles.th}>Locked At</th>
                            <th className={styles.th}>Processed At</th>
                            <th className={styles.th}>Notes</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(p => (
                            <tr key={p.month} className={`${styles.row} ${p.status === 'Archived' ? styles.rowArchived : ''}`}>
                                <td className={styles.td}><span className={styles.periodMonth}>{p.label}</span></td>
                                <td className={styles.td}><Badge variant={STATUS_BADGE[p.status]}>{STATUS_ICON[p.status]} {p.status}</Badge></td>
                                <td className={styles.td}>{p.employees}</td>
                                <td className={`${styles.td} ${styles.netPay}`}>{fmt(p.netPayTotal)}</td>
                                <td className={styles.td}>{p.lockedBy ?? <span className={styles.na}>—</span>}</td>
                                <td className={`${styles.td} ${styles.mono}`}>{p.lockedAt ?? <span className={styles.na}>—</span>}</td>
                                <td className={`${styles.td} ${styles.mono}`}>{p.processedAt ?? <span className={styles.na}>—</span>}</td>
                                <td className={styles.td}><span className={styles.noteText}>{p.notes ?? '—'}</span></td>
                                <td className={styles.td}>
                                    <div className={styles.rowActions}>
                                        {p.status === 'Open' && (
                                            <Button id={`lock-${p.month}`} variant="warning" size="sm" icon={<Lock size={13} />}
                                                onClick={() => handleAction(p.month, 'lock')}>Lock</Button>
                                        )}
                                        {p.status === 'Locked' && (
                                            <Button id={`unlock-${p.month}`} variant="danger" size="sm" icon={<Unlock size={13} />}
                                                onClick={() => handleAction(p.month, 'unlock')}>Unlock</Button>
                                        )}
                                        {(p.status === 'Processed' || p.status === 'Archived') && (
                                            <Button id={`reopen-${p.month}`} variant="ghost" size="sm" icon={<RefreshCw size={13} />}
                                                onClick={() => handleAction(p.month, 'unlock')}>Admin Unlock</Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {confirm && (
                <ConfirmDialog
                    month={confirm.month}
                    action={confirm.action}
                    onClose={() => setConfirm(null)}
                    onConfirm={() => applyAction(confirm.month, confirm.action)}
                />
            )}
        </div>
    );
}
