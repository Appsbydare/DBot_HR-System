'use client';
import React from 'react';
import AuditLog from '@/components/settings/AuditLog';
import styles from './page.module.css';

export default function AuditLogPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Audit Log</h1>
                    <p className={styles.pageSubtitle}>Immutable record of every create, update, delete, and access event across the system — with before/after diff tracking.</p>
                </div>
            </div>
            <div className={styles.card}><AuditLog /></div>
        </div>
    );
}
