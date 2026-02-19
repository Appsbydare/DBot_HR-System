'use client';
import React from 'react';
import PayslipTemplate from '@/components/reports/PayslipTemplate';
import styles from './page.module.css';

export default function PayslipsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Payslips</h1>
                    <p className={styles.pageSubtitle}>Preview, print, and download individual payslips in English or Sinhala for any employee and period.</p>
                </div>
            </div>
            <div className={styles.card}>
                <PayslipTemplate />
            </div>
        </div>
    );
}
