'use client';

import React from 'react';
import DeductionManager from '@/components/deductions-additions/DeductionManager';
import styles from './page.module.css';

export default function DeductionsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Deductions</h1>
                    <p className={styles.pageSubtitle}>
                        Manage EPF, loan installments, advance recovery, no-pay, late penalties, and manual deductions per payroll period.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <DeductionManager />
            </div>
        </div>
    );
}
