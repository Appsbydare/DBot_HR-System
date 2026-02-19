'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Download, Upload } from 'lucide-react';
import AttendanceUploadModal from './AttendanceUploadModal';
import Button from '@/components/ui/Button';
import styles from './AttendanceGrid.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type AttStatus = 'P' | 'A' | 'H' | 'SL' | 'NP' | 'L' | 'PH' | '';

const STATUS_CONFIG: Record<AttStatus, { label: string; color: string; bg: string }> = {
    P: { label: 'Present', color: '#10B981', bg: '#D1FAE5' },
    A: { label: 'Absent', color: '#EF4444', bg: '#FEE2E2' },
    H: { label: 'Half Day', color: '#F59E0B', bg: '#FEF3C7' },
    SL: { label: 'Short Leave', color: '#8B5CF6', bg: '#EDE9FE' },
    NP: { label: 'No Pay', color: '#6B7280', bg: '#F3F4F6' },
    L: { label: 'On Leave', color: '#3B82F6', bg: '#DBEAFE' },
    PH: { label: 'Public Hol.', color: '#EC4899', bg: '#FCE7F3' },
    '': { label: '-', color: '#D1D5DB', bg: 'transparent' },
};

/* ─── Mock employees ─────────────────────────────────────── */
const EMPLOYEES = [
    { id: 'BT-001', name: 'Kasun Perera', dept: 'IT' },
    { id: 'BT-002', name: 'Chamari Atapattu', dept: 'Finance' },
    { id: 'BT-003', name: 'Ajith Bandara', dept: 'Production' },
    { id: 'BT-004', name: 'Nimali Jayawardene', dept: 'HR' },
    { id: 'BT-005', name: 'Ruwan Fernando', dept: 'Production' },
    { id: 'BT-006', name: 'Sandya Kumari', dept: 'Admin' },
    { id: 'BT-007', name: 'Pradeep Silva', dept: 'Production' },
    { id: 'BT-008', name: 'Gayani Alwis', dept: 'HR' },
];

/* ─── Seed initial attendance data ──────────────────────── */
const TODAY = new Date('2026-02-19');
const YEAR = TODAY.getFullYear();
const MONTH = TODAY.getMonth(); // 0-indexed = January=0

const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getDayOfWeek = (y: number, m: number, d: number) => new Date(y, m, d).getDay(); // 0=Sun

