'use client';
import React from 'react';
import BackupManager from '@/components/settings/BackupManager';
import styles from './page.module.css';

export default function BackupPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Backup Management</h1>
                    <p className={styles.pageSubtitle}>Schedule, monitor, and restore data backups. All backups are AES-256 encrypted and stored securely.</p>
                </div>
            </div>
            <div className={styles.card}><BackupManager /></div>
        </div>
    );
}
