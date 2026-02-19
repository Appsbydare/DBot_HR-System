'use client';

import React from 'react';
import PayrollSummary from '@/components/pay-process/PayrollSummary';
import styles from './page.module.css';

export default function PayrollCalculationPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Payroll Calculation</h1>
                    <p className={styles.pageSubtitle}>
                        Per-employee earnings breakdown — Basic + Allowances + OT − Deductions = Net Pay. Click any row to expand full details.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <PayrollSummary />
            </div>
        </div>
    );
}
