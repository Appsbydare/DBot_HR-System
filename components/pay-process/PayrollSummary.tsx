'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './PayrollSummary.module.css';

/* ─── Types ─────────────────────────────────────────────── */
interface PayrollRow {
    empNo: string;
    empName: string;
    dept: string;
    category: string;
    basic: number;
    budgetary: number;
    attendance: number;
    fixed: number;
    otNormal: number;
    otRest: number;
    otHoliday: number;
    incentive: number;
    bonus: number;
    epfEmp: number;
    loanDed: number;
    noPay: number;
    lateDed: number;
    mealDed: number;
    advance: number;
}

/* ─── Mock Data ─────────────────────────────────────────── */
const PAYROLL: PayrollRow[] = [
    { empNo: 'BT-001', empName: 'Kasun Perera', dept: 'IT', category: 'Management', basic: 85000, budgetary: 5000, attendance: 3000, fixed: 2500, otNormal: 7083, otRest: 0, otHoliday: 0, incentive: 5000, bonus: 0, epfEmp: 6800, loanDed: 5000, noPay: 0, lateDed: 0, mealDed: 0, advance: 0 },
    { empNo: 'BT-002', empName: 'Chamari Atapattu', dept: 'Finance', category: 'Management', basic: 120000, budgetary: 8000, attendance: 5000, fixed: 10000, otNormal: 0, otRest: 0, otHoliday: 0, incentive: 0, bonus: 15000, epfEmp: 9600, loanDed: 0, noPay: 0, lateDed: 0, mealDed: 0, advance: 0 },
    { empNo: 'BT-003', empName: 'Ajith Bandara', dept: 'Production', category: 'Shop & Office', basic: 42000, budgetary: 2500, attendance: 2000, fixed: 0, otNormal: 2625, otRest: 3500, otHoliday: 0, incentive: 0, bonus: 0, epfEmp: 3360, loanDed: 0, noPay: 2800, lateDed: 0, mealDed: 0, advance: 0 },
    { empNo: 'BT-004', empName: 'Nimali Jayawardene', dept: 'HR', category: 'Management', basic: 65000, budgetary: 4000, attendance: 3000, fixed: 0, otNormal: 0, otRest: 0, otHoliday: 0, incentive: 0, bonus: 0, epfEmp: 5200, loanDed: 0, noPay: 0, lateDed: 0, mealDed: 0, advance: 0 },
    { empNo: 'BT-005', empName: 'Ruwan Fernando', dept: 'Production', category: 'Shop & Office', basic: 38000, budgetary: 2000, attendance: 1500, fixed: 0, otNormal: 2375, otRest: 0, otHoliday: 0, incentive: 0, bonus: 0, epfEmp: 3040, loanDed: 0, noPay: 0, lateDed: 400, mealDed: 1500, advance: 0 },
    { empNo: 'BT-006', empName: 'Sandya Kumari', dept: 'Admin', category: 'Assistant', basic: 45000, budgetary: 3000, attendance: 2500, fixed: 0, otNormal: 0, otRest: 0, otHoliday: 0, incentive: 0, bonus: 0, epfEmp: 3600, loanDed: 2000, noPay: 0, lateDed: 0, mealDed: 0, advance: 0 },
    { empNo: 'BT-007', empName: 'Pradeep Silva', dept: 'Production', category: 'Shop & Office', basic: 40000, budgetary: 2500, attendance: 2000, fixed: 0, otNormal: 0, otRest: 0, otHoliday: 5416, incentive: 0, bonus: 0, epfEmp: 3200, loanDed: 0, noPay: 0, lateDed: 0, mealDed: 0, advance: 10000 },
    { empNo: 'BT-008', empName: 'Gayani Alwis', dept: 'HR', category: 'Management', basic: 72000, budgetary: 4500, attendance: 3000, fixed: 0, otNormal: 0, otRest: 0, otHoliday: 0, incentive: 0, bonus: 0, epfEmp: 5760, loanDed: 0, noPay: 0, lateDed: 0, mealDed: 0, advance: 0 },
    { empNo: 'BT-009', empName: 'Thilak Dissanayake', dept: 'Logistics', category: 'Assistant', basic: 58000, budgetary: 3500, attendance: 2500, fixed: 1500, otNormal: 0, otRest: 0, otHoliday: 0, incentive: 3000, bonus: 0, epfEmp: 4640, loanDed: 0, noPay: 0, lateDed: 0, mealDed: 0, advance: 0 },
];

const MONTHS = ['2026-02', '2026-01', '2025-12'];
const DEPTS = ['All', 'IT', 'Finance', 'Production', 'HR', 'Admin', 'Logistics'];

const fmt = (n: number) => n.toLocaleString('en-LK');

