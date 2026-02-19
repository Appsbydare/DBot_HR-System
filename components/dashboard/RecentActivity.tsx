import React from 'react';
import { CheckCircle, AlertCircle, UserPlus, DollarSign, Clock, Lock } from 'lucide-react';
import styles from './RecentActivity.module.css';

const ACTIVITIES = [
    {
        icon: <UserPlus size={15} />,
        color: 'success',
        text: 'New employee added',
        user: 'Kasun Perera',
        empNo: 'BT-001',
        detail: 'Software Dev · IT Dept',
        time: '2 min ago',
    },
    {
        icon: <CheckCircle size={15} />,
        color: 'info',
        text: 'Leave approved',
        user: 'Chamari Atapattu',
        empNo: 'BT-002',
        detail: 'Annual Leave · 2 days',
        time: '18 min ago',
    },
    {
        icon: <DollarSign size={15} />,
        color: 'primary',
        text: 'Payroll processed',
        user: 'February 2026',
        detail: 'LKR 8.4M total · 1,240 employees',
        time: '1 hr ago',
    },
    {
        icon: <AlertCircle size={15} />,
        color: 'warning',
        text: 'Compliance alert',
        user: 'Minimum wage review',
        detail: '3 employees flagged',
        time: '3 hr ago',
    },
    {
        icon: <Clock size={15} />,
        color: 'muted',
        text: 'Attendance marked',
        user: 'Morning Shift',
        detail: '412 / 440 present',
        time: '5 hr ago',
    },
    {
        icon: <Lock size={15} />,
        color: 'danger',
        text: 'Payroll period locked',
        user: 'January 2026',
        detail: 'Locked by System Admin',
        time: 'Yesterday',
    },
];

const COLOR_MAP: Record<string, string> = {
    success: 'var(--color-success)',
    info: 'var(--color-info)',
    primary: 'var(--color-primary)',
    warning: 'var(--color-warning)',
    muted: 'var(--color-text-muted)',
    danger: 'var(--color-danger)',
};

const BG_MAP: Record<string, string> = {
    success: 'var(--color-success-light)',
    info: 'var(--color-info-light)',
    primary: 'var(--color-primary-light)',
    warning: 'var(--color-warning-light)',
    muted: 'var(--color-border-light)',
    danger: 'var(--color-danger-light)',
};

export default function RecentActivity() {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>Recent Activity</h3>
                <span className={styles.viewAll}>View all →</span>
            </div>

            <div className={styles.list}>
                {ACTIVITIES.map((a, i) => (
                    <div key={i} className={styles.item}>
                        {/* Icon */}
                        <div
                            className={styles.iconWrap}
                            style={{ background: BG_MAP[a.color], color: COLOR_MAP[a.color] }}
                        >
                            {a.icon}
                        </div>

                        {/* Connector line */}
                        {i < ACTIVITIES.length - 1 && <div className={styles.line} />}

                        {/* Content */}
                        <div className={styles.content}>
                            <div className={styles.topRow}>
                                <span className={styles.action}>{a.text}</span>
                                <span className={styles.time}>{a.time}</span>
                            </div>
                            <span className={styles.user}>
                                {a.user}
                                {'empNo' in a && a.empNo && (
                                    <span className={styles.empNo}>{a.empNo as string}</span>
                                )}
                            </span>
                            <span className={styles.detail}>{a.detail}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
