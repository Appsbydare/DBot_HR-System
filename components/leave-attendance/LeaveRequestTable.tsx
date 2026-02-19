'use client';

import React, { useState, useMemo } from 'react';
import {
    Search, Check, X, Clock, User,
    Download, RefreshCw, CalendarPlus, FileText
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './LeaveRequestTable.module.css';

/* ─── Types ─────────────────────────────────────────────── */
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Short Leave' | 'No Pay' | 'Casual';

export interface LeaveRequest {
    id: string;
    empNo: string;
    name: string;
    dept: string;
    type: LeaveType;
    from: string;
    to: string;
    days: number;
    reason: string;
    status: LeaveStatus;
    appliedOn: string;
    approvedBy?: string;
}

/* ─── Mock Data ─────────────────────────────────────────── */
const LEAVE_DATA: LeaveRequest[] = [
    { id: '1', empNo: 'BT-001', name: 'Kasun Perera', dept: 'IT', type: 'Annual', from: '2026-02-20', to: '2026-02-21', days: 2, reason: 'Family function', status: 'Pending', appliedOn: '2026-02-18' },
    { id: '2', empNo: 'BT-002', name: 'Chamari Atapattu', dept: 'Finance', type: 'Annual', from: '2026-02-19', to: '2026-02-19', days: 1, reason: 'Personal work', status: 'Approved', appliedOn: '2026-02-17', approvedBy: 'HR Manager' },
    { id: '3', empNo: 'BT-003', name: 'Ajith Bandara', dept: 'Production', type: 'Sick', from: '2026-02-19', to: '2026-02-20', days: 2, reason: 'Medical certificate attached', status: 'Approved', appliedOn: '2026-02-19', approvedBy: 'HR Manager' },
    { id: '4', empNo: 'BT-004', name: 'Nimali Jayawardene', dept: 'HR', type: 'Maternity', from: '2026-03-03', to: '2026-06-01', days: 84, reason: 'Maternity leave', status: 'Approved', appliedOn: '2026-02-10', approvedBy: 'Director' },
    { id: '5', empNo: 'BT-005', name: 'Ruwan Fernando', dept: 'Production', type: 'Short Leave', from: '2026-02-19', to: '2026-02-19', days: 0.5, reason: 'Doctor visit', status: 'Pending', appliedOn: '2026-02-19' },
    { id: '6', empNo: 'BT-006', name: 'Sandya Kumari', dept: 'Admin', type: 'Casual', from: '2026-02-25', to: '2026-02-25', days: 1, reason: 'Personal reasons', status: 'Pending', appliedOn: '2026-02-18' },
    { id: '7', empNo: 'BT-007', name: 'Pradeep Silva', dept: 'Production', type: 'Annual', from: '2026-03-10', to: '2026-03-14', days: 5, reason: 'Holiday travel', status: 'Pending', appliedOn: '2026-02-15' },
    { id: '8', empNo: 'BT-009', name: 'Thilak Dissanayake', dept: 'Logistics', type: 'No Pay', from: '2026-02-18', to: '2026-02-18', days: 1, reason: 'Absenteeism', status: 'Approved', appliedOn: '2026-02-18', approvedBy: 'HR Manager' },
    { id: '9', empNo: 'BT-011', name: 'Nalaka Gunawardena', dept: 'IT', type: 'Annual', from: '2026-02-10', to: '2026-02-11', days: 2, reason: 'Personal', status: 'Rejected', appliedOn: '2026-02-08' },
    { id: '10', empNo: 'BT-012', name: 'Madhavi Wickrama', dept: 'Finance', type: 'Sick', from: '2026-02-17', to: '2026-02-17', days: 1, reason: 'Fever', status: 'Approved', appliedOn: '2026-02-17', approvedBy: 'HR Manager' },
];

/* ─── Leave Balance Mock ─────────────────────────────────── */
export const LEAVE_BALANCES = [
    { empNo: 'BT-001', name: 'Kasun Perera', annual: 14, sick: 7, casual: 7, annualUsed: 3, sickUsed: 0, casualUsed: 1 },
    { empNo: 'BT-002', name: 'Chamari Atapattu', annual: 14, sick: 7, casual: 7, annualUsed: 4, sickUsed: 1, casualUsed: 2 },
    { empNo: 'BT-005', name: 'Ruwan Fernando', annual: 14, sick: 7, casual: 7, annualUsed: 8, sickUsed: 3, casualUsed: 3 },
    { empNo: 'BT-006', name: 'Sandya Kumari', annual: 14, sick: 7, casual: 7, annualUsed: 2, sickUsed: 0, casualUsed: 0 },
    { empNo: 'BT-007', name: 'Pradeep Silva', annual: 14, sick: 7, casual: 7, annualUsed: 1, sickUsed: 2, casualUsed: 1 },
];

const EMPLOYEE_LIST = [
    { empNo: 'BT-001', name: 'Kasun Perera', dept: 'IT' },
    { empNo: 'BT-002', name: 'Chamari Atapattu', dept: 'Finance' },
    { empNo: 'BT-003', name: 'Ajith Bandara', dept: 'Production' },
    { empNo: 'BT-004', name: 'Nimali Jayawardene', dept: 'HR' },
    { empNo: 'BT-005', name: 'Ruwan Fernando', dept: 'Production' },
    { empNo: 'BT-006', name: 'Sandya Kumari', dept: 'Admin' },
    { empNo: 'BT-007', name: 'Pradeep Silva', dept: 'Production' },
    { empNo: 'BT-008', name: 'Gayani Alwis', dept: 'HR' },
    { empNo: 'BT-009', name: 'Thilak Dissanayake', dept: 'Logistics' },
];

/* ─── Helpers ────────────────────────────────────────────── */
const STATUS_VARIANT: Record<LeaveStatus, 'warning' | 'success' | 'danger' | 'muted'> = {
    Pending: 'warning', Approved: 'success', Rejected: 'danger', Cancelled: 'muted',
};
const TYPE_COLOR: Record<LeaveType, string> = {
    Annual: '#3B82F6', Sick: '#EF4444', Maternity: '#8B5CF6',
    'Short Leave': '#F59E0B', 'No Pay': '#6B7280', Casual: '#10B981',
};
const LEAVE_TYPES: LeaveType[] = ['Annual', 'Sick', 'Maternity', 'Short Leave', 'No Pay', 'Casual'];

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const businessDaysBetween = (from: string, to: string): number => {
    if (!from || !to) return 0;
    let count = 0;
    const cur = new Date(from);
    const end = new Date(to);
    while (cur <= end) {
        const d = cur.getDay();
        if (d !== 0 && d !== 6) count++;
        cur.setDate(cur.getDate() + 1);
    }
    return count;
};

const STATUSES: (LeaveStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];
const TYPES: (LeaveType | 'All')[] = ['All', 'Annual', 'Sick', 'Maternity', 'Short Leave', 'No Pay', 'Casual'];

/* ─── Enter Leave Modal ──────────────────────────────────── */
interface EnterLeaveModalProps {
    onClose: () => void;
    onSave: (rec: LeaveRequest) => void;
}

function EnterLeaveModal({ onClose, onSave }: EnterLeaveModalProps) {
    const [saving, setSaving] = useState(false);
    const [empQuery, setEmpQuery] = useState('');
    const [emp, setEmp] = useState('');
    const [showSuggest, setShowSuggest] = useState(false);
    const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [halfDay, setHalfDay] = useState(false);
    const [reason, setReason] = useState('');
    const [docNote, setDocNote] = useState('');
    const [initStatus, setInitStatus] = useState<LeaveStatus>('Approved');

    const employee = EMPLOYEE_LIST.find(e => e.empNo === emp) ?? null;
    const days = halfDay ? 0.5 : businessDaysBetween(fromDate, toDate);

    const suggestions = empQuery.trim().length > 0
        ? EMPLOYEE_LIST.filter(e =>
            e.empNo.toLowerCase().includes(empQuery.toLowerCase()) ||
            e.name.toLowerCase().includes(empQuery.toLowerCase())
        )
        : [];

    const selectEmployee = (e: typeof EMPLOYEE_LIST[0]) => {
        setEmp(e.empNo);
        setEmpQuery(e.empNo);
        setShowSuggest(false);
    };

    const clearEmployee = () => {
        setEmp('');
        setEmpQuery('');
        setShowSuggest(false);
    };

    const handleSave = async () => {
        if (!employee || !fromDate || !toDate || !reason.trim()) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 700));
        const newRec: LeaveRequest = {
            id: String(Date.now()),
            empNo: employee.empNo,
            name: employee.name,
            dept: employee.dept,
            type: leaveType,
            from: fromDate,
            to: toDate,
            days,
            reason: reason.trim(),
            status: initStatus,
            appliedOn: new Date().toISOString().split('T')[0],
            approvedBy: initStatus === 'Approved' ? 'HR Manager' : undefined,
        };
        setSaving(false);
        onSave(newRec);
    };

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.modalHeaderLeft}>
                        <div className={styles.modalIcon}><CalendarPlus size={18} /></div>
                        <div>
                            <h3 className={styles.modalTitle}>Enter Leave Record</h3>
                            <p className={styles.modalSub}>Record leave on behalf of an employee — HR entry</p>
                        </div>
                    </div>
                    <button id="close-leave-modal" className={styles.modalCloseBtn} onClick={onClose}><X size={16} /></button>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>
                    {/* Employee Search */}
                    <div className={styles.formSection}>
                        <label className={styles.formLabel}>Employee ID <span className={styles.required}>*</span></label>
                        <div className={styles.empSearchWrap}>
                            <div className={styles.empSearchBox}>
                                <Search size={14} className={styles.empSearchIcon} />
                                <input
                                    id="el-employee"
                                    type="text"
                                    className={styles.empSearchInput}
                                    value={empQuery}
                                    placeholder=""
                                    autoComplete="off"
                                    onChange={e => {
                                        setEmpQuery(e.target.value);
                                        setEmp('');
                                        setShowSuggest(true);
                                    }}
                                    onFocus={() => setShowSuggest(true)}
                                    onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                                />
                                {empQuery && (
                                    <button className={styles.empClearBtn} onMouseDown={clearEmployee} tabIndex={-1}>
                                        <X size={12} />
                                    </button>
                                )}
                            </div>

                            {/* Suggestion dropdown */}
                            {showSuggest && suggestions.length > 0 && (
                                <div className={styles.empSuggestions}>
                                    {suggestions.map(s => (
                                        <button
                                            key={s.empNo}
                                            className={styles.empSuggestionItem}
                                            onMouseDown={() => selectEmployee(s)}
                                        >
                                            <span className={styles.empSugAvatar}>
                                                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </span>
                                            <span className={styles.empSugInfo}>
                                                <span className={styles.empSugName}>{s.name}</span>
                                                <span className={styles.empSugMeta}>{s.empNo} · {s.dept}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* No match message */}
                            {showSuggest && empQuery.trim().length > 0 && suggestions.length === 0 && (
                                <div className={styles.empNoMatch}>No employee found for &quot;{empQuery}&quot;</div>
                            )}
                        </div>

                        {/* Matched employee card */}
                        {employee && (
                            <div className={styles.empMatchedCard}>
                                <div className={styles.empMatchedAvatar}>
                                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className={styles.empMatchedInfo}>
                                    <span className={styles.empMatchedName}>{employee.name}</span>
                                    <span className={styles.empMatchedMeta}>{employee.empNo} · {employee.dept}</span>
                                </div>
                                <span className={styles.empMatchedTick}>✓</span>
                            </div>
                        )}
                    </div>

                    {/* Leave Type + Initial Status */}
                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.formLabel}>Leave Type</label>
                            <select
                                id="el-type"
                                className={styles.formSelect}
                                value={leaveType}
                                onChange={e => setLeaveType(e.target.value as LeaveType)}
                            >
                                {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.formLabel}>Record Status</label>
                            <select
                                id="el-status"
                                className={styles.formSelect}
                                value={initStatus}
                                onChange={e => setInitStatus(e.target.value as LeaveStatus)}
                            >
                                <option>Approved</option>
                                <option>Pending</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className={styles.formRow}>
                        <div className={styles.formSection}>
                            <label className={styles.formLabel}>From Date</label>
                            <input
                                id="el-from"
                                type="date"
                                className={styles.formInput}
                                value={fromDate}
                                onChange={e => { setFromDate(e.target.value); if (!toDate) setToDate(e.target.value); }}
                            />
                        </div>
                        <div className={styles.formSection}>
                            <label className={styles.formLabel}>To Date</label>
                            <input
                                id="el-to"
                                type="date"
                                className={styles.formInput}
                                value={toDate}
                                min={fromDate}
                                onChange={e => setToDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Half Day toggle + Days summary */}
                    <div className={styles.formRow}>
                        <label className={styles.halfDayToggle}>
                            <input
                                id="el-halfday"
                                type="checkbox"
                                checked={halfDay}
                                onChange={e => setHalfDay(e.target.checked)}
                            />
                            <span>Half Day Leave</span>
                        </label>
                        {fromDate && toDate && (
                            <div className={styles.daysBadge}>
                                <span className={styles.daysNum}>{days}</span>
                                <span className={styles.daysLabel}>{days === 1 ? 'working day' : 'working days'}</span>
                            </div>
                        )}
                    </div>

                    {/* Reason */}
                    <div className={styles.formSection}>
                        <label className={styles.formLabel}>Reason / Description <span className={styles.required}>*</span></label>
                        <textarea
                            id="el-reason"
                            className={styles.formTextarea}
                            rows={3}
                            placeholder="e.g. Medical appointment, family emergency, planned vacation…"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                    </div>

                    {/* Supporting Document */}
                    <div className={styles.formSection}>
                        <label className={styles.formLabel}>Supporting Document / Note <span className={styles.optional}>(optional)</span></label>
                        <input
                            id="el-doc"
                            type="text"
                            className={styles.formInput}
                            placeholder="e.g. Medical certificate received, MC No. 12345"
                            value={docNote}
                            onChange={e => setDocNote(e.target.value)}
                        />
                    </div>

                    {/* Leave type colour indicator */}
                    <div className={styles.leaveTypeBanner} style={{ background: TYPE_COLOR[leaveType] + '14', borderColor: TYPE_COLOR[leaveType] + '40' }}>
                        <span className={styles.leaveTypeDot} style={{ background: TYPE_COLOR[leaveType] }} />
                        <span style={{ color: TYPE_COLOR[leaveType], fontWeight: 700 }}>{leaveType} Leave</span>
                        <span className={styles.leaveTypeSep}>·</span>
                        <span>{employee ? employee.name : '—'}</span>
                        <span className={styles.leaveTypeSep}>·</span>
                        <span>{days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : '—'}</span>
                        <span className={styles.leaveTypeSep}>·</span>
                        <span className={styles.leaveTypeStatus} style={{ color: initStatus === 'Approved' ? '#10B981' : initStatus === 'Rejected' ? '#EF4444' : '#F59E0B' }}>
                            {initStatus}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button
                        id="save-leave-record-btn"
                        variant="primary"
                        size="sm"
                        icon={<FileText size={14} />}
                        loading={saving}
                        disabled={!employee || !fromDate || !toDate || !reason.trim()}
                        onClick={handleSave}
                    >
                        Save Leave Record
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function LeaveRequestTable() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<LeaveStatus | 'All'>('All');
    const [type, setType] = useState<LeaveType | 'All'>('All');
    const [view, setView] = useState<'requests' | 'balances'>('requests');
    const [data, setData] = useState<LeaveRequest[]>(LEAVE_DATA);
    const [showEnterLeave, setShowEnterLeave] = useState(false);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return data.filter(r =>
            (!q || r.name.toLowerCase().includes(q) || r.empNo.toLowerCase().includes(q)) &&
            (status === 'All' || r.status === status) &&
            (type === 'All' || r.type === type)
        );
    }, [search, status, type, data]);

    const pendingCount = data.filter(r => r.status === 'Pending').length;

    const updateStatus = (id: string, newStatus: LeaveStatus) =>
        setData(prev => prev.map(r =>
            r.id === id ? { ...r, status: newStatus, approvedBy: newStatus === 'Approved' ? 'HR Manager' : undefined } : r
        ));

    return (
        <>
            <div className={styles.root}>

                {/* ── View Switcher ── */}
                <div className={styles.viewSwitcher}>
                    <button
                        id="view-requests-btn"
                        className={`${styles.viewBtn} ${view === 'requests' ? styles.viewActive : ''}`}
                        onClick={() => setView('requests')}
                    >
                        <Clock size={15} />
                        Leave Requests
                        {pendingCount > 0 && <span className={styles.pendingPill}>{pendingCount}</span>}
                    </button>
                    <button
                        id="view-balances-btn"
                        className={`${styles.viewBtn} ${view === 'balances' ? styles.viewActive : ''}`}
                        onClick={() => setView('balances')}
                    >
                        <User size={15} />
                        Leave Balances
                    </button>
                </div>

                {/* ── Toolbar ── */}
                <div className={styles.toolbar}>
                    <div className={styles.searchWrap}>
                        <Search size={15} className={styles.searchIcon} />
                        <input
                            id="leave-search"
                            type="text"
                            placeholder="Search employee or EMP#…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.toolbarRight}>
                        <select id="leave-status-filter" className={styles.filterSelect} value={status} onChange={e => setStatus(e.target.value as LeaveStatus | 'All')}>
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <select id="leave-type-filter" className={styles.filterSelect} value={type} onChange={e => setType(e.target.value as LeaveType | 'All')}>
                            {TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export</Button>
                        <Button
                            id="enter-leave-btn"
                            variant="primary"
                            size="sm"
                            icon={<CalendarPlus size={15} />}
                            onClick={() => setShowEnterLeave(true)}
                        >
                            Enter Leave Record
                        </Button>
                    </div>
                </div>

                {/* ─── REQUESTS TABLE ─────────────────────────────────── */}
                {view === 'requests' && (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Employee</th>
                                    <th className={styles.th}>Leave Type</th>
                                    <th className={styles.th}>From</th>
                                    <th className={styles.th}>To</th>
                                    <th className={styles.th}>Days</th>
                                    <th className={styles.th}>Reason</th>
                                    <th className={styles.th}>Applied On</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={9} className={styles.empty}>No leave requests match your filters.</td></tr>
                                ) : filtered.map(req => (
                                    <tr key={req.id} className={styles.row}>
                                        <td className={styles.td}>
                                            <div className={styles.nameCell}>
                                                <div className={styles.avatar} style={{ background: TYPE_COLOR[req.type] + '22', color: TYPE_COLOR[req.type] }}>
                                                    {req.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <span className={styles.empName}>{req.name}</span>
                                                    <span className={styles.empMeta}>{req.empNo} · {req.dept}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={styles.leaveType} style={{ color: TYPE_COLOR[req.type], background: TYPE_COLOR[req.type] + '18' }}>
                                                {req.type}
                                            </span>
                                        </td>
                                        <td className={`${styles.td} ${styles.tdDate}`}>{fmtDate(req.from)}</td>
                                        <td className={`${styles.td} ${styles.tdDate}`}>{fmtDate(req.to)}</td>
                                        <td className={`${styles.td} ${styles.tdDays}`}>{req.days}d</td>
                                        <td className={styles.td}>
                                            <span className={styles.reason}>{req.reason}</span>
                                        </td>
                                        <td className={`${styles.td} ${styles.tdDate}`}>{fmtDate(req.appliedOn)}</td>
                                        <td className={styles.td}>
                                            <Badge variant={STATUS_VARIANT[req.status]} dot>{req.status}</Badge>
                                            {req.approvedBy && <span className={styles.approvedBy}>by {req.approvedBy}</span>}
                                        </td>
                                        <td className={styles.td}>
                                            {req.status === 'Pending' ? (
                                                <div className={styles.approvalBtns}>
                                                    <button
                                                        id={`approve-leave-${req.id}`}
                                                        className={styles.approveBtn}
                                                        title="Approve"
                                                        onClick={() => updateStatus(req.id, 'Approved')}
                                                    ><Check size={14} /></button>
                                                    <button
                                                        id={`reject-leave-${req.id}`}
                                                        className={styles.rejectBtn}
                                                        title="Reject"
                                                        onClick={() => updateStatus(req.id, 'Rejected')}
                                                    ><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <button
                                                    id={`undo-leave-${req.id}`}
                                                    className={styles.undoBtn}
                                                    title="Reset to Pending"
                                                    onClick={() => updateStatus(req.id, 'Pending')}
                                                ><RefreshCw size={13} /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ─── BALANCES TABLE ──────────────────────────────────── */}
                {view === 'balances' && (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Employee</th>
                                    <th className={styles.th}>Annual Leave</th>
                                    <th className={styles.th}>Sick Leave</th>
                                    <th className={styles.th}>Casual Leave</th>
                                    <th className={styles.th}>Total Used</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LEAVE_BALANCES.map(b => {
                                    const totalUsed = b.annualUsed + b.sickUsed + b.casualUsed;
                                    const totalMax = b.annual + b.sick + b.casual;
                                    return (
                                        <tr key={b.empNo} className={styles.row}>
                                            <td className={styles.td}>
                                                <div className={styles.nameCell}>
                                                    <div className={styles.avatar}>{b.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                                    <div>
                                                        <span className={styles.empName}>{b.name}</span>
                                                        <span className={styles.empMeta}>{b.empNo}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.td}><BalanceBar used={b.annualUsed} total={b.annual} color="#3B82F6" /></td>
                                            <td className={styles.td}><BalanceBar used={b.sickUsed} total={b.sick} color="#EF4444" /></td>
                                            <td className={styles.td}><BalanceBar used={b.casualUsed} total={b.casual} color="#10B981" /></td>
                                            <td className={styles.td}><BalanceBar used={totalUsed} total={totalMax} color="#E63946" /></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {showEnterLeave && (
                <EnterLeaveModal
                    onClose={() => setShowEnterLeave(false)}
                    onSave={rec => { setData(prev => [rec, ...prev]); setShowEnterLeave(false); }}
                />
            )}
        </>
    );
}

/* ─── Balance Bar ────────────────────────────────────────── */
function BalanceBar({ used, total, color }: { used: number; total: number; color: string }) {
    const pct = Math.round((used / total) * 100);
    return (
        <div className={styles.balanceWrap}>
            <div className={styles.balanceBar}>
                <div className={styles.balanceFill} style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className={styles.balanceText}>{used}/{total} days</span>
        </div>
    );
}
