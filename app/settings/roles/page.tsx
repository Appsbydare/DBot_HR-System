'use client';
import React from 'react';
import RoleManager from '@/components/settings/RoleManager';
import styles from './page.module.css';

export default function RolesPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Role-Based Access Control</h1>
                    <p className={styles.pageSubtitle}>Define what each role can see and do across every module. Manage system users and their assigned roles.</p>
                </div>
            </div>
            <div className={styles.card}><RoleManager /></div>
        </div>
    );
}
