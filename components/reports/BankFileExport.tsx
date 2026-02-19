'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2, AlertCircle, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './BankFileExport.module.css';

/* ─── Types ─────────────────────────────────────────────── */
interface BankEmployee {
    empNo: string;
    empName: string;
    branch: string;
    accNo: string;
    netPay: number;
    verified: boolean;
}

interface BankGroup {
    bank: string;
    code: string;
    employees: BankEmployee[];
    totalAmount: number;
}

/* ─── Mock Data ─────────────────────────────────────────── */
const BANK_GROUPS: BankGroup[] = [
    {
        bank: 'Bank of Ceylon',
        code: 'BOC',
        totalAmount: 254083,
        employees: [
            { empNo: 'BT-001', empName: 'Kasun Perera', branch: 'Colombo 10', accNo: '1234567890', netPay: 90283, verified: true },
            { empNo: 'BT-004', empName: 'Nimali Jayawardene', branch: 'Nugegoda', accNo: '9988776655', netPay: 66800, verified: true },
            { empNo: 'BT-010', empName: 'Dilshan Rathnayake', branch: 'Maharagama', accNo: '5544332211', netPay: 47200, verified: false },
            { empNo: 'BT-011', empName: 'Malith Fernando', branch: 'Borella', accNo: '1122334455', netPay: 49800, verified: true },
        ],
    },
    {
        bank: 'Commercial Bank',
        code: 'COM',
        totalAmount: 346400,
        employees: [
            { empNo: 'BT-002', empName: 'Chamari Atapattu', branch: 'Maradana', accNo: '9876543210', netPay: 148400, verified: true },
            { empNo: 'BT-008', empName: 'Gayani Alwis', branch: 'Bambalapitiya', accNo: '1029384756', netPay: 73740, verified: true },
            { empNo: 'BT-012', empName: 'Saman Perera', branch: 'Dehiwala', accNo: '5647382910', netPay: 55660, verified: true },
            { empNo: 'BT-013', empName: 'Asha Kumari', branch: 'Kiribathgoda', accNo: '1928374650', netPay: 68600, verified: false },
        ],
    },
    {
        bank: "People's Bank",
        code: 'PPL',
        totalAmount: 130000,
        employees: [
            { empNo: 'BT-003', empName: 'Ajith Bandara', branch: 'Kandy', accNo: '5678901234', netPay: 46465, verified: true },
            { empNo: 'BT-014', empName: 'Chaminda Silva', branch: 'Kegalle', accNo: '6543219870', netPay: 38500, verified: true },
            { empNo: 'BT-015', empName: 'Piumi Jayasena', branch: 'Kurunegala', accNo: '9871236540', netPay: 45035, verified: true },
        ],
    },
    {
        bank: 'NSB',
        code: 'NSB',
        totalAmount: 38935,
        employees: [
            { empNo: 'BT-005', empName: 'Ruwan Fernando', branch: 'Gampaha', accNo: '6677889900', netPay: 38935, verified: true },
        ],
    },
    {
        bank: 'Sampath Bank',
        code: 'SMP',
        totalAmount: 60360,
        employees: [
            { empNo: 'BT-009', empName: 'Thilak Dissanayake', branch: 'Colombo 07', accNo: '1357924680', netPay: 60360, verified: true },
        ],
    },
    {
        bank: 'Hatton National Bank',
        code: 'HNB',
        totalAmount: 45800,
        employees: [
            { empNo: 'BT-006', empName: 'Sandya Kumari', branch: 'Negombo', accNo: '7418529630', netPay: 44900, verified: true },
            { empNo: 'BT-016', empName: 'Nuwan Rajapaksa', branch: 'Wennappuwa', accNo: '8529637410', netPay: 900, verified: false },
        ],
    },
];

const MONTHS = ['2026-02', '2026-01', '2025-12'];
const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');

