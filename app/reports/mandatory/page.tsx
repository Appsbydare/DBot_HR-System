'use client';
import React from 'react';
import ReportViewer from '@/components/reports/ReportViewer';
import styles from './page.module.css';

export default function MandatoryReportsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Mandatory Reports</h1>
                    <p className={styles.pageSubtitle}>Master data, payroll summaries, pay details, absenteeism, OT, time cards and leave balances.</p>
                </div>
            </div>
            <div className={styles.card}>
                <ReportViewer mode="mandatory" />
            </div>
        </div>
    );
}
