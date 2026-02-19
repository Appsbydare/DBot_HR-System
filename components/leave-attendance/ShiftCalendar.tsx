'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Clock, Users, Sunrise, Moon, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './ShiftCalendar.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type ShiftType = 'Day' | 'Night' | 'Rotational' | 'Off';

interface Shift {
    id: string;
    name: string;
    type: ShiftType;
    start: string;
    end: string;
    color: string;
    employees: number;
}

interface ShiftAssignment {
    empId: string;
    empName: string;
    dept: string;
    shift: ShiftType;
}

/* ─── Mock Shifts ────────────────────────────────────────── */
const SHIFTS: Shift[] = [
    { id: 'S1', name: 'Morning Shift', type: 'Day', start: '06:00', end: '14:00', color: '#F59E0B', employees: 412 },
    { id: 'S2', name: 'General Shift', type: 'Day', start: '08:00', end: '17:00', color: '#3B82F6', employees: 528 },
    { id: 'S3', name: 'Evening Shift', type: 'Day', start: '14:00', end: '22:00', color: '#8B5CF6', employees: 180 },
    { id: 'S4', name: 'Night Shift', type: 'Night', start: '22:00', end: '06:00', color: '#1E40AF', employees: 120 },
    { id: 'S5', name: 'Rotating A/B/C', type: 'Rotational', start: 'Varies', end: 'Varies', color: '#10B981', employees: 0 },
];

const ASSIGNMENTS: ShiftAssignment[] = [
    { empId: 'BT-001', empName: 'Kasun Perera', dept: 'IT', shift: 'Day' },
    { empId: 'BT-002', empName: 'Chamari Atapattu', dept: 'Finance', shift: 'Day' },
    { empId: 'BT-003', empName: 'Ajith Bandara', dept: 'Production', shift: 'Night' },
    { empId: 'BT-004', empName: 'Nimali Jayawardene', dept: 'HR', shift: 'Day' },
    { empId: 'BT-005', empName: 'Ruwan Fernando', dept: 'Production', shift: 'Rotational' },
    { empId: 'BT-006', empName: 'Sandya Kumari', dept: 'Admin', shift: 'Day' },
    { empId: 'BT-007', empName: 'Pradeep Silva', dept: 'Production', shift: 'Night' },
    { empId: 'BT-008', empName: 'Gayani Alwis', dept: 'HR', shift: 'Day' },
];

const SHIFT_ICON: Record<ShiftType, React.ReactNode> = {
    Day: <Sunrise size={14} />, Night: <Moon size={14} />,
    Rotational: <RefreshCw size={14} />, Off: <Clock size={14} />,
};
const SHIFT_VARIANT: Record<ShiftType, 'warning' | 'info' | 'success' | 'muted'> = {
    Day: 'warning', Night: 'info', Rotational: 'success', Off: 'muted',
};

/* ─── Public Holidays ────────────────────────────────────── */
const PUBLIC_HOLIDAYS = [
    { date: '2026-01-01', name: 'New Year\'s Day' },
    { date: '2026-01-14', name: 'Thai Pongal' },
    { date: '2026-02-04', name: 'Independence Day' },
    { date: '2026-03-17', name: 'Maha Sivarathri' },
    { date: '2026-04-13', name: 'Sinhala & Tamil New Year' },
    { date: '2026-04-14', name: 'Sinhala & Tamil New Year' },
    { date: '2026-05-01', name: 'Labour Day' },
    { date: '2026-05-23', name: 'Vesak Poya' },
    { date: '2026-06-30', name: 'Poson Poya' },
    { date: '2026-12-25', name: 'Christmas Day' },
];

export default function ShiftCalendar() {
    const [activeTab, setActiveTab] = useState<'shifts' | 'assignments' | 'holidays'>('shifts');

    return (
        <div className={styles.root}>

            {/* ── Tab Bar ── */}
            <div className={styles.tabBar}>
                {([['shifts', 'Shift Master'], ['assignments', 'Assignments'], ['holidays', 'Public Holidays']] as const).map(([id, label]) => (
                    <button
                        key={id}
                        id={`shift-tab-${id}`}
                        className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(id)}
                    >{label}</button>
                ))}
            </div>

            {/* ── Shift Master ── */}
            {activeTab === 'shifts' && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionCount}>{SHIFTS.length} shift types configured</span>
                        <Button variant="primary" size="sm" icon={<Plus size={15} />}>Add Shift</Button>
                    </div>
                    <div className={styles.shiftCards}>
                        {SHIFTS.map(shift => (
                            <div key={shift.id} className={styles.shiftCard} style={{ borderLeftColor: shift.color }}>
                                <div className={styles.shiftTop}>
                                    <div className={styles.shiftName}>
                                        <span className={styles.shiftDot} style={{ background: shift.color }} />
                                        {shift.name}
                                    </div>
                                    <button id={`edit-shift-${shift.id}`} className={styles.editBtn}><Edit2 size={14} /></button>
                                </div>
                                <div className={styles.shiftMeta}>
                                    <Badge variant={shift.type === 'Night' ? 'info' : shift.type === 'Rotational' ? 'success' : 'warning'}>
                                        {shift.type}
                                    </Badge>
                                    <span className={styles.shiftTime}>
                                        <Clock size={12} />
                                        {shift.start === 'Varies' ? 'Varies' : `${shift.start} – ${shift.end}`}
                                    </span>
                                    <span className={styles.shiftEmps}>
                                        <Users size={12} />
                                        {shift.employees} employees
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Assignments ── */}
            {activeTab === 'assignments' && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionCount}>{ASSIGNMENTS.length} employees assigned</span>
                        <Button variant="primary" size="sm" icon={<Plus size={15} />}>Assign Shift</Button>
                    </div>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Employee</th>
                                    <th className={styles.th}>Department</th>
                                    <th className={styles.th}>Current Shift</th>
                                    <th className={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ASSIGNMENTS.map(a => (
                                    <tr key={a.empId} className={styles.row}>
                                        <td className={styles.td}>
                                            <div className={styles.empCell}>
                                                <div className={styles.avatar}>
                                                    {a.empName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <span className={styles.empName}>{a.empName}</span>
                                                    <span className={styles.empId}>{a.empId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.td}>{a.dept}</td>
                                        <td className={styles.td}>
                                            <span className={styles.shiftBadge}>
                                                {SHIFT_ICON[a.shift]}
                                                <Badge variant={SHIFT_VARIANT[a.shift]}>{a.shift} Shift</Badge>
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <button id={`reassign-${a.empId}`} className={styles.actionBtn} title="Reassign">
                                                <Edit2 size={14} />
                                                <span>Reassign</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Public Holidays ── */}
            {activeTab === 'holidays' && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionCount}>{PUBLIC_HOLIDAYS.length} public holidays in 2026</span>
                        <Button variant="primary" size="sm" icon={<Plus size={15} />}>Add Holiday</Button>
                    </div>
                    <div className={styles.holidayList}>
                        {PUBLIC_HOLIDAYS.map((h, i) => {
                            const d = new Date(h.date);
                            const past = d < new Date();
                            return (
                                <div key={i} className={`${styles.holidayItem} ${past ? styles.holidayPast : ''}`}>
                                    <div className={styles.holidayDate}>
                                        <span className={styles.holidayMo}>{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
                                        <span className={styles.holidayDay}>{d.getDate()}</span>
                                        <span className={styles.holidayWd}>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                                    </div>
                                    <span className={styles.holidayName}>{h.name}</span>
                                    {past
                                        ? <Badge variant="muted">Past</Badge>
                                        : <Badge variant="info">Upcoming</Badge>
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
}
