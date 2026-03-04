'use client';

import React, { useState, useMemo } from 'react';
import {
    ChevronLeft, ChevronRight, Save, Download, Upload,
    Clock, LayoutGrid, ArrowLeft, FilePen, Search, X, CheckCircle2,
    Calendar
} from 'lucide-react';
import AttendanceUploadModal from './AttendanceUploadModal';
import Button from '@/components/ui/Button';
import styles from './AttendanceGrid.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type AttStatus = 'P' | 'A' | 'H' | 'SL' | 'NP' | 'L' | 'PH' | '';
type ViewMode = 'status' | 'inout';
type TimeEntry = { in: string; out: string; duration: string } | null;

const STATUS_CONFIG: Record<AttStatus, { label: string; color: string; bg: string }> = {
    P: { label: 'Present', color: '#10B981', bg: '#D1FAE5' },
    A: { label: 'Absent', color: '#EF4444', bg: '#FEE2E2' },
    H: { label: 'Half Day', color: '#F59E0B', bg: '#FEF3C7' },
    SL: { label: 'Short Leave', color: '#8B5CF6', bg: '#EDE9FE' },
    NP: { label: 'No Pay', color: '#6B7280', bg: '#F3F4F6' },
    L: { label: 'On Leave', color: '#3B82F6', bg: '#DBEAFE' },
    PH: { label: 'Public Hol.', color: '#EC4899', bg: '#FCE7F3' },
    '': { label: '—', color: '#D1D5DB', bg: 'transparent' },
};

const STATUS_OPTIONS: AttStatus[] = ['P', 'A', 'H', 'SL', 'NP', 'L', 'PH'];

/* ─── Employees ─────────────────────────────────────────── */
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

/* ─── Date helpers ───────────────────────────────────────── */
const TODAY = new Date('2026-02-19');
const YEAR = TODAY.getFullYear();
const MONTH = TODAY.getMonth();
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getDow = (y: number, m: number, d: number) => new Date(y, m, d).getDay();

/* ─── Seed attendance ────────────────────────────────────── */
function seedAttendance(): Record<string, Record<number, AttStatus>> {
    const out: Record<string, Record<number, AttStatus>> = {};
    const days = getDaysInMonth(YEAR, MONTH);
    for (const emp of EMPLOYEES) {
        out[emp.id] = {};
        for (let d = 1; d <= days; d++) {
            const dow = getDow(YEAR, MONTH, d);
            const dt = new Date(YEAR, MONTH, d);
            if (dt > TODAY) { out[emp.id][d] = ''; continue; }
            if (dow === 0 || dow === 6) { out[emp.id][d] = 'PH'; continue; }
            const r = Math.random();
            if (r < 0.01) out[emp.id][d] = 'A';
            else if (r < 0.04) out[emp.id][d] = 'H';
            else if (r < 0.06) out[emp.id][d] = 'L';
            else if (r < 0.07) out[emp.id][d] = 'SL';
            else out[emp.id][d] = 'P';
        }
        if (emp.id === 'BT-003') { out[emp.id][19] = 'A'; out[emp.id][20] = 'A'; }
        if (emp.id === 'BT-004') { out[emp.id][19] = 'L'; }
    }
    /* ─ Demo: a few employees worked Saturdays (Double OT) & Sundays (Triple OT) ─ */
    // Feb 2026: Sat=7,14; Sun=1,8,15
    out['BT-001'][7] = 'P'; // Kasun worked Sat 7 Feb  → Double OT
    out['BT-001'][15] = 'P'; // Kasun worked Sat 15 Feb → Double OT
    out['BT-005'][14] = 'P'; // Ruwan worked Sat 14 Feb → Double OT
    out['BT-003'][8] = 'P'; // Ajith worked Sun 8 Feb  → Triple OT
    out['BT-006'][15] = 'P'; // Sandya worked Sat 15 Feb → Double OT
    return out;
}