function calcRow(r: PayrollRow) {
    const grossEarnings = r.basic + r.budgetary + r.attendance + r.fixed
        + r.otNormal + r.otRest + r.otHoliday + r.incentive + r.bonus;
    const totalDed = r.epfEmp + r.loanDed + r.noPay + r.lateDed + r.mealDed + r.advance;
    const netPay = grossEarnings - totalDed;
    const epfEr = Math.round(r.basic * 0.12);
    const etf = Math.round(r.basic * 0.03);
    return { grossEarnings, totalDed, netPay, epfEr, etf };
}

export default function PayrollSummary() {
    const [month, setMonth] = useState('2026-02');
    const [dept, setDept] = useState('All');
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return PAYROLL.filter(r =>
            (dept === 'All' || r.dept === dept) &&
            (!q || r.empName.toLowerCase().includes(q) || r.empNo.toLowerCase().includes(q))
        );
    }, [dept, search]);

    const totals = useMemo(() => ({
        gross: filtered.reduce((s, r) => s + calcRow(r).grossEarnings, 0),
        ded: filtered.reduce((s, r) => s + calcRow(r).totalDed, 0),
        net: filtered.reduce((s, r) => s + calcRow(r).netPay, 0),
        epfEr: filtered.reduce((s, r) => s + calcRow(r).epfEr, 0),
        etf: filtered.reduce((s, r) => s + calcRow(r).etf, 0),
    }), [filtered]);

    return (
        <div className={styles.root}>
            {/* ── Header Stats ── */}
            <div className={styles.statsRow}>
                {[
                    { label: 'Total Gross', value: totals.gross, color: 'var(--color-primary)', icon: <TrendingUp size={18} /> },
                    { label: 'Total Deductions', value: totals.ded, color: 'var(--color-danger)', icon: <TrendingDown size={18} /> },
                    { label: 'Net Payable', value: totals.net, color: 'var(--color-success)', icon: <DollarSign size={18} /> },
                    { label: 'EPF Employer Contribution', value: totals.epfEr, color: 'var(--color-info)', icon: <Users size={18} /> },
                    { label: 'ETF Employer', value: totals.etf, color: 'var(--color-purple)', icon: <Users size={18} /> },
                ].map(s => (
                    <div key={s.label} className={styles.statCard}>
                        <span className={styles.statIcon} style={{ color: s.color, background: s.color + '18' }}>{s.icon}</span>
                        <div>
                            <span className={styles.statValue} style={{ color: s.color }}>LKR {fmt(s.value)}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                    <Search size={15} className={styles.searchIcon} />
                    <input id="payroll-search" type="text" placeholder="Search employee…" value={search}
                        onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
                </div>
                <div className={styles.toolbarRight}>
                    <select id="payroll-dept" className={styles.filterSel} value={dept} onChange={e => setDept(e.target.value)}>
                        {DEPTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <select id="payroll-month" className={styles.filterSel} value={month} onChange={e => setMonth(e.target.value)}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export Excel</Button>
                </div>
            </div>

            {/* ── Table ── */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Employee</th>
                            <th className={styles.th}>Basic</th>
                            <th className={styles.th}>Allowances</th>
                            <th className={styles.th}>OT</th>
                            <th className={styles.th}>Gross</th>
                            <th className={styles.th}>Deductions</th>
                            <th className={styles.th}>Net Pay</th>
                            <th className={styles.th}>EPF Er / ETF</th>
                            <th className={styles.th}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => {
                            const c = calcRow(r);
                            const totalOT = r.otNormal + r.otRest + r.otHoliday;
                            const totalAllowance = r.budgetary + r.attendance + r.fixed + r.incentive + r.bonus;
                            const isExp = expanded === r.empNo;
                            return (
                                <React.Fragment key={r.empNo}>
                                    <tr className={styles.row}>
                                        <td className={styles.td}>
                                            <div className={styles.nameCell}>
                                                <div className={styles.avatar}>{r.empName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                                <div>
                                                    <span className={styles.empId}>{r.empNo}</span>
                                                    <span className={styles.empName}>{r.empName}</span>
                                                    <span className={styles.empMeta}>{r.dept}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`${styles.td} ${styles.money}`}>{fmt(r.basic)}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{totalAllowance > 0 ? <span className={styles.positive}>+{fmt(totalAllowance)}</span> : <span className={styles.na}>—</span>}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{totalOT > 0 ? <span className={styles.positive}>+{fmt(totalOT)}</span> : <span className={styles.na}>—</span>}</td>
                                        <td className={`${styles.td} ${styles.moneyBold}`}>{fmt(c.grossEarnings)}</td>
                                        <td className={`${styles.td} ${styles.money}`}>{c.totalDed > 0 ? <span className={styles.negative}>-{fmt(c.totalDed)}</span> : <span className={styles.na}>—</span>}</td>
                                        <td className={`${styles.td} ${styles.netPay}`}>{fmt(c.netPay)}</td>
                                        <td className={`${styles.td} ${styles.money}`}>
                                            <span className={styles.epfInfo}>{fmt(c.epfEr)} / {fmt(c.etf)}</span>
                                        </td>
                                        <td className={styles.td}>
                                            <button id={`expand-payroll-${r.empNo}`} className={styles.expandBtn}
                                                onClick={() => setExpanded(isExp ? null : r.empNo)}>
                                                {isExp ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Details
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded Breakdown Row */}
                                    {isExp && (
                                        <tr className={styles.breakdownRow}>
                                            <td colSpan={9} className={styles.breakdownCell}>
                                                <div className={styles.breakdownGrid}>
                                                    {/* Earnings */}
                                                    <div className={styles.breakdownSection}>
                                                        <span className={styles.bsTitle}>Earnings</span>
                                                        {[
                                                            { label: 'Basic Salary', value: r.basic },
                                                            { label: 'Budgetary Allowance', value: r.budgetary, skip: !r.budgetary },
                                                            { label: 'Attendance Allowance', value: r.attendance, skip: !r.attendance },
                                                            { label: 'Fixed Allowances', value: r.fixed, skip: !r.fixed },
                                                            { label: 'OT — Normal (1.5×)', value: r.otNormal, skip: !r.otNormal },
                                                            { label: 'OT — Rest Day (2.0×)', value: r.otRest, skip: !r.otRest },
                                                            { label: 'OT — Holiday (2.5×)', value: r.otHoliday, skip: !r.otHoliday },
                                                            { label: 'Incentive', value: r.incentive, skip: !r.incentive },
                                                            { label: 'Bonus', value: r.bonus, skip: !r.bonus },
                                                        ].filter(x => !x.skip).map(x => (
                                                            <div key={x.label} className={styles.bsItem}>
                                                                <span>{x.label}</span>
                                                                <span className={styles.bsPos}>+ {fmt(x.value)}</span>
                                                            </div>
                                                        ))}
                                                        <div className={styles.bsTotal}>
                                                            <span>Gross Earnings</span><span>LKR {fmt(c.grossEarnings)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Deductions */}
                                                    <div className={styles.breakdownSection}>
                                                        <span className={styles.bsTitle}>Deductions</span>
                                                        {[
                                                            { label: 'EPF (Employee 8%)', value: r.epfEmp, skip: !r.epfEmp },
                                                            { label: 'Loan Installment', value: r.loanDed, skip: !r.loanDed },
                                                            { label: 'No Pay', value: r.noPay, skip: !r.noPay },
                                                            { label: 'Late Penalty', value: r.lateDed, skip: !r.lateDed },
                                                            { label: 'Meal Deduction', value: r.mealDed, skip: !r.mealDed },
                                                            { label: 'Advance Recovery', value: r.advance, skip: !r.advance },
                                                        ].filter(x => !x.skip).map(x => (
                                                            <div key={x.label} className={styles.bsItem}>
                                                                <span>{x.label}</span>
                                                                <span className={styles.bsNeg}>- {fmt(x.value)}</span>
                                                            </div>
                                                        ))}
                                                        {c.totalDed === 0 && <div className={styles.bsEmpty}>No deductions</div>}
                                                        <div className={styles.bsTotal}>
                                                            <span>Total Deductions</span><span>LKR {fmt(c.totalDed)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Summary */}
                                                    <div className={styles.breakdownSection}>
                                                        <span className={styles.bsTitle}>Summary</span>
                                                        <div className={styles.bsItem}><span>Gross Earnings</span><span>{fmt(c.grossEarnings)}</span></div>
                                                        <div className={styles.bsItem}><span>Total Deductions</span><span className={styles.bsNeg}>{fmt(c.totalDed)}</span></div>
                                                        <div className={`${styles.bsTotal} ${styles.bsNetTotal}`}>
                                                            <span>Net Pay</span><span>LKR {fmt(c.netPay)}</span>
                                                        </div>
                                                        <div className={styles.bsDivider} />
                                                        <div className={styles.bsItem}><span>EPF — Employer 12%</span><span>{fmt(c.epfEr)}</span></div>
                                                        <div className={styles.bsItem}><span>ETF — Employer 3%</span><span>{fmt(c.etf)}</span></div>
                                                        <div className={styles.bsItem}>
                                                            <span>Total Employer Contribution</span>
                                                            <span className={styles.bsPos}>{fmt(c.epfEr + c.etf)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                    {/* Totals Footer */}
                    <tfoot>
                        <tr className={styles.footerRow}>
                            <td className={`${styles.td} ${styles.footerLabel}`}>TOTAL ({filtered.length} employees)</td>
                            <td className={styles.td} />
                            <td className={styles.td} />
                            <td className={styles.td} />
                            <td className={`${styles.td} ${styles.footerGross}`}>LKR {fmt(totals.gross)}</td>
                            <td className={`${styles.td} ${styles.footerDed}`}>LKR {fmt(totals.ded)}</td>
                            <td className={`${styles.td} ${styles.footerNet}`}>LKR {fmt(totals.net)}</td>
                            <td className={`${styles.td} ${styles.footerEpf}`}>{fmt(totals.epfEr)} / {fmt(totals.etf)}</td>
                            <td className={styles.td} />
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
