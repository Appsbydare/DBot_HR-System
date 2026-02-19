import React from 'react';
import Link from 'next/link';
import { UserPlus, Clock, FileText, DollarSign, Download } from 'lucide-react';
import styles from './QuickActions.module.css';

const ACTIONS = [
    { label: 'Add Employee', href: '/master-data/personal-info', icon: <UserPlus size={20} />, color: 'primary' },
    { label: 'Mark Attendance', href: '/leave-attendance/attendance', icon: <Clock size={20} />, color: 'info' },
    { label: 'Apply Leave', href: '/leave-attendance/leave-management', icon: <FileText size={20} />, color: 'warning' },
    { label: 'Run Payroll', href: '/pay-process/payroll-flow', icon: <DollarSign size={20} />, color: 'success' },
    { label: 'Export Reports', href: '/reports/mandatory', icon: <Download size={20} />, color: 'purple' },
];

const COLOR_MAP: Record<string, string> = {
    primary: '#E63946',
    info: '#3B82F6',
    warning: '#F59E0B',
    success: '#10B981',
    purple: '#8B5CF6',
};

export default function QuickActions() {
    return (
        <div className={styles.section}>
            <h3 className={styles.title}>Quick Actions</h3>
            <div className={styles.grid}>
                {ACTIONS.map(action => (
                    <Link key={action.label} href={action.href} className={styles.action}>
                        <div
                            className={styles.actionIcon}
                            style={{
                                background: `${COLOR_MAP[action.color]}18`,
                                color: COLOR_MAP[action.color]
                            }}
                        >
                            {action.icon}
                        </div>
                        <span className={styles.actionLabel}>{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