export default function BankFileExport() {
    const [month, setMonth] = useState('2026-02');
    const [expanded, setExpanded] = useState<string | null>('BOC');
    const [exporting, setExporting] = useState<string | null>(null);

    const totalNet = BANK_GROUPS.reduce((s, g) => s + g.totalAmount, 0);
    const totalEmployees = BANK_GROUPS.reduce((s, g) => s + g.employees.length, 0);
    const unverifiedCount = BANK_GROUPS.flatMap(g => g.employees).filter(e => !e.verified).length;

    const handleExport = async (code: string) => {
        setExporting(code);
        await new Promise(r => setTimeout(r, 1200));
        setExporting(null);
    };

    const handleExportAll = async () => {
        setExporting('ALL');
        await new Promise(r => setTimeout(r, 1800));
        setExporting(null);
    };

    return (
        <div className={styles.root}>
            {/* ── Summary Bar ── */}
            <div className={styles.summaryBar}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Net Payable</span>
                    <span className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>{fmt(totalNet)}</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Employees</span>
                    <span className={styles.summaryValue}>{totalEmployees}</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Banks</span>
                    <span className={styles.summaryValue}>{BANK_GROUPS.length}</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Unverified Accounts</span>
                    <span className={styles.summaryValue} style={{ color: unverifiedCount > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
                        {unverifiedCount > 0 ? <><AlertCircle size={14} /> {unverifiedCount}</> : <><CheckCircle2 size={14} /> All clear</>}
                    </span>
                </div>
            </div>

            {/* ── Warnings ── */}
            {unverifiedCount > 0 && (
                <div className={styles.warningBanner}>
                    <AlertCircle size={16} className={styles.warnIcon} />
                    <span><strong>{unverifiedCount} employees</strong> have unverified bank account details. Please verify before exporting the bank file.</span>
                </div>
            )}

            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <div className={styles.filterGroup}>
                    <label htmlFor="bank-month" className={styles.filterLabel}>Payroll Month</label>
                    <select id="bank-month" className={styles.filterSel} value={month} onChange={e => setMonth(e.target.value)}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                    </select>
                </div>
                <div className={styles.toolbarRight}>
                    <Button
                        id="export-all-banks"
                        variant="primary"
                        size="sm"
                        icon={<Download size={15} />}
                        loading={exporting === 'ALL'}
                        onClick={handleExportAll}
                    >
                        Export All Banks
                    </Button>
                </div>
            </div>

            {/* ── Bank Groups ── */}
            <div className={styles.bankList}>
                {BANK_GROUPS.map(group => {
                    const isExp = expanded === group.code;
                    const anyUnverified = group.employees.some(e => !e.verified);

                    return (
                        <div key={group.code} className={styles.bankCard}>
                            {/* Bank Header */}
                            <div className={styles.bankHeader} onClick={() => setExpanded(isExp ? null : group.code)}>
                                <div className={styles.bankLeft}>
                                    <div className={styles.bankIcon}><Building2 size={20} /></div>
                                    <div>
                                        <span className={styles.bankName}>{group.bank}</span>
                                        <span className={styles.bankMeta}>{group.employees.length} employees · {fmt(group.totalAmount)}</span>
                                    </div>
                                </div>
                                <div className={styles.bankRight}>
                                    {anyUnverified
                                        ? <Badge variant="warning"><AlertCircle size={12} /> Unverified</Badge>
                                        : <Badge variant="success"><CheckCircle2 size={12} /> Ready</Badge>
                                    }
                                    <Button
                                        id={`export-bank-${group.code}`}
                                        variant="ghost"
                                        size="sm"
                                        icon={<Download size={13} />}
                                        loading={exporting === group.code}
                                        onClick={e => { e.stopPropagation(); handleExport(group.code); }}
                                    >
                                        Export {group.code}
                                    </Button>
                                    <button className={styles.expandBtn} onClick={e => { e.stopPropagation(); setExpanded(isExp ? null : group.code); }}>
                                        {isExp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Employee List */}
                            {isExp && (
                                <div className={styles.employeeTable}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th className={styles.th}>Emp No</th>
                                                <th className={styles.th}>Name</th>
                                                <th className={styles.th}>Branch</th>
                                                <th className={styles.th}>Account Number</th>
                                                <th className={styles.th}>Net Pay</th>
                                                <th className={styles.th}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.employees.map(emp => (
                                                <tr key={emp.empNo} className={`${styles.row} ${!emp.verified ? styles.rowUnverified : ''}`}>
                                                    <td className={`${styles.td} ${styles.mono}`}>{emp.empNo}</td>
                                                    <td className={styles.td}><span className={styles.empName}>{emp.empName}</span></td>
                                                    <td className={styles.td}>{emp.branch}</td>
                                                    <td className={`${styles.td} ${styles.accNo}`}>{emp.accNo}</td>
                                                    <td className={`${styles.td} ${styles.netPay}`}>{fmt(emp.netPay)}</td>
                                                    <td className={styles.td}>
                                                        {emp.verified
                                                            ? <Badge variant="success"><CheckCircle2 size={12} /> Verified</Badge>
                                                            : <Badge variant="warning"><AlertCircle size={12} /> Unverified</Badge>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className={styles.footerRow}>
                                                <td colSpan={4} className={`${styles.td} ${styles.footerLabel}`}>Bank Total</td>
                                                <td className={`${styles.td} ${styles.footerNet}`}>{fmt(group.totalAmount)}</td>
                                                <td className={styles.td} />
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