/* ─── Generate clock times ───────────────────────────────── */
function padTime(h: number, m: number) { return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }
function calcDuration(inT: string, outT: string): string {
    const [ih, im] = inT.split(':').map(Number);
    const [oh, om] = outT.split(':').map(Number);
    const mins = (oh * 60 + om) - (ih * 60 + im);
    if (mins <= 0) return '—';
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}
/* ─── OT calculator ─────────────────────────────────────── */
type OTResult = {
    ot: string; doubleOt: string; tripleOt: string;
    otMins: number; doubleOtMins: number; tripleOtMins: number;
};

function calcOT(entry: TimeEntry | null, dow: number): OTResult {
    const none = { ot: '—', doubleOt: '—', tripleOt: '—', otMins: 0, doubleOtMins: 0, tripleOtMins: 0 };
    if (!entry) return none;
    const [ih, im] = entry.in.split(':').map(Number);
    const [oh, om] = entry.out.split(':').map(Number);
    const totalMins = (oh * 60 + om) - (ih * 60 + im);
    if (totalMins <= 0) return none;
    const fmt = (m: number) => m > 0 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : '—';
    if (dow === 0) { // Sunday → Triple OT
        return { ...none, tripleOt: fmt(totalMins), tripleOtMins: totalMins };
    } else if (dow === 6) { // Saturday → Double OT
        return { ...none, doubleOt: fmt(totalMins), doubleOtMins: totalMins };
    } else { // Weekday → OT after 8 h
        const otMins = Math.max(0, totalMins - 480);
        return { ...none, ot: fmt(otMins), otMins };
    }
}

function seedTimes(
    attendance: Record<string, Record<number, AttStatus>>,
    year: number, month: number
): Record<string, Record<number, TimeEntry>> {
    const out: Record<string, Record<number, TimeEntry>> = {};
    /* Normalise raw minute value so times are always valid (no :74 etc.) */
    const normTime = (baseH: number, rawM: number) => {
        const h = baseH + Math.floor(rawM / 60);
        const m = rawM % 60;
        return padTime(h, m);
    };
    const rnd = (range: number) => Math.floor(Math.random() * range);
    for (const emp of EMPLOYEES) {
        out[emp.id] = {};
        const days = getDaysInMonth(year, month);
        for (let d = 1; d <= days; d++) {
            const st = attendance[emp.id]?.[d] ?? '';
            const dow = getDow(year, month, d);
            if (st === 'P') {
                const inS = normTime(7, 30 + rnd(40));          // 07:30–08:09
                const outS = normTime(16, 30 + rnd(120));         // 16:30–18:29  (lots of OT variation)
                // Saturdays/Sundays: shorter shift typical
                const satSunIn = normTime(7, 45 + rnd(30));     // 07:45–08:14
                const satSunOut = normTime(12, 30 + rnd(120));   // 12:30–14:29
                if (dow === 6 || dow === 0) {
                    out[emp.id][d] = { in: satSunIn, out: satSunOut, duration: calcDuration(satSunIn, satSunOut) };
                } else {
                    out[emp.id][d] = { in: inS, out: outS, duration: calcDuration(inS, outS) };
                }
            } else if (st === 'H') {
                const inS = normTime(8, rnd(20));
                const outS = normTime(12, 30 + rnd(30));
                out[emp.id][d] = { in: inS, out: outS, duration: calcDuration(inS, outS) };
            } else if (st === 'SL') {
                const inS = normTime(8, rnd(20));
                const outS = normTime(15, rnd(30));
                out[emp.id][d] = { in: inS, out: outS, duration: calcDuration(inS, outS) };
            } else {
                out[emp.id][d] = null;
            }
        }
    }
    return out;
}

/* ─── Adjustment Modal type ──────────────────────────────── */
type AdjState = {
    query: string;
    empId: string;
    year: number;
    month: number;
    day: number;
    status: AttStatus;
    timeIn: string;
    timeOut: string;
    note: string;
};
const EMPTY_ADJ: AdjState = { query: '', empId: '', year: YEAR, month: MONTH, day: 1, status: 'P', timeIn: '08:00', timeOut: '17:00', note: '' };

