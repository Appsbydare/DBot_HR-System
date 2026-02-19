'use client';

import React from 'react';
import ShiftCalendar from '@/components/leave-attendance/ShiftCalendar';
import styles from './page.module.css';

export default function ShiftsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Shift Management</h1>
                    <p className={styles.pageSubtitle}>
                        Configure shift types, assign employees to shifts, and manage public holidays.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <ShiftCalendar />
            </div>
        </div>
    );
}
