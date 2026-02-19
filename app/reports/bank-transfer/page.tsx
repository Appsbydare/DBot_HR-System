'use client';
import React from 'react';
import BankFileExport from '@/components/reports/BankFileExport';
import styles from './page.module.css';

export default function BankTransferPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Bank Transfer File</h1>
                    <p className={styles.pageSubtitle}>Generate bank-ready salary transfer files grouped by bank — export for BOC, Commercial, People's, NSB, Sampath, and HNB.</p>
                </div>
            </div>
            <div className={styles.card}>
                <BankFileExport />
            </div>
        </div>
    );
}
