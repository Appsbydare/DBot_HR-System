'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Download, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './AdditionManager.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type AdditionType = 'OT Normal' | 'OT Rest Day' | 'OT Holiday' | 'Incentive' | 'Bonus' | 'Arrears' | 'Allowance' | 'Manual';

interface Addition {
    id: string;
    empNo: string;
    empName: string;
    dept: string;
    type: AdditionType;
    amount: number;
    hours?: number;   // for OT types
    rate?: number;
    month: string;
    description: string;
    status: 'Applied' | 'Pending';
}

/* ─── Mock Data ─────────────────────────────────────────── */
const ADDITIONS: Addition[] = [
    { id: '1', empNo: 'BT-001', empName: 'Kasun Perera', dept: 'IT', type: 'OT Normal', amount: 7083, hours: 10, rate: 1.5, month: '2026-02', description: '10 hrs normal OT @ 1.5×', status: 'Applied' },
    { id: '2', empNo: 'BT-001', empName: 'Kasun Perera', dept: 'IT', type: 'Incentive', amount: 5000, month: '2026-02', description: 'Q4 performance incentive', status: 'Applied' },
    { id: '3', empNo: 'BT-002', empName: 'Chamari Atapattu', dept: 'Finance', type: 'Bonus', amount: 15000, month: '2026-02', description: 'Annual bonus', status: 'Applied' },
    { id: '4', empNo: 'BT-003', empName: 'Ajith Bandara', dept: 'Production', type: 'OT Normal', amount: 2625, hours: 15, rate: 1.5, month: '2026-02', description: '15 hrs normal OT @ 1.5×', status: 'Applied' },
    { id: '5', empNo: 'BT-003', empName: 'Ajith Bandara', dept: 'Production', type: 'OT Rest Day', amount: 3500, hours: 8, rate: 2.0, month: '2026-02', description: '8 hrs rest day OT @ 2.0×', status: 'Applied' },
    { id: '6', empNo: 'BT-005', empName: 'Ruwan Fernando', dept: 'Production', type: 'OT Normal', amount: 2375, hours: 15, rate: 1.5, month: '2026-02', description: '15 hrs normal OT @ 1.5×', status: 'Applied' },
    { id: '7', empNo: 'BT-006', empName: 'Sandya Kumari', dept: 'Admin', type: 'Allowance', amount: 3000, month: '2026-02', description: 'Transport allowance', status: 'Applied' },
    { id: '8', empNo: 'BT-007', empName: 'Pradeep Silva', dept: 'Production', type: 'OT Holiday', amount: 5416, hours: 8, rate: 2.5, month: '2026-02', description: '8 hrs holiday OT @ 2.5×', status: 'Applied' },
    { id: '9', empNo: 'BT-008', empName: 'Gayani Alwis', dept: 'HR', type: 'Arrears', amount: 4500, month: '2026-02', description: 'Jan arrears adjustment', status: 'Pending' },
    { id: '10', empNo: 'BT-009', empName: 'Thilak Dissanayake', dept: 'Logistics', type: 'Incentive', amount: 3000, month: '2026-02', description: 'Warehouse efficiency bonus', status: 'Applied' },
    { id: '11', empNo: 'BT-007', empName: 'Pradeep Silva', dept: 'Production', type: 'Manual', amount: 1000, month: '2026-02', description: 'Skill allowance', status: 'Pending' },
];

const TYPE_COLORS: Record<AdditionType, { bg: string; color: string }> = {
    'OT Normal': { bg: '#D1FAE5', color: '#059669' },
    'OT Rest Day': { bg: '#FEF3C7', color: '#D97706' },
    'OT Holiday': { bg: '#FFEDD5', color: '#EA580C' },
    Incentive: { bg: '#DBEAFE', color: '#1D4ED8' },
    Bonus: { bg: '#EDE9FE', color: '#6D28D9' },
    Arrears: { bg: '#FEE2E2', color: '#DC2626' },
    Allowance: { bg: '#FCE7F3', color: '#BE185D' },
    Manual: { bg: '#F3F4F6', color: '#374151' },
};

const MONTHS = ['2026-02', '2026-01', '2025-12'];
const ADDITION_TYPES: (AdditionType | 'All')[] = ['All', 'OT Normal', 'OT Rest Day', 'OT Holiday', 'Incentive', 'Bonus', 'Arrears', 'Allowance', 'Manual'];

const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');

