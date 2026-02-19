'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './UpcomingLeaves.module.css';

const LEAVE_DATA = [
    { empNo: 'BT-002', month: 'FEB', day: '19', name: 'Chamari Atapattu', role: 'Regional Manager', duration: '2 days', type: 'Annual Leave', typeColor: 'success' },
    { empNo: 'BT-001', month: 'FEB', day: '20', name: 'Kasun Perera', role: 'Senior Engineer', duration: '3 days', type: 'Sick Leave', typeColor: 'warning' },
    { empNo: 'BT-010', month: 'FEB', day: '21', name: 'Dilani Fernando', role: 'HR Assistant', duration: '1 day', type: 'Casual Leave', typeColor: 'info' },
    { empNo: 'BT-003', month: 'FEB', day: '24', name: 'Ajith Bandara', role: 'Machinist', duration: '5 days', type: 'Annual Leave', typeColor: 'success' },
    { empNo: 'BT-004', month: 'MAR', day: '03', name: 'Nimali Jayawardene', role: 'Accounts Officer', duration: '2 days', type: 'Maternity', typeColor: 'purple' },
];

const TYPE_COLOR_MAP: Record<string, string> = {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    purple: '#8B5CF6',
};

export default function UpcomingLeaves() {
    const today = new Date(2026, 1, 19); // Feb 19, 2026
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long' });
    const firstDoW = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const leaveDays = new Set(
        LEAVE_DATA
            .filter(l => {
                const d = new Date(`${l.month} ${l.day}, 2026`);
                return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
            })
            .map(l => parseInt(l.day))
    );

    const prev = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const next = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const cells = Array.from({ length: firstDoW + daysInMonth }, (_, i) => {
        if (i < firstDoW) return null;
        return i - firstDoW + 1;
    });

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>Upcoming Leaves</h3>

            {/* Mini Calendar */}
            <div className={styles.calendar}>
                <div className={styles.calHeader}>
                    <button className={styles.calBtn} onClick={prev} aria-label="Previous month"><ChevronLeft size={14} /></button>
                    <span className={styles.calMonth}>{monthName} {viewYear}</span>
                    <button className={styles.calBtn} onClick={next} aria-label="Next month"><ChevronRight size={14} /></button>
                </div>

                <div className={styles.calGrid}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <span key={i} className={styles.calDow}>{d}</span>
                    ))}
                    {cells.map((day, i) => {
                        if (!day) return <span key={i} />;
                        const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                        const hasLeave = leaveDays.has(day);
                        return (
                            <span
                                key={i}
                                className={`${styles.calDay} ${isToday ? styles.calToday : ''} ${hasLeave ? styles.calHasLeave : ''}`}
                            >
                                {day}
                                {hasLeave && <span className={styles.calDot} />}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Leave List */}
            <div className={styles.leaveList}>
                {LEAVE_DATA.map((l, i) => (
                    <div key={i} className={styles.leaveItem}>
                        <div className={styles.leaveDate}>
                            <span className={styles.leaveMo}>{l.month}</span>
                            <span className={styles.leaveDay}>{l.day}</span>
                        </div>
                        <div className={styles.leaveInfo}>
                            <span className={styles.leaveEmpNo}>{l.empNo}</span>
                            <span className={styles.leaveName}>{l.name}</span>
                            <span className={styles.leaveRole}>{l.role} · {l.duration}</span>
                        </div>
                        <span
                            className={styles.leaveType}
                            style={{ color: TYPE_COLOR_MAP[l.typeColor], background: `${TYPE_COLOR_MAP[l.typeColor]}18` }}
                        >
                            {l.type}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