const ADJUST_STATUS_OPTIONS: AttStatus[] = ['P', 'A', 'H', 'NP', 'L', 'SL'];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function AttendanceGrid() {
    const [viewYear, setViewYear] = useState(YEAR);
    const [viewMonth, setViewMonth] = useState(MONTH);
    const [attendance, setAttendance] = useState(seedAttendance);
    const [filterDept, setFilterDept] = useState('All');
    const [saving, setSaving] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('status');
    const [selectedEmp, setSelectedEmp] = useState<typeof EMPLOYEES[0] | null>(null);
    const [showAdj, setShowAdj] = useState(false);
    const [adj, setAdj] = useState<AdjState>(EMPTY_ADJ);
    const [adjDone, setAdjDone] = useState(false);
    const [showCal, setShowCal] = useState(false);

    /* Override times — tracks manual adjustments */
    const [timeOverrides, setTimeOverrides] = useState<Record<string, Record<number, TimeEntry>>>({});

    const seedTimesData = useMemo(
        () => seedTimes(attendance, viewYear, viewMonth),
        [attendance, viewYear, viewMonth]
    );

    const getTime = (empId: string, day: number): TimeEntry =>
        timeOverrides[empId]?.[day] !== undefined
            ? timeOverrides[empId][day]
            : seedTimesData[empId]?.[day] ?? null;

    const days = getDaysInMonth(viewYear, viewMonth);
    const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);
    const depts = ['All', ...Array.from(new Set(EMPLOYEES.map(e => e.dept)))];
    const visibleEmps = filterDept === 'All' ? EMPLOYEES : EMPLOYEES.filter(e => e.dept === filterDept);

    const prevMonth = () => setViewMonth(m => { if (m === 0) { setViewYear(y => y - 1); return 11; } return m - 1; });
    const nextMonth = () => setViewMonth(m => { if (m === 11) { setViewYear(y => y + 1); return 0; } return m + 1; });

    const getSummary = (empId: string) => {
        const vals = Object.values(attendance[empId] || {}) as AttStatus[];
        const days = getDaysInMonth(viewYear, viewMonth);
        let otMins = 0, doubleOtMins = 0, tripleOtMins = 0;
        for (let d = 1; d <= days; d++) {
            const entry = getTime(empId, d);
            const dow = getDow(viewYear, viewMonth, d);
            const res = calcOT(entry, dow);
            otMins += res.otMins;
            doubleOtMins += res.doubleOtMins;
            tripleOtMins += res.tripleOtMins;
        }
        const fmtH = (m: number) => m > 0 ? `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m` : '0h';
        return {
            P: vals.filter(v => v === 'P').length,
            A: vals.filter(v => v === 'A').length,
            H: vals.filter(v => v === 'H').length,
            L: vals.filter(v => v === 'L').length,
            OT: fmtH(otMins),
            doubleOT: fmtH(doubleOtMins),
            tripleOT: fmtH(tripleOtMins),
        };
    };

    const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 900)); setSaving(false); };

    /* Adjustment modal helpers */
    const adjEmpResults = adj.query.trim()
        ? EMPLOYEES.filter(e =>
            e.name.toLowerCase().includes(adj.query.toLowerCase()) ||
            e.id.toLowerCase().includes(adj.query.toLowerCase()))
        : EMPLOYEES;

    const selectedAdjEmp = EMPLOYEES.find(e => e.id === adj.empId);

    const needsTimes = ['P', 'H', 'SL'].includes(adj.status);

    const applyAdjustment = () => {
        if (!adj.empId || !adj.status) return;

        /* Update attendance status */
        setAttendance(prev => ({
            ...prev,
            [adj.empId]: { ...(prev[adj.empId] || {}), [adj.day]: adj.status },
        }));

        /* Update time override */
        if (needsTimes && adj.timeIn && adj.timeOut) {
            const dur = calcDuration(adj.timeIn, adj.timeOut);
            setTimeOverrides(prev => ({
                ...prev,
                [adj.empId]: {
                    ...(prev[adj.empId] || {}),
                    [adj.day]: { in: adj.timeIn, out: adj.timeOut, duration: dur },
                },
            }));
        } else {
            setTimeOverrides(prev => ({
                ...prev,
                [adj.empId]: { ...(prev[adj.empId] || {}), [adj.day]: null },
            }));
        }

        setAdjDone(true);
        setTimeout(() => {
            setAdjDone(false);
            setShowAdj(false);
            setAdj(EMPTY_ADJ);
            setShowCal(false);
        }, 1400);
    };

    /* ────────────────────────────────────────────────────────
       Individual Employee Time Card View
    ──────────────────────────────────────────────────────── */
    if (selectedEmp) {
        const empAtt = attendance[selectedEmp.id] || {};
        const summary = getSummary(selectedEmp.id);

        return (
            <div className={styles.root}>
                <div className={styles.tcHeader}>
                    <button className={styles.tcBackBtn} onClick={() => setSelectedEmp(null)}>
                        <ArrowLeft size={16} /><span>Back to Attendance Grid</span>
                    </button>
                    <div className={styles.tcEmpInfo}>
                        <div className={styles.tcAvatar}>{selectedEmp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                        <div>
                            <span className={styles.tcEmpName}>{selectedEmp.name}</span>
                            <span className={styles.tcEmpDept}>{selectedEmp.dept} · {selectedEmp.id}</span>
                        </div>
                    </div>
                    <span className={styles.tcMonthBadge}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                </div>

                <div className={styles.tcSummaryRow}>
                    {[
                        { label: 'Present', value: summary.P, color: '#10B981' },
                        { label: 'Absent', value: summary.A, color: '#EF4444' },
                        { label: 'Half Day', value: summary.H, color: '#F59E0B' },
                        { label: 'Leave', value: summary.L, color: '#3B82F6' },
                        { label: 'OT Hrs', value: summary.OT, color: '#8B5CF6', small: true },
                        { label: '2× OT (Sat)', value: summary.doubleOT, color: '#F97316', small: true },
                        { label: '3× OT (Sun)', value: summary.tripleOT, color: '#EC4899', small: true },
                    ].map(s => (
                        <div key={s.label} className={`${styles.tcSumCard} ${(s as { small?: boolean }).small ? styles.tcSumCardWide : ''}`}>
                            <span className={styles.tcSumNum} style={{ color: s.color, fontSize: (s as { small?: boolean }).small ? '16px' : undefined }}>{s.value}</span>
                            <span className={styles.tcSumLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.gridWrap}>
                    <table className={styles.tcTable}>
                        <thead>
                            <tr>
                                <th className={styles.tcTh}>Date</th>
                                <th className={styles.tcTh}>Day</th>
                                <th className={styles.tcTh}>Status</th>
                                <th className={styles.tcTh}>Clock In</th>
                                <th className={styles.tcTh}>Clock Out</th>
                                <th className={styles.tcTh}>Duration</th>
                                <th className={styles.tcTh} style={{ color: '#8B5CF6' }}>OT (after 8h)</th>
                                <th className={styles.tcTh} style={{ color: '#F97316' }}>2× OT (Sat)</th>
                                <th className={styles.tcTh} style={{ color: '#EC4899' }}>3× OT (Sun)</th>
                                <th className={styles.tcTh}>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dayNumbers.map(d => {
                                const dow = getDow(viewYear, viewMonth, d);
                                const status = (empAtt[d] ?? '') as AttStatus;
                                const cfg = STATUS_CONFIG[status];
                                const entry = getTime(selectedEmp.id, d);
                                const ot = calcOT(entry, dow);
                                const isWknd = dow === 0 || dow === 6;
                                const isFuture = new Date(viewYear, viewMonth, d) > TODAY;
                                const dateStr = `${String(d).padStart(2, '0')} ${MONTH_NAMES[viewMonth].slice(0, 3)}`;
                                return (
                                    <tr key={d} className={`${styles.tcRow} ${isWknd ? styles.tcWeekendRow : ''} ${isFuture ? styles.tcFutureRow : ''}`}>
                                        <td className={styles.tcTd} style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{dateStr}</td>
                                        <td className={styles.tcTd} style={{ color: dow === 0 ? '#EC4899' : dow === 6 ? '#F97316' : 'var(--color-text-muted)', fontWeight: isWknd ? 700 : 400 }}>{DAY_NAMES[dow]}</td>
                                        <td className={styles.tcTd}>
                                            {status
                                                ? <span className={styles.statusChip} style={{ background: cfg.bg, color: cfg.color }}>{status}</span>
                                                : <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>—</span>}
                                        </td>
                                        <td className={styles.tcTimeTd}>{entry ? <span className={styles.tcTime}>{entry.in}</span> : <span className={styles.tcDash}>—</span>}</td>
                                        <td className={styles.tcTimeTd}>{entry ? <span className={styles.tcTime}>{entry.out}</span> : <span className={styles.tcDash}>—</span>}</td>
                                        <td className={styles.tcTimeTd}>{entry ? <span className={styles.tcDuration}>{entry.duration}</span> : <span className={styles.tcDash}>—</span>}</td>
                                        {/* OT — weekdays only */}
                                        <td className={styles.tcTimeTd}>
                                            {ot.otMins > 0
                                                ? <span className={styles.tcOt}>{ot.ot}</span>
                                                : <span className={styles.tcDash}>—</span>}
                                        </td>
                                        {/* Double OT — Saturdays */}
                                        <td className={styles.tcTimeTd}>
                                            {ot.doubleOtMins > 0
                                                ? <span className={styles.tcDoubleOt}>{ot.doubleOt}</span>
                                                : <span className={styles.tcDash}>—</span>}
                                        </td>
                                        {/* Triple OT — Sundays */}
                                        <td className={styles.tcTimeTd}>
                                            {ot.tripleOtMins > 0
                                                ? <span className={styles.tcTripleOt}>{ot.tripleOt}</span>
                                                : <span className={styles.tcDash}>—</span>}
                                        </td>
                                        <td className={styles.tcTd} style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                            {dow === 6 && entry ? '2× OT Rate (Sat)' : dow === 0 && entry ? '3× OT Rate (Sun)' : isWknd ? 'Weekend / Public Hol.' : isFuture ? 'Upcoming' : cfg.label === '—' ? '' : cfg.label}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    /* ────────────────────────────────────────────────────────
       Main Grid
    ──────────────────────────────────────────────────────── */
    return (
        <>
            <div className={styles.root}>

                {/* ── Header ── */}
                <div className={styles.header}>
                    <div className={styles.monthNav}>
                        <button className={styles.navBtn} onClick={prevMonth}><ChevronLeft size={18} /></button>
                        <span className={styles.monthLabel}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                        <button className={styles.navBtn} onClick={nextMonth}><ChevronRight size={18} /></button>
                    </div>
                    <div className={styles.headerRight}>
                        {/* View mode toggle */}
                        <div className={styles.modeTabs}>
                            <button className={`${styles.modeTab} ${viewMode === 'status' ? styles.modeTabActive : ''}`} onClick={() => setViewMode('status')}>
                                <LayoutGrid size={13} /> Status
                            </button>
                            <button className={`${styles.modeTab} ${viewMode === 'inout' ? styles.modeTabActive : ''}`} onClick={() => setViewMode('inout')}>
                                <Clock size={13} /> In / Out
                            </button>
                        </div>
                        <select className={styles.filterSel} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
                            {depts.map(d => <option key={d}>{d}</option>)}
                        </select>
                        {/* ★ Attendance Adjustment button */}
                        <Button variant="secondary" size="sm" icon={<FilePen size={15} />} onClick={() => { setAdj({ ...EMPTY_ADJ, year: viewYear, month: viewMonth }); setShowCal(false); setShowAdj(true); }}>
                            Attendance Adjustment
                        </Button>
                        <Button variant="secondary" size="sm" icon={<Upload size={15} />} onClick={() => setShowUpload(true)}>Import Scanner Data</Button>
                        <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export</Button>
                        <Button variant="primary" size="sm" icon={<Save size={15} />} loading={saving} onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>

                {/* ── Legend ── */}
                <div className={styles.legend}>
                    {viewMode === 'status' && (Object.entries(STATUS_CONFIG) as [AttStatus, typeof STATUS_CONFIG[AttStatus]][])
                        .filter(([k]) => k !== '')
                        .map(([key, cfg]) => (
                            <span key={key} className={styles.legendItem}>
                                <span className={styles.legendDot} style={{ background: cfg.color }} />
                                {key} – {cfg.label}
                            </span>
                        ))
                    }
                    {viewMode === 'inout' && (
                        <>
                            <Clock size={12} style={{ color: 'var(--color-primary)' }} />
                            <span style={{ color: 'var(--color-text-secondary)' }}>Showing clock-in / clock-out times per day</span>
                        </>
                    )}
                    <span className={styles.legendHint}>
                        Read-only · Use <strong>Attendance Adjustment</strong> to edit · Click employee name for time card
                    </span>
                </div>

                {/* ── Grid ── */}
                <div className={styles.gridWrap}>
                    <table className={styles.grid}>
                        <thead>
                            <tr>
                                <th className={styles.empCol}>Employee</th>
                                {dayNumbers.map(d => {
                                    const dow = getDow(viewYear, viewMonth, d);
                                    const isWknd = dow === 0 || dow === 6;
                                    return (
                                        <th key={d} className={`${styles.dayCol} ${isWknd ? styles.weekendCol : ''} ${viewMode === 'inout' ? styles.inoutDayCol : ''}`}>
                                            <span className={styles.dayNum}>{d}</span>
                                            <span className={styles.dayName}>{DAY_SHORT[dow]}</span>
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
                                            <button className={styles.empNameBtn} onClick={() => setSelectedEmp(emp)}>{emp.name}</button>
                                            <span className={styles.empDept}>{emp.dept}</span>
                                        </td>
                                        {dayNumbers.map(d => {
                                            const status = (attendance[emp.id]?.[d] ?? '') as AttStatus;
                                            const cfg = STATUS_CONFIG[status];
                                            const dow = getDow(viewYear, viewMonth, d);
                                            const isWknd = dow === 0 || dow === 6;
                                            const isFuture = new Date(viewYear, viewMonth, d) > TODAY;
                                            const entry = getTime(emp.id, d);

                                            if (viewMode === 'inout') {
                                                return (
                                                    <td key={d} className={`${styles.inoutCell} ${isWknd ? styles.weekendCell : ''} ${isFuture ? styles.futureCell : ''}`}>
                                                        {entry ? (
                                                            <>
                                                                <span className={styles.inoutIn}>{entry.in}</span>
                                                                <span className={styles.inoutOut}>{entry.out}</span>
                                                            </>
                                                        ) : status ? (
                                                            <span className={styles.inoutStatus} style={{ color: cfg.color }}>{status}</span>
                                                        ) : (
                                                            <span className={styles.inoutDash}>—</span>
                                                        )}
                                                    </td>
                                                );
                                            }

                                            /* Status mode — read-only, no click */
                                            return (
                                                <td key={d} className={`${styles.cell} ${styles.cellReadOnly} ${isWknd ? styles.weekendCell : ''} ${isFuture ? styles.futureCell : ''}`} title={cfg.label}>
                                                    {status && (
                                                        <span className={styles.statusChip} style={{ background: cfg.bg, color: cfg.color }}>
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

            {/* ── Import modal ── */}
            {showUpload && <AttendanceUploadModal onClose={() => setShowUpload(false)} />}

            {/* ══════════════════════════════════════════════════
                ATTENDANCE ADJUSTMENT MODAL
                ══════════════════════════════════════════════════ */}
            {showAdj && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
                    onClick={e => { if (e.target === e.currentTarget) { setShowAdj(false); setAdj(EMPTY_ADJ); setShowCal(false); } }}
                >
                    <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: '16px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.35)', overflow: 'hidden' }}>

                        {/* Modal header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0' }}>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Attendance Adjustment</h2>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '3px' }}>Search an employee, select date and status, then apply.</p>
                            </div>
                            <button onClick={() => { setShowAdj(false); setAdj(EMPTY_ADJ); setShowCal(false); }} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

                            {/* Employee search */}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                                    Employee <span style={{ color: 'var(--color-danger)' }}>*</span>
                                </label>
                                <div style={{ position: 'relative', marginBottom: '8px' }}>
                                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or employee ID…"
                                        value={adj.query}
                                        onChange={e => setAdj(a => ({ ...a, query: e.target.value, empId: '' }))}
                                        style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-family)', outline: 'none' }}
                                    />
                                </div>
                                {/* Employee list */}
                                <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-main-bg)' }}>
                                    {adjEmpResults.map(e => (
                                        <button
                                            key={e.id}
                                            onClick={() => setAdj(a => ({ ...a, empId: e.id }))}
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '9px 12px', border: 'none', background: adj.empId === e.id ? 'var(--color-primary)' : 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--color-border-light)', fontFamily: 'var(--font-family)', transition: 'background 0.15s' }}
                                        >
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: adj.empId === e.id ? 'rgba(255,255,255,0.2)' : 'var(--color-primary-light)', color: adj.empId === e.id ? '#fff' : 'var(--color-primary)', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textTransform: 'uppercase' }}>
                                                {e.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: adj.empId === e.id ? '#fff' : 'var(--color-text-primary)' }}>{e.name}</span>
                                                <span style={{ display: 'block', fontSize: '11px', color: adj.empId === e.id ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)' }}>{e.id} · {e.dept}</span>
                                            </div>
                                        </button>
                                    ))}
                                    {adjEmpResults.length === 0 && (
                                        <div style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-muted)' }}>No employees found</div>
                                    )}
                                </div>
                            </div>

                            {/* Date & Status */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Date <span style={{ color: 'var(--color-danger)' }}>*</span></span>
                                    {/* Date Select Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowCal(c => !c)}
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-family)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.15s' }}
                                    >
                                        <span>{MONTH_NAMES[adj.month]} {adj.day}, {adj.year}</span>
                                        <Calendar size={14} color="var(--color-text-muted)" />
                                    </button>

                                    {/* Calendar Popover */}
                                    {showCal && (
                                        <>
                                            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowCal(false)} />
                                            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 20, width: '260px', background: 'var(--color-main-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '14px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
                                                <select
                                                    value={adj.month}
                                                    onChange={e => {
                                                        const m = Number(e.target.value);
                                                        const d = Math.min(adj.day, getDaysInMonth(adj.year, m));
                                                        setAdj(a => ({ ...a, month: m, day: d }));
                                                    }}
                                                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '12px', fontFamily: 'var(--font-family)', outline: 'none', marginBottom: '10px' }}
                                                >
                                                    {MONTH_NAMES.map((name, i) => <option key={i} value={i}>{name} {adj.year}</option>)}
                                                </select>

                                                <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-card-bg)' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px' }}>
                                                        {DAY_SHORT.map(ds => <div key={ds} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)' }}>{ds}</div>)}
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                                        {Array.from({ length: 42 }).map((_, i) => {
                                                            const firstDow = getDow(adj.year, adj.month, 1);
                                                            const d = i - firstDow + 1;
                                                            const isVal = d > 0 && d <= getDaysInMonth(adj.year, adj.month);
                                                            const isSel = isVal && d === adj.day;
                                                            return (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => {
                                                                        if (isVal) {
                                                                            setAdj(a => ({ ...a, day: d }));
                                                                            setShowCal(false);
                                                                        }
                                                                    }}
                                                                    disabled={!isVal}
                                                                    style={{
                                                                        height: '26px', width: '100%', border: 'none', borderRadius: '4px',
                                                                        background: isSel ? 'var(--color-primary)' : isVal ? 'var(--color-main-bg)' : 'transparent',
                                                                        color: isSel ? '#fff' : 'var(--color-text-primary)',
                                                                        fontSize: '11px', fontWeight: isSel ? 700 : 500,
                                                                        cursor: isVal ? 'pointer' : 'default',
                                                                        visibility: isVal ? 'visible' : 'hidden',
                                                                        transition: 'all 0.1s'
                                                                    }}
                                                                >
                                                                    {isVal ? d : ''}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                        {DAY_NAMES[getDow(adj.year, adj.month, adj.day)]}
                                    </span>
                                </div>
                                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Attendance Status <span style={{ color: 'var(--color-danger)' }}>*</span></span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {ADJUST_STATUS_OPTIONS.map(s => {
                                            const cfg = STATUS_CONFIG[s];
                                            const active = adj.status === s;
                                            return (
                                                <button key={s} onClick={() => setAdj(a => ({ ...a, status: s }))}
                                                    style={{ padding: '4px 10px', borderRadius: '6px', border: `1.5px solid ${active ? cfg.color : 'var(--color-border)'}`, background: active ? cfg.bg : 'none', color: active ? cfg.color : 'var(--color-text-secondary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-family)', transition: 'all 0.15s' }}>
                                                    {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {adj.status && <span style={{ fontSize: '11px', color: STATUS_CONFIG[adj.status].color, fontWeight: 600 }}>{STATUS_CONFIG[adj.status].label}</span>}
                                </label>
                            </div>

                            {/* In / Out time — only for timed statuses */}
                            {needsTimes && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>Clock In</span>
                                        <input
                                            type="time" value={adj.timeIn}
                                            onChange={e => setAdj(a => ({ ...a, timeIn: e.target.value }))}
                                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'monospace', outline: 'none' }}
                                        />
                                    </label>
                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444' }}>Clock Out</span>
                                        <input
                                            type="time" value={adj.timeOut}
                                            onChange={e => setAdj(a => ({ ...a, timeOut: e.target.value }))}
                                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'monospace', outline: 'none' }}
                                        />
                                    </label>
                                    {adj.timeIn && adj.timeOut && (
                                        <div style={{ gridColumn: '1/-1', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                            Duration: <strong style={{ color: 'var(--color-text-primary)' }}>{calcDuration(adj.timeIn, adj.timeOut)}</strong>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Note */}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Reason / Note</span>
                                <input
                                    type="text" value={adj.note} placeholder="e.g. Scanner malfunction, manual card entry…"
                                    onChange={e => setAdj(a => ({ ...a, note: e.target.value }))}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-family)', outline: 'none' }}
                                />
                            </label>
                        </div>

                        {/* Modal footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid var(--color-border)', background: 'var(--color-main-bg)' }}>
                            {adjDone
                                ? <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--color-success)' }}><CheckCircle2 size={16} /> Adjustment applied!</span>
                                : <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                    {selectedAdjEmp ? `→ ${selectedAdjEmp.name}` : 'Select an employee above'}
                                </span>
                            }
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button variant="ghost" size="sm" onClick={() => { setShowAdj(false); setAdj(EMPTY_ADJ); }}>Cancel</Button>
                                <Button
                                    variant="primary" size="sm" icon={<FilePen size={14} />}
                                    onClick={applyAdjustment}
                                    disabled={!adj.empId || !adj.status || adjDone}
                                >
                                    Apply Adjustment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
