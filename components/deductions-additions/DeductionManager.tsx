'use client';

import React, { useState, useMemo } from 'react';
import {
    Search, Plus, Trash2, Edit2, Download, Filter,
    Minus, TrendingDown
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './DeductionManager.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type DeductionType = 'EPF' | 'ETF' | 'Loan' | 'Advance' | 'No-Pay' | 'Late' | 'Meal' | 'Manual';

interface Deduction {
    id: string;
    empNo: string;
    empName: string;
    dept: string;
    type: DeductionType;
    amount: number;
    month: string;
    description: string;
    status: 'Applied' | 'Pending' | 'Cancelled';
}

/* ─── Mock Data ─────────────────────────────────────────── */
const DEDUCTIONS: Deduction[] = [
    { id: '1', empNo: 'BT-001', empName: 'Kasun Perera', dept: 'IT', type: 'EPF', amount: 6800, month: '2026-02', description: 'EPF Employee 8%', status: 'Applied' },
    { id: '2', empNo: 'BT-001', empName: 'Kasun Perera', dept: 'IT', type: 'Loan', amount: 5000, month: '2026-02', description: 'Staff loan installment #3', status: 'Applied' },
    { id: '3', empNo: 'BT-002', empName: 'Chamari Atapattu', dept: 'Finance', type: 'EPF', amount: 9600, month: '2026-02', description: 'EPF Employee 8%', status: 'Applied' },
    { id: '4', empNo: 'BT-003', empName: 'Ajith Bandara', dept: 'Production', type: 'EPF', amount: 3360, month: '2026-02', description: 'EPF Employee 8%', status: 'Applied' },
    { id: '5', empNo: 'BT-003', empName: 'Ajith Bandara', dept: 'Production', type: 'No-Pay', amount: 2800, month: '2026-02', description: '2 days no-pay absences', status: 'Applied' },
    { id: '6', empNo: 'BT-004', empName: 'Nimali Jayawardene', dept: 'HR', type: 'EPF', amount: 5200, month: '2026-02', description: 'EPF Employee 8%', status: 'Pending' },
    { id: '7', empNo: 'BT-005', empName: 'Ruwan Fernando', dept: 'Production', type: 'EPF', amount: 3040, month: '2026-02', description: 'EPF Employee 8%', status: 'Applied' },
    { id: '8', empNo: 'BT-005', empName: 'Ruwan Fernando', dept: 'Production', type: 'Late', amount: 400, month: '2026-02', description: '2 late arrivals penalty', status: 'Applied' },
    { id: '9', empNo: 'BT-005', empName: 'Ruwan Fernando', dept: 'Production', type: 'Meal', amount: 1500, month: '2026-02', description: 'Meal deduction', status: 'Applied' },
    { id: '10', empNo: 'BT-006', empName: 'Sandya Kumari', dept: 'Admin', type: 'EPF', amount: 3600, month: '2026-02', description: 'EPF Employee 8%', status: 'Applied' },
    { id: '11', empNo: 'BT-007', empName: 'Pradeep Silva', dept: 'Production', type: 'Advance', amount: 10000, month: '2026-02', description: 'Salary advance recovery', status: 'Pending' },
    { id: '12', empNo: 'BT-008', empName: 'Gayani Alwis', dept: 'HR', type: 'Manual', amount: 2000, month: '2026-02', description: 'Uniform deduction', status: 'Applied' },
];

const TYPE_COLORS: Record<DeductionType, { bg: string; color: string }> = {
    EPF: { bg: '#DBEAFE', color: '#1D4ED8' },
    ETF: { bg: '#EDE9FE', color: '#6D28D9' },
    Loan: { bg: '#FEE2E2', color: '#DC2626' },
    Advance: { bg: '#FEF3C7', color: '#D97706' },
    'No-Pay': { bg: '#F3F4F6', color: '#374151' },
    Late: { bg: '#FFEDD5', color: '#EA580C' },
    Meal: { bg: '#D1FAE5', color: '#059669' },
    Manual: { bg: '#FCE7F3', color: '#BE185D' },
};

const MONTHS = ['2026-02', '2026-01', '2025-12'];
const DEDUCTION_TYPES: (DeductionType | 'All')[] = ['All', 'EPF', 'ETF', 'Loan', 'Advance', 'No-Pay', 'Late', 'Meal', 'Manual'];
const STATUS_LIST = ['All', 'Applied', 'Pending', 'Cancelled'];

const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');

/* ─── Add Deduction Modal ────────────────────────────────── */
function AddDeductionModal({ onClose }: { onClose: () => void }) {
    const [saving, setSaving] = useState(false);
    const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 700)); setSaving(false); onClose(); };

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Add Deduction</h3>
                    <button id="close-deduction-modal" className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.formGrid}>
                        <div className={styles.formField}>
                            <label htmlFor="ded-emp-id">Employee ID</label>
                            <input id="ded-emp-id" type="text" className={styles.formInput}
                                placeholder="e.g. BT-001"
                                list="ded-emp-list"
                            />
                            <datalist id="ded-emp-list">
                                {['BT-001', 'BT-002', 'BT-003', 'BT-004', 'BT-005', 'BT-006', 'BT-007', 'BT-008', 'BT-009'].map(id => <option key={id} value={id} />)}
                            </datalist>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="ded-type">Deduction Type</label>
                            <select id="ded-type" className={styles.formSelect}>
                                {(['EPF', 'ETF', 'Loan', 'Advance', 'No-Pay', 'Late', 'Meal', 'Manual'] as DeductionType[]).map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="ded-amount">Amount (LKR)</label>
                            <input id="ded-amount" type="number" className={styles.formInput} placeholder="0.00" />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="ded-month">Month</label>
                            <input id="ded-month" type="month" className={styles.formInput} defaultValue="2026-02" />
                        </div>
                        <div className={`${styles.formField} ${styles.fullWidth}`}>
                            <label htmlFor="ded-desc">Description</label>
                            <input id="ded-desc" type="text" className={styles.formInput} placeholder="Brief description..." />
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" size="sm" icon={<Minus size={14} />} loading={saving} onClick={handleSave}>Add Deduction</Button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function DeductionManager() {
    const [search, setSearch] = useState('');
    const [typeF, setTypeF] = useState<DeductionType | 'All'>('All');
    const [statusF, setStatusF] = useState('All');
    const [month, setMonth] = useState('2026-02');
    const [showModal, setShowModal] = useState(false);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return DEDUCTIONS.filter(d =>
            (!q || d.empName.toLowerCase().includes(q) || d.empNo.toLowerCase().includes(q)) &&
            (typeF === 'All' || d.type === typeF) &&
            (statusF === 'All' || d.status === statusF) &&
            d.month === month
        );
    }, [search, typeF, statusF, month]);

    const totalAmount = filtered.reduce((sum, d) => sum + d.amount, 0);
    const byType = DEDUCTION_TYPES.filter(t => t !== 'All').map(t => ({
        type: t as DeductionType,
        total: DEDUCTIONS.filter(d => d.type === t && d.month === month).reduce((s, d) => s + d.amount, 0),
        count: DEDUCTIONS.filter(d => d.type === t && d.month === month).length,
    })).filter(t => t.count > 0);

    return (
        <div className={styles.root}>
            {/* ── Summary Chips ── */}
            <div className={styles.summaryRow}>
                {byType.map(({ type, total, count }) => (
                    <div key={type} className={styles.summaryChip}
                        style={{ borderLeftColor: TYPE_COLORS[type].color, background: TYPE_COLORS[type].bg + '88' }}
                        onClick={() => setTypeF(type)}>
                        <span className={styles.chipType} style={{ color: TYPE_COLORS[type].color }}>{type}</span>
                        <span className={styles.chipCount}>{count} entries</span>
                        <span className={styles.chipAmount} style={{ color: TYPE_COLORS[type].color }}>{fmt(total)}</span>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                    <Search size={15} className={styles.searchIcon} />
                    <input id="ded-search" type="text" placeholder="Search employee…" value={search}
                        onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
                </div>
                <div className={styles.toolbarRight}>
                    <select id="ded-type-filter" className={styles.filterSel} value={typeF} onChange={e => setTypeF(e.target.value as DeductionType | 'All')}>
                        {DEDUCTION_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <select id="ded-status-filter" className={styles.filterSel} value={statusF} onChange={e => setStatusF(e.target.value)}>
                        {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <select id="ded-month-filter" className={styles.filterSel} value={month} onChange={e => setMonth(e.target.value)}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export</Button>
                    <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Add Deduction</Button>
                </div>
            </div>

            {/* ── Total Callout ── */}
            <div className={styles.totalBar}>
                <TrendingDown size={16} className={styles.totalIcon} />
                <span>Total deductions for <strong>{month}</strong>:</span>
                <span className={styles.totalAmount}>{fmt(totalAmount)}</span>
                <span className={styles.totalSub}>across {filtered.length} entries</span>
                {typeF !== 'All' && <button className={styles.clearFilter} onClick={() => setTypeF('All')}>Clear filter ×</button>}
            </div>

            {/* ── Table ── */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Employee</th>
                            <th className={styles.th}>Type</th>
                            <th className={styles.th}>Description</th>
                            <th className={styles.th}>Month</th>
                            <th className={styles.th}>Amount</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0
                            ? <tr><td colSpan={7} className={styles.empty}>No deductions for the selected filters.</td></tr>
                            : filtered.map(d => (
                                <tr key={d.id} className={styles.row}>
                                    <td className={styles.td}>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>{d.empName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                            <div>
                                                <span className={styles.empId}>{d.empNo}</span>
                                                <span className={styles.empName}>{d.empName}</span>
                                                <span className={styles.empMeta}>{d.dept}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.typeBadge} style={{ background: TYPE_COLORS[d.type].bg, color: TYPE_COLORS[d.type].color }}>{d.type}</span>
                                    </td>
                                    <td className={styles.td}><span className={styles.desc}>{d.description}</span></td>
                                    <td className={styles.td}><span className={styles.mono}>{d.month}</span></td>
                                    <td className={`${styles.td} ${styles.amount}`}>{fmt(d.amount)}</td>
                                    <td className={styles.td}>
                                        <Badge variant={d.status === 'Applied' ? 'success' : d.status === 'Pending' ? 'warning' : 'muted'} dot>{d.status}</Badge>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.rowActions}>
                                            <button id={`edit-ded-${d.id}`} className={styles.actionBtn} title="Edit"><Edit2 size={14} /></button>
                                            <button id={`del-ded-${d.id}`} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {showModal && <AddDeductionModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
