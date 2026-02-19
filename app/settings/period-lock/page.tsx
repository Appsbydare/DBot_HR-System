'use client';
import React from 'react';
import PayrollPeriodLock from '@/components/settings/PayrollPeriodLock';
import styles from './page.module.css';

export default function PeriodLockPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Payroll Period Locking</h1>
                    <p className={styles.pageSubtitle}>Lock payroll periods to freeze attendance before processing. Admin unlock invalidates generated payslips and requires reprocessing.</p>
                </div>
            </div>
            <div className={styles.card}><PayrollPeriodLock /></div>
        </div>
    );
}
