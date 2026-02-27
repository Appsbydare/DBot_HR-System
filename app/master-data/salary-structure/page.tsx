'use client';

import React, { useState } from 'react';
import { Edit2, DollarSign, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmployeeForm from '@/components/master-data/EmployeeForm';
import type { Employee } from '@/components/master-data/EmployeeTable';
import styles from './page.module.css';

const EMPLOYEES: Employee[] = [
    { id: '1', empNo: 'BT-001', fullName: 'Kasun Perera', nic: '901234567V', dept: 'IT', section: 'Development', designation: 'Software Developer', category: 'Management', joinDate: '2021-03-15', status: 'Active', basic: 85000, alerts: [] },
    { id: '2', empNo: 'BT-002', fullName: 'Chamari Atapattu', nic: '885432198V', dept: 'Finance', section: 'Accounts', designation: 'Regional Manager', category: 'Management', joinDate: '2019-07-01', status: 'Active', basic: 120000, alerts: [] },
    { id: '3', empNo: 'BT-003', fullName: 'Ajith Bandara', nic: '760987654V', dept: 'Production', section: 'Weaving', designation: 'Machinist', category: 'Shop & Office', joinDate: '2005-02-12', status: 'Active', basic: 42000, alerts: ['retirement'] },
    { id: '4', empNo: 'BT-004', fullName: 'Nimali Jayawardene', nic: '940123456V', dept: 'HR', section: 'Recruitment', designation: 'Accounts Officer', category: 'Management', joinDate: '2024-01-15', status: 'Probation', basic: 65000, alerts: ['probation'] },
    { id: '5', empNo: 'BT-005', fullName: 'Ruwan Fernando', nic: '870564321V', dept: 'Production', section: 'Dyeing', designation: 'Production Operator', category: 'Shop & Office', joinDate: '2018-06-10', status: 'Active', basic: 38000, alerts: ['minwage'] },
    { id: '6', empNo: 'BT-006', fullName: 'Sandya Kumari', nic: '920876543V', dept: 'Admin', section: 'Admin', designation: 'Admin Assistant', category: 'Assistant', joinDate: '2022-09-01', status: 'Active', basic: 45000, alerts: [] },
    { id: '8', empNo: 'BT-008', fullName: 'Gayani Alwis', nic: '950234567V', dept: 'HR', section: 'Payroll', designation: 'HR Officer', category: 'Management', joinDate: '2023-08-15', status: 'Probation', basic: 72000, alerts: ['probation'] },
    { id: '9', empNo: 'BT-009', fullName: 'Thilak Dissanayake', nic: '780345678V', dept: 'Logistics', section: 'Warehouse', designation: 'Warehouse Supervisor', category: 'Assistant', joinDate: '2014-11-30', status: 'Active', basic: 58000, alerts: [] },
];

/* Fake derived salary data */
const SALARY_DATA: Record<string, { budgetary: number; attendance: number; fixed: number; epf: boolean; etf: boolean; ot: boolean }> = {
    'BT-001': { budgetary: 5000, attendance: 3000, fixed: 2500, epf: true, etf: true, ot: true },
    'BT-002': { budgetary: 8000, attendance: 5000, fixed: 10000, epf: true, etf: true, ot: false },
    'BT-003': { budgetary: 2500, attendance: 2000, fixed: 0, epf: true, etf: true, ot: true },
    'BT-004': { budgetary: 4000, attendance: 3000, fixed: 0, epf: true, etf: true, ot: false },
    'BT-005': { budgetary: 2000, attendance: 1500, fixed: 0, epf: true, etf: true, ot: true },
    'BT-006': { budgetary: 3000, attendance: 2500, fixed: 0, epf: true, etf: true, ot: false },
    'BT-008': { budgetary: 4500, attendance: 3000, fixed: 0, epf: true, etf: true, ot: false },
    'BT-009': { budgetary: 3500, attendance: 2500, fixed: 1500, epf: true, etf: true, ot: true },
};

const fmt = (n: number) => 'LKR ' + n.toLocaleString('en-LK');
const totalGross = EMPLOYEES.reduce((acc, e) => {
    const s = SALARY_DATA[e.empNo];
    return acc + e.basic + (s?.budgetary || 0) + (s?.attendance || 0) + (s?.fixed || 0);
}, 0);

export default function SalaryStructurePage() {
    const [editing, setEditing] = useState<Employee | undefined>(undefined);
    const [showForm, setShowForm] = useState(false);
    const handleEdit = (emp: Employee) => { setEditing(emp); setShowForm(true); };
    const handleClose = () => { setEditing(undefined); setShowForm(false); };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Salary Structure Setup</h1>
                    <p className={styles.pageSubtitle}>
                        Configure basic salary, allowances, and statutory contribution flags per employee.
                    </p>
                </div>
                <Button variant="primary" size="sm" icon={<DollarSign size={15} />}>Bulk Salary Update</Button>
            </div>

            {/* ── Summary ── */}
            <div className={styles.statsRow}>
                {[
                    { label: 'Total Gross Payroll', value: fmt(totalGross), color: 'var(--color-primary)' },
                    { label: 'EPF Applicable', value: Object.values(SALARY_DATA).filter(s => s.epf).length.toString(), unit: 'employees', color: 'var(--color-success)' },
                    { label: 'OT Applicable', value: Object.values(SALARY_DATA).filter(s => s.ot).length.toString(), unit: 'employees', color: 'var(--color-warning)' },
                    { label: 'Min Wage Alerts', value: EMPLOYEES.filter(e => e.alerts.includes('minwage')).length.toString(), color: 'var(--color-danger)' },
                ].map(s => (
                    <div key={s.label} className={styles.statCard}>
                        <span className={styles.statIcon} style={{ color: s.color, background: s.color + '18' }}>
                            <DollarSign size={18} />
                        </span>
                        <div>
                            <div className={styles.statValueWrapper}>
                                <span className={styles.statValue}>{s.value}</span>
                                {s.unit && <span className={styles.statUnit}>{s.unit}</span>}
                            </div>
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
                            <th className={styles.th}>Basic (LKR)</th>
                            <th className={styles.th}>Budgetary</th>
                            <th className={styles.th}>Attendance</th>
                            <th className={styles.th}>Fixed Allow.</th>
                            <th className={styles.th}>Total Gross</th>
                            <th className={styles.th}>EPF</th>
                            <th className={styles.th}>OT</th>
                            <th className={styles.th}>Alerts</th>
                            <th className={styles.th}>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EMPLOYEES.map(emp => {
                            const s = SALARY_DATA[emp.empNo] || { budgetary: 0, attendance: 0, fixed: 0, epf: false, etf: false, ot: false };
                            const gross = emp.basic + s.budgetary + s.attendance + s.fixed;
                            const minWage = emp.alerts.includes('minwage');
                            return (
                                <tr key={emp.id} className={`${styles.row} ${minWage ? styles.alertRow : ''}`}>
                                    <td className={styles.td}>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>{emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                            <div>
                                                <span className={styles.empName}>{emp.fullName}</span>
                                                <span className={styles.empNo}>{emp.empNo} · {emp.dept}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`${styles.td} ${styles.money}`}>{emp.basic.toLocaleString('en-LK')}</td>
                                    <td className={`${styles.td} ${styles.money}`}>{s.budgetary.toLocaleString('en-LK')}</td>
                                    <td className={`${styles.td} ${styles.money}`}>{s.attendance.toLocaleString('en-LK')}</td>
                                    <td className={`${styles.td} ${styles.money}`}>{s.fixed.toLocaleString('en-LK')}</td>
                                    <td className={`${styles.td} ${styles.moneyBold}`}>{gross.toLocaleString('en-LK')}</td>
                                    <td className={styles.td}>{s.epf ? <CheckCircle size={16} className={styles.iconYes} /> : <span className={styles.iconNo}>—</span>}</td>
                                    <td className={styles.td}>{s.ot ? <CheckCircle size={16} className={styles.iconYes} /> : <span className={styles.iconNo}>—</span>}</td>
                                    <td className={styles.td}>
                                        {minWage && <Badge variant="danger" dot>Min Wage</Badge>}
                                    </td>
                                    <td className={styles.td}>
                                        <button id={`edit-salary-${emp.id}`} className={styles.editBtn} onClick={() => handleEdit(emp)} title="Edit Salary">
                                            <Edit2 size={14} /> Edit
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showForm && <EmployeeForm employee={editing} onClose={handleClose} initialTab="salary" />}
        </div>
    );
}