/* ─── Add Addition Modal ─────────────────────────────────── */
function AddAdditionModal({ onClose }: { onClose: () => void }) {
    const [saving, setSaving] = useState(false);
    const [selType, setSelType] = useState<AdditionType>('OT Normal');
    const isOT = selType.startsWith('OT');

    const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 700)); setSaving(false); onClose(); };

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Add Addition / OT Entry</h3>
                    <button id="close-addition-modal" className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.formGrid}>
                        <div className={styles.formField}>
                            <label htmlFor="add-emp-id">Employee ID</label>
                            <input id="add-emp-id" type="text" className={styles.formInput}
                                placeholder="e.g. BT-001"
                                list="add-emp-list"
                            />
                            <datalist id="add-emp-list">
                                {['BT-001', 'BT-002', 'BT-003', 'BT-004', 'BT-005', 'BT-006', 'BT-007', 'BT-008', 'BT-009'].map(id => <option key={id} value={id} />)}
                            </datalist>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="add-type">Addition Type</label>
                            <select id="add-type" className={styles.formSelect} value={selType} onChange={e => setSelType(e.target.value as AdditionType)}>
                                {(['OT Normal', 'OT Rest Day', 'OT Holiday', 'Incentive', 'Bonus', 'Arrears', 'Allowance', 'Manual'] as AdditionType[]).map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>

                        {isOT ? (
                            <>
                                <div className={styles.formField}>
                                    <label htmlFor="add-hours">OT Hours</label>
                                    <input id="add-hours" type="number" className={styles.formInput} placeholder="e.g. 10" />
                                </div>
                                <div className={styles.formField}>
                                    <label htmlFor="add-rate">Rate Multiplier</label>
                                    <select id="add-rate" className={styles.formSelect}>
                                        <option value="1.5">1.5× Normal</option>
                                        <option value="2.0">2.0× Rest Day</option>
                                        <option value="2.5">2.5× Holiday</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div className={styles.formField}>
                                <label htmlFor="add-amount">Amount (LKR)</label>
                                <input id="add-amount" type="number" className={styles.formInput} placeholder="0.00" />
                            </div>
                        )}

                        <div className={styles.formField}>
                            <label htmlFor="add-month">Month</label>
                            <input id="add-month" type="month" className={styles.formInput} defaultValue="2026-02" />
                        </div>
                        <div className={`${styles.formField} ${styles.fullWidth}`}>
                            <label htmlFor="add-desc">Description</label>
                            <input id="add-desc" type="text" className={styles.formInput} placeholder="Brief description..." />
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button variant="success" size="sm" icon={<Plus size={14} />} loading={saving} onClick={handleSave}>Add Entry</Button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function AdditionManager() {
    const [search, setSearch] = useState('');
    const [typeF, setTypeF] = useState<AdditionType | 'All'>('All');
    const [month, setMonth] = useState('2026-02');
    const [showModal, setShowModal] = useState(false);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return ADDITIONS.filter(a =>
            (!q || a.empName.toLowerCase().includes(q) || a.empNo.toLowerCase().includes(q)) &&
            (typeF === 'All' || a.type === typeF) &&
            a.month === month
        );
    }, [search, typeF, month]);

    const totalAmount = filtered.reduce((s, a) => s + a.amount, 0);

    const byType = ADDITION_TYPES.filter(t => t !== 'All').map(t => ({
        type: t as AdditionType,
        total: ADDITIONS.filter(a => a.type === t && a.month === month).reduce((s, a) => s + a.amount, 0),
        count: ADDITIONS.filter(a => a.type === t && a.month === month).length,
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
                    <input id="add-search" type="text" placeholder="Search employee…" value={search}
                        onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
                </div>
                <div className={styles.toolbarRight}>
                    <select id="add-type-filter" className={styles.filterSel} value={typeF} onChange={e => setTypeF(e.target.value as AdditionType | 'All')}>
                        {ADDITION_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <select id="add-month-filter" className={styles.filterSel} value={month} onChange={e => setMonth(e.target.value)}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export</Button>
                    <Button variant="success" size="sm" icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Add Entry</Button>
                </div>
            </div>

            {/* ── Total Callout ── */}
            <div className={styles.totalBar}>
                <TrendingUp size={16} className={styles.totalIcon} />
                <span>Total additions for <strong>{month}</strong>:</span>
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
                            <th className={styles.th}>Hours / Rate</th>
                            <th className={styles.th}>Amount</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0
                            ? <tr><td colSpan={7} className={styles.empty}>No additions for the selected filters.</td></tr>
                            : filtered.map(a => (
                                <tr key={a.id} className={styles.row}>
                                    <td className={styles.td}>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>{a.empName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                            <div>
                                                <span className={styles.empId}>{a.empNo}</span>
                                                <span className={styles.empName}>{a.empName}</span>
                                                <span className={styles.empMeta}>{a.dept}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.typeBadge} style={{ background: TYPE_COLORS[a.type].bg, color: TYPE_COLORS[a.type].color }}>{a.type}</span>
                                    </td>
                                    <td className={styles.td}><span className={styles.desc}>{a.description}</span></td>
                                    <td className={styles.td}>
                                        {a.hours ? <span className={styles.otInfo}>{a.hours}h @ {a.rate}×</span> : <span className={styles.na}>—</span>}
                                    </td>
                                    <td className={`${styles.td} ${styles.amount}`}>{fmt(a.amount)}</td>
                                    <td className={styles.td}>
                                        <Badge variant={a.status === 'Applied' ? 'success' : 'warning'} dot>{a.status}</Badge>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.rowActions}>
                                            <button id={`edit-add-${a.id}`} className={styles.actionBtn} title="Edit"><Edit2 size={14} /></button>
                                            <button id={`del-add-${a.id}`} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {showModal && <AddAdditionModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
