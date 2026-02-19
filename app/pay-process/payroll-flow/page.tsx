'use client';

import React from 'react';
import PayrollActions from '@/components/pay-process/PayrollActions';
import styles from './page.module.css';

export default function PayrollFlowPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Payroll Process Flow</h1>
                    <p className={styles.pageSubtitle}>
                        Run the end-to-end payroll for each period — Lock Attendance → Process Salary → Generate Payslips → Export Bank File.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <PayrollActions />
            </div>
        </div>
    );
}
