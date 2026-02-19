'use client';
import React from 'react';
import ReportViewer from '@/components/reports/ReportViewer';
import styles from './page.module.css';

export default function StatutoryReportsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Statutory Reports</h1>
                    <p className={styles.pageSubtitle}>EPF Form C, ETF monthly return, APIT salary tax, and annual EPF statements for government submissions.</p>
                </div>
            </div>
            <div className={styles.card}>
                <ReportViewer mode="statutory" />
            </div>
        </div>
    );
}
