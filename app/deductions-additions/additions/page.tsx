'use client';

import React from 'react';
import AdditionManager from '@/components/deductions-additions/AdditionManager';
import styles from './page.module.css';

export default function AdditionsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Additions</h1>
                    <p className={styles.pageSubtitle}>
                        Enter OT hours, incentives, bonuses, arrears, and custom allowances for each payroll period.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <AdditionManager />
            </div>
        </div>
    );
}
