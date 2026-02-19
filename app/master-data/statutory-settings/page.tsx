'use client';

import React, { useState } from 'react';
import { Edit2, FileText, CreditCard, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmployeeForm from '@/components/master-data/EmployeeForm';
import type { Employee } from '@/components/master-data/EmployeeTable';
import styles from './page.module.css';

const EMPLOYEES: Employee[] = [
    { id: '1', empNo: 'BT-001', fullName: 'Kasun Perera', nic: '901234567V', dept: 'IT', section: 'Development', designation: 'Software Developer', category: 'Management', joinDate: '2021-03-15', status: 'Active', basic: 85000, alerts: [] },
    { id: '2', empNo: 'BT-002', fullName: 'Chamari Atapattu', nic: '885432198V', dept: 'Finance', section: 'Accounts', designation: 'Regional Manager', category: 'Management', joinDate: '2019-07-01', status: 'Active', basic: 120000, alerts: [] },
    { id: '3', empNo: 'BT-003', fullName: 'Ajith Bandara', nic: '760987654V', dept: 'Production', section: 'Weaving', designation: 'Machinist', category: 'Shop & Office', joinDate: '2005-02-12', status: 'Active', basic: 42000, alerts: [] },
    { id: '4', empNo: 'BT-004', fullName: 'Nimali Jayawardene', nic: '940123456V', dept: 'HR', section: 'Recruitment', designation: 'Accounts Officer', category: 'Management', joinDate: '2024-01-15', status: 'Probation', basic: 65000, alerts: [] },
    { id: '5', empNo: 'BT-005', fullName: 'Ruwan Fernando', nic: '870564321V', dept: 'Production', section: 'Dyeing', designation: 'Production Operator', category: 'Shop & Office', joinDate: '2018-06-10', status: 'Active', basic: 38000, alerts: [] },
    { id: '6', empNo: 'BT-006', fullName: 'Sandya Kumari', nic: '920876543V', dept: 'Admin', section: 'Admin', designation: 'Admin Assistant', category: 'Assistant', joinDate: '2022-09-01', status: 'Active', basic: 45000, alerts: [] },
    { id: '8', empNo: 'BT-008', fullName: 'Gayani Alwis', nic: '950234567V', dept: 'HR', section: 'Payroll', designation: 'HR Officer', category: 'Management', joinDate: '2023-08-15', status: 'Probation', basic: 72000, alerts: [] },
];

/* Mock statutory data */
const STATUTORY: Record<string, { epfEmp: number; epfEr: number; etf: number; bank: string; branch: string; accNo: string; method: string; tin?: string }> = {
    'BT-001': { epfEmp: 8, epfEr: 12, etf: 3, bank: 'Bank of Ceylon', branch: 'Colombo 10', accNo: '1234567890', method: 'Bank Transfer' },
    'BT-002': { epfEmp: 8, epfEr: 12, etf: 3, bank: 'Commercial Bank', branch: 'Maradana', accNo: '9876543210', method: 'Bank Transfer', tin: 'TIN-4567' },
    'BT-003': { epfEmp: 8, epfEr: 12, etf: 3, bank: 'People\'s Bank', branch: 'Kandy', accNo: '5678901234', method: 'Cash' },
    'BT-004': { epfEmp: 8, epfEr: 12, etf: 3, bank: 'HNB', branch: 'Nugegoda', accNo: '1122334455', method: 'Bank Transfer' },
    'BT-005': { epfEmp: 8, epfEr: 12, etf: 3, bank: 'NSB', branch: 'Gampaha', accNo: '6677889900', method: 'Cash' },
    'BT-006': { epfEmp: 8, epfEr: 12, etf: 3, bank: 'Sampath Bank', branch: 'Colombo 07', accNo: '1357924680', method: 'Bank Transfer' },
    'BT-008': { epfEmp: 8, epfEr: 12, etf: 3, bank: 'Nations Trust', branch: 'Kollupitiya', accNo: '2468013579', method: 'Bank Transfer' },
};

export default function StatutorySettingsPage() {
    const [editing, setEditing] = useState<Employee | undefined>(undefined);
    const [showForm, setShowForm] = useState(false);
    const handleEdit = (emp: Employee) => { setEditing(emp); setShowForm(true); };
    const handleClose = () => { setEditing(undefined); setShowForm(false); };

    const bankTransfer = Object.values(STATUTORY).filter(s => s.method === 'Bank Transfer').length;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Statutory Settings</h1>
                    <p className={styles.pageSubtitle}>
                        EPF/ETF contribution rates, bank payment details, and tax (APIT) configuration per employee.
                    </p>
                </div>
                <Button variant="primary" size="sm" icon={<FileText size={15} />}>Export EPF Report</Button>
            </div>

            {/* ── Summary ── */}
            <div className={styles.statsRow}>
                {[
                    { label: 'EPF Registered', value: Object.keys(STATUTORY).length, color: 'var(--color-success)', icon: <FileText size={16} /> },
                    { label: 'Bank Transfer', value: bankTransfer, color: 'var(--color-info)', icon: <CreditCard size={16} /> },
                    { label: 'Cash Payment', value: Object.values(STATUTORY).filter(s => s.method === 'Cash').length, color: 'var(--color-warning)', icon: <Building2 size={16} /> },
                    { label: 'TIN Registered', value: Object.values(STATUTORY).filter(s => s.tin).length, color: 'var(--color-primary)', icon: <FileText size={16} /> },
                ].map(s => (
                    <div key={s.label} className={styles.statCard}>
                        <span className={styles.statIcon} style={{ color: s.color, background: s.color + '18' }}>{s.icon}</span>
                        <div>
                            <span className={styles.statValue}>{s.value}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Table ── */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Employee</th>
                            <th className={styles.th}>EPF Emp %</th>
                            <th className={styles.th}>EPF Er %</th>
                            <th className={styles.th}>ETF %</th>
                            <th className={styles.th}>Bank</th>
                            <th className={styles.th}>Branch</th>
                            <th className={styles.th}>Account No.</th>
                            <th className={styles.th}>Method</th>
                            <th className={styles.th}>TIN</th>
                            <th className={styles.th}>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EMPLOYEES.map(emp => {
                            const s = STATUTORY[emp.empNo];
                            return (
                                <tr key={emp.id} className={styles.row}>
                                    <td className={styles.td}>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>{emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                            <div>
                                                <span className={styles.empName}>{emp.fullName}</span>
                                                <span className={styles.empNo}>{emp.empNo}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`${styles.td} ${styles.rate}`}>{s?.epfEmp ?? '—'}%</td>
                                    <td className={`${styles.td} ${styles.rate}`}>{s?.epfEr ?? '—'}%</td>
                                    <td className={`${styles.td} ${styles.rate}`}>{s?.etf ?? '—'}%</td>
                                    <td className={styles.td}>{s?.bank ?? '—'}</td>
                                    <td className={styles.td}>{s?.branch ?? '—'}</td>
                                    <td className={`${styles.td} ${styles.mono}`}>{s?.accNo ?? '—'}</td>
                                    <td className={styles.td}>
                                        <Badge variant={s?.method === 'Bank Transfer' ? 'info' : 'warning'} dot>{s?.method ?? '—'}</Badge>
                                    </td>
                                    <td className={`${styles.td} ${styles.mono}`}>{s?.tin ?? <span className={styles.na}>N/A</span>}</td>
                                    <td className={styles.td}>
                                        <button id={`edit-statutory-${emp.id}`} className={styles.editBtn} onClick={() => handleEdit(emp)} title="Edit Statutory">
                                            <Edit2 size={14} /> Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showForm && <EmployeeForm employee={editing} onClose={handleClose} initialTab="statutory" />}
        </div>
    );
}