function seedAttendance(): Record<string, Record<number, AttStatus>> {
    const out: Record<string, Record<number, AttStatus>> = {};
    const days = getDaysInMonth(YEAR, MONTH);
    for (const emp of EMPLOYEES) {
        out[emp.id] = {};
        for (let d = 1; d <= days; d++) {
            const dow = getDayOfWeek(YEAR, MONTH, d);
            const dt = new Date(YEAR, MONTH, d);
            if (dow === 0 || dow === 6) { out[emp.id][d] = 'PH'; continue; }  // weekend
            if (dt > TODAY) { out[emp.id][d] = ''; continue; }                 // future
            // Random realistic distribution
            const r = Math.random();
            if (r < 0.01) out[emp.id][d] = 'A';
            else if (r < 0.04) out[emp.id][d] = 'H';
            else if (r < 0.06) out[emp.id][d] = 'L';
            else if (r < 0.07) out[emp.id][d] = 'SL';
            else out[emp.id][d] = 'P';
        }
        // Specific overrides for realism
        if (emp.id === 'BT-003') { out[emp.id][19] = 'A'; out[emp.id][20] = 'A'; }
        if (emp.id === 'BT-004') { out[emp.id][19] = 'L'; }
    }
    return out;
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const STATUS_CYCLE: AttStatus[] = ['P', 'A', 'H', 'SL', 'NP', 'L', 'PH', ''];

export default function AttendanceGrid() {
    const [viewYear, setViewYear] = useState(YEAR);
    const [viewMonth, setViewMonth] = useState(MONTH);
    const [attendance, setAttendance] = useState(seedAttendance);
    const [filterDept, setFilterDept] = useState('All');
    const [saving, setSaving] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    const days = getDaysInMonth(viewYear, viewMonth);
    const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);
    const depts = ['All', ...Array.from(new Set(EMPLOYEES.map(e => e.dept)))];

    const visibleEmps = filterDept === 'All'
        ? EMPLOYEES
        : EMPLOYEES.filter(e => e.dept === filterDept);

    const prevMonth = () => {
        setViewMonth(m => { if (m === 0) { setViewYear(y => y - 1); return 11; } return m - 1; });
    };
    const nextMonth = () => {
        setViewMonth(m => { if (m === 11) { setViewYear(y => y + 1); return 0; } return m + 1; });
    };

    /* Cycle through statuses on click */
    const cycleStatus = (empId: string, day: number) => {
        const cur = attendance[empId]?.[day] ?? '';
        const idx = STATUS_CYCLE.indexOf(cur);
        const nxt = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
        setAttendance(prev => ({
            ...prev,
            [empId]: { ...(prev[empId] || {}), [day]: nxt },
        }));
    };

    /* Summary totals per employee */
    const getSummary = (empId: string) => {
        const rec = attendance[empId] || {};
        const vals = Object.values(rec) as AttStatus[];
        return {
            P: vals.filter(v => v === 'P').length,
            A: vals.filter(v => v === 'A').length,
            H: vals.filter(v => v === 'H').length,
            L: vals.filter(v => v === 'L').length,
        };
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
    };

    return (
        <>
            <div className={styles.root}>

                {/* ── Header ── */}
                <div className={styles.header}>
                    <div className={styles.monthNav}>
                        <button id="att-prev-month" className={styles.navBtn} onClick={prevMonth}><ChevronLeft size={18} /></button>
                        <span className={styles.monthLabel}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                        <button id="att-next-month" className={styles.navBtn} onClick={nextMonth}><ChevronRight size={18} /></button>
                    </div>
                    <div className={styles.headerRight}>
                        <select id="att-dept-filter" className={styles.filterSel} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                            {depts.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <Button id="att-import-btn" variant="secondary" size="sm" icon={<Upload size={15} />} onClick={() => setShowUpload(true)}>Import Scanner Data</Button>
                        <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export</Button>
                        <Button variant="primary" size="sm" icon={<Save size={15} />} loading={saving} onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>

                {/* ── Legend ── */}
                <div className={styles.legend}>
                    {(Object.entries(STATUS_CONFIG) as [AttStatus, typeof STATUS_CONFIG[AttStatus]][])
                        .filter(([k]) => k !== '')
                        .map(([key, cfg]) => (
                            <span key={key} className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ background: cfg.color }} />
                                {key} – {cfg.label}
                            </span>
                        ))
                    }
                    <span className={styles.legendHint}>Click a cell to cycle status</span>
                </div>

                {/* ── Grid ── */}
                <div className={styles.gridWrap}>
                    <table className={styles.grid}>
                        <thead>
                            <tr>
                                <th className={styles.empCol}>Employee</th>
                                {dayNumbers.map(d => {
                                    const dow = getDayOfWeek(viewYear, viewMonth, d);
                                    const isWknd = dow === 0 || dow === 6;
                                    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                                    return (
                                        <th key={d} className={`${styles.dayCol} ${isWknd ? styles.weekendCol : ''}`}>
                                            <span className={styles.dayNum}>{d}</span>
                                            <span className={styles.dayName}>{dayNames[dow]}</span>
                                        </th>
                                    );
                                })}
                                <th className={styles.summaryCol}>P</th>
                                <th className={styles.summaryCol}>A</th>
                                <th className={styles.summaryCol}>H</th>
                                <th className={styles.summaryCol}>L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleEmps.map(emp => {
                                const summary = getSummary(emp.id);
                                return (
                                    <tr key={emp.id} className={styles.empRow}>
                                        <td className={styles.empCell}>
                                            <span className={styles.empName}>{emp.name}</span>
                                            <span className={styles.empDept}>{emp.dept}</span>
                                        </td>
                                        {dayNumbers.map(d => {
                                            const status = (attendance[emp.id]?.[d] ?? '') as AttStatus;
                                            const cfg = STATUS_CONFIG[status];
                                            const dow = getDayOfWeek(viewYear, viewMonth, d);
                                            const isWknd = dow === 0 || dow === 6;
                                            const isFuture = new Date(viewYear, viewMonth, d) > TODAY;
                                            return (
                                                <td
                                                    key={d}
                                                    className={`${styles.cell} ${isWknd ? styles.weekendCell : ''} ${isFuture ? styles.futureCell : ''}`}
                                                    onClick={() => !isWknd && !isFuture && cycleStatus(emp.id, d)}
                                                    title={cfg.label}
                                                >
                                                    {status && (
                                                        <span
                                                            className={styles.statusChip}
                                                            style={{ background: cfg.bg, color: cfg.color }}
                                                        >
                                                            {status}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className={`${styles.summaryCell} ${styles.present}`}>{summary.P}</td>
                                        <td className={`${styles.summaryCell} ${styles.absent}`}>{summary.A}</td>
                                        <td className={`${styles.summaryCell} ${styles.half}`}>{summary.H}</td>
                                        <td className={`${styles.summaryCell} ${styles.leave}`}>{summary.L}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>

            {showUpload && <AttendanceUploadModal onClose={() => setShowUpload(false)} />}
        </>
    );
}
