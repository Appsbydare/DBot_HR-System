'use client';

import React from 'react';
import AttendanceGrid from '@/components/leave-attendance/AttendanceGrid';
import styles from './page.module.css';

export default function AttendancePage() {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Attendance Handling</h1>
                    <p className={styles.pageSubtitle}>
                        Mark and manage daily attendance — Present, Absent, Half Day, Short Leave, No Pay.
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <AttendanceGrid />
            </div>
        </div>
    );
}
