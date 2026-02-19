import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock3, XCircle, ArrowRight } from 'lucide-react';
import styles from './PayrollSummary.module.css';

const STEPS = [
    { label: 'Attendance Locked', status: 'done', date: 'Feb 18, 2026' },
    { label: 'Salary Processed', status: 'done', date: 'Feb 18, 2026' },
    { label: 'Payslips Generated', status: 'pending', date: 'Pending' },
    { label: 'Bank File Generated', status: 'locked', date: 'Not started' },
];

const STATUS_ICON: Record<string, React.ReactNode> = {
    done: <CheckCircle2 size={18} />,
    pending: <Clock3 size={18} />,
    locked: <XCircle size={18} />,
};

const STATUS_CLASS: Record<string, string> = {
    done: styles.statusDone,
    pending: styles.statusPending,
    locked: styles.statusLocked,
};

export default function PayrollSummary() {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Payroll Status</h3>
                    <p className={styles.subtitle}>February 2026</p>
                </div>
                <Link href="/pay-process/payroll-flow" className={styles.actionBtn}>
                    Continue <ArrowRight size={14} />
                </Link>
            </div>

            {/* Progress bar */}
            <div className={styles.progressWrap}>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '50%' }} />
                </div>
                <span className={styles.progressLabel}>2 of 4 steps complete</span>
            </div>

            {/* Steps */}
            <div className={styles.steps}>
                {STEPS.map((step, i) => (
                    <div key={i} className={`${styles.step} ${STATUS_CLASS[step.status]}`}>
                        <span className={styles.stepIcon}>{STATUS_ICON[step.status]}</span>
                        <div className={styles.stepInfo}>
                            <span className={styles.stepLabel}>{step.label}</span>
                            <span className={styles.stepDate}>{step.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Gross</span>
                    <span className={styles.summaryValue}>LKR 9,842,500</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Net</span>
                    <span className={`${styles.summaryValue} ${styles.summaryHighlight}`}>LKR 8,412,300</span>
                </div>
            </div>
        </div>
    );
}
