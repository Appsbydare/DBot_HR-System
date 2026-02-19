'use client';

import React from 'react';
import LoanTracker from '@/components/deductions-additions/LoanTracker';
import styles from './page.module.css';

export default function LoansPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Loan Management</h1>
                    <p className={styles.pageSubtitle}>
                        Process staff loan applications, track installment schedules, and manage early settlements.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <LoanTracker />
            </div>
        </div>
    );
}
