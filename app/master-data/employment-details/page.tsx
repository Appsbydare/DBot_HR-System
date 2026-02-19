'use client';

import React, { useState } from 'react';
import { Edit2, Calendar, Users, Briefcase } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmployeeForm from '@/components/master-data/EmployeeForm';
import type { Employee } from '@/components/master-data/EmployeeTable';
import styles from './page.module.css';

/* ─── Mock Data (reuse subset) ───────────────────────────── */
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

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const yearsOf = (s: string) => {
    const diff = Date.now() - new Date(s).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
};

const CAT_VARIANT: Record<string, 'info' | 'purple' | 'default'> = {
    Management: 'info', Assistant: 'purple', 'Shop & Office': 'default',
};
const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
    Active: 'success', Probation: 'warning', Terminated: 'danger',
};

export default function EmploymentDetailsPage() {
    const [editing, setEditing] = useState<Employee | undefined>(undefined);
    const [showForm, setShowForm] = useState(false);

    const handleEdit = (emp: Employee) => { setEditing(emp); setShowForm(true); };
    const handleClose = () => { setEditing(undefined); setShowForm(false); };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Employment Details</h1>
                    <p className={styles.pageSubtitle}>
                        Department, section, designation, category, join dates, and employment status for all employees.
                    </p>
                </div>
                <Button variant="primary" size="sm" icon={<Briefcase size={15} />}>Bulk Update</Button>
            </div>

            {/* ── Summary Stats ── */}
            <div className={styles.statsRow}>
                {[
                    { label: 'Active', value: EMPLOYEES.filter(e => e.status === 'Active').length, color: 'var(--color-success)', icon: <Users size={18} /> },
                    { label: 'Probation', value: EMPLOYEES.filter(e => e.status === 'Probation').length, color: 'var(--color-warning)', icon: <Calendar size={18} /> },
                    { label: 'Departments', value: new Set(EMPLOYEES.map(e => e.dept)).size, color: 'var(--color-info)', icon: <Briefcase size={18} /> },
                    { label: 'Avg. Tenure', value: `${Math.round(EMPLOYEES.reduce((a, e) => a + yearsOf(e.joinDate), 0) / EMPLOYEES.length)}y`, color: 'var(--color-primary)', icon: <Calendar size={18} /> },
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
                            <th className={styles.th}>Department · Section</th>
                            <th className={styles.th}>Designation</th>
                            <th className={styles.th}>Category</th>
                            <th className={styles.th}>Joined</th>
                            <th className={styles.th}>Tenure</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EMPLOYEES.map(emp => (
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
                                <td className={styles.td}>
                                    <span className={styles.dept}>{emp.dept}</span>
                                    <span className={styles.section}>{emp.section}</span>
                                </td>
                                <td className={styles.td}>{emp.designation}</td>
                                <td className={styles.td}><Badge variant={CAT_VARIANT[emp.category]}>{emp.category}</Badge></td>
                                <td className={styles.td}><span className={styles.date}>{fmtDate(emp.joinDate)}</span></td>
                                <td className={styles.td}><span className={styles.tenure}>{yearsOf(emp.joinDate)}y</span></td>
                                <td className={styles.td}><Badge variant={STATUS_VARIANT[emp.status]} dot>{emp.status}</Badge></td>
                                <td className={styles.td}>
                                    <button id={`edit-emp-detail-${emp.id}`} className={styles.editBtn} onClick={() => handleEdit(emp)} title="Edit Employment Details">
                                        <Edit2 size={14} /> Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <EmployeeForm employee={editing} onClose={handleClose} initialTab="employment" />
            )}
        </div>
    );
}
