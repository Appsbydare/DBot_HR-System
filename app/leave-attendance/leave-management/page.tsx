'use client';

import React from 'react';
import LeaveRequestTable from '@/components/leave-attendance/LeaveRequestTable';
import styles from './page.module.css';

export default function LeaveManagementPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Leave Management</h1>
                    <p className={styles.pageSubtitle}>
                        Review and manage employee leave requests, approvals, and annual leave balances.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <LeaveRequestTable />
            </div>
        </div>
    );
}
