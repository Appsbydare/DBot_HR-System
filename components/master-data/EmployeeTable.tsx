'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, Eye, Edit2, Trash2, AlertTriangle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './EmployeeTable.module.css';

/* ─── Types ─────────────────────────────────────────────── */
export interface Employee {
    id: string;
    empNo: string;
    fullName: string;
    nic: string;
    dept: string;
    section: string;
    designation: string;
    category: 'Shop & Office' | 'Assistant' | 'Management';
    joinDate: string;
    status: 'Active' | 'Probation' | 'Terminated';
    basic: number;
    alerts: ('probation' | 'retirement' | 'minwage')[];
}

/* ─── Mock Data ──────────────────────────────────────────── */
const MOCK_EMPLOYEES: Employee[] = [
    { id: '1', empNo: 'BT-001', fullName: 'Kasun Perera', nic: '901234567V', dept: 'IT', section: 'Development', designation: 'Software Developer', category: 'Management', joinDate: '2021-03-15', status: 'Active', basic: 85000, alerts: [] },
    { id: '2', empNo: 'BT-002', fullName: 'Chamari Atapattu', nic: '885432198V', dept: 'Finance', section: 'Accounts', designation: 'Regional Manager', category: 'Management', joinDate: '2019-07-01', status: 'Active', basic: 120000, alerts: [] },
    { id: '3', empNo: 'BT-003', fullName: 'Ajith Bandara', nic: '760987654V', dept: 'Production', section: 'Weaving', designation: 'Machinist', category: 'Shop & Office', joinDate: '2005-02-12', status: 'Active', basic: 42000, alerts: ['retirement'] },
    { id: '4', empNo: 'BT-004', fullName: 'Nimali Jayawardene', nic: '940123456V', dept: 'HR', section: 'Recruitment', designation: 'Accounts Officer', category: 'Management', joinDate: '2024-01-15', status: 'Probation', basic: 65000, alerts: ['probation'] },
    { id: '5', empNo: 'BT-005', fullName: 'Ruwan Fernando', nic: '870564321V', dept: 'Production', section: 'Dyeing', designation: 'Production Operator', category: 'Shop & Office', joinDate: '2018-06-10', status: 'Active', basic: 38000, alerts: ['minwage'] },
    { id: '6', empNo: 'BT-006', fullName: 'Sandya Kumari', nic: '920876543V', dept: 'Admin', section: 'Admin', designation: 'Admin Assistant', category: 'Assistant', joinDate: '2022-09-01', status: 'Active', basic: 45000, alerts: [] },
    { id: '7', empNo: 'BT-007', fullName: 'Pradeep Silva', nic: '830123789V', dept: 'Production', section: 'Finishing', designation: 'Senior Operator', category: 'Shop & Office', joinDate: '2010-04-20', status: 'Active', basic: 52000, alerts: [] },
    { id: '8', empNo: 'BT-008', fullName: 'Gayani Alwis', nic: '950234567V', dept: 'HR', section: 'Payroll', designation: 'HR Officer', category: 'Management', joinDate: '2023-08-15', status: 'Probation', basic: 72000, alerts: ['probation'] },
    { id: '9', empNo: 'BT-009', fullName: 'Thilak Dissanayake', nic: '780345678V', dept: 'Logistics', section: 'Warehouse', designation: 'Warehouse Supervisor', category: 'Assistant', joinDate: '2014-11-30', status: 'Active', basic: 58000, alerts: [] },
    { id: '10', empNo: 'BT-010', fullName: 'Dilani Rajapaksa', nic: '910456789V', dept: 'Production', section: 'Weaving', designation: 'Machine Operator', category: 'Shop & Office', joinDate: '2020-02-01', status: 'Active', basic: 36000, alerts: ['minwage'] },
    { id: '11', empNo: 'BT-011', fullName: 'Nalaka Gunawardena', nic: '860567890V', dept: 'IT', section: 'Support', designation: 'System Administrator', category: 'Management', joinDate: '2017-05-15', status: 'Active', basic: 95000, alerts: [] },
    { id: '12', empNo: 'BT-012', fullName: 'Madhavi Wickrama', nic: '970678901V', dept: 'Finance', section: 'Accounts', designation: 'Accounts Executive', category: 'Management', joinDate: '2024-06-01', status: 'Probation', basic: 68000, alerts: ['probation'] },
];

const DEPTS = ['All', ...Array.from(new Set(MOCK_EMPLOYEES.map(e => e.dept)))];
const CATS = ['All', 'Shop & Office', 'Assistant', 'Management'];
const STATUSES = ['All', 'Active', 'Probation', 'Terminated'];
const PAGE_SIZE = 8;

/* ─── Helpers ────────────────────────────────────────────── */
const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
    'Active': 'success', 'Probation': 'warning', 'Terminated': 'danger',
};

const CAT_VARIANT: Record<string, 'info' | 'purple' | 'default'> = {
    'Management': 'info', 'Assistant': 'purple', 'Shop & Office': 'default',
};

const formatCurrency = (n: number) =>
    'LKR ' + n.toLocaleString('en-LK', { minimumFractionDigits: 0 });

interface EmployeeTableProps {
    onAdd?: () => void;
    onEdit?: (emp: Employee) => void;
    onView?: (emp: Employee) => void;
}

export default function EmployeeTable({ onAdd, onEdit, onView }: EmployeeTableProps) {
    const [search, setSearch] = useState('');
    const [dept, setDept] = useState('All');
    const [cat, setCat] = useState('All');
    const [status, setStatus] = useState('All');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    /* Filter + search */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return MOCK_EMPLOYEES.filter(e => {
            const matchSearch = !q
                || e.fullName.toLowerCase().includes(q)
                || e.empNo.toLowerCase().includes(q)
                || e.nic.toLowerCase().includes(q)
                || e.designation.toLowerCase().includes(q);
            const matchDept = dept === 'All' || e.dept === dept;
            const matchCat = cat === 'All' || e.category === cat;
            const matchStatus = status === 'All' || e.status === status;
            return matchSearch && matchDept && matchCat && matchStatus;
        });
    }, [search, dept, cat, status]);

    /* Paginate */
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    /* Reset page on filter change */
    const handleFilter = (setter: (v: string) => void) => (v: string) => {
        setter(v); setPage(1);
    };

    /* Select all on current page */
    const allSelected = pageData.every(e => selected.has(e.id));
    const toggleAll = () => {
        if (allSelected) {
            const next = new Set(selected);
            pageData.forEach(e => next.delete(e.id));
            setSelected(next);
        } else {
            const next = new Set(selected);
            pageData.forEach(e => next.add(e.id));
            setSelected(next);
        }
    };

    const toggleOne = (id: string) => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    return (
        <div className={styles.root}>

            {/* ────── Header / Toolbar ────── */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <h2 className={styles.tableTitle}>Employees</h2>
                    <span className={styles.count}>{filtered.length} records</span>
                </div>
                <div className={styles.toolbarRight}>
                    <Button variant="ghost" size="sm" icon={<Download size={15} />}>Export</Button>
                    <Button variant="secondary" size="sm" icon={<Filter size={15} />}>Filter</Button>
                    <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={onAdd}>
                        Add Employee
                    </Button>
                </div>
            </div>

            {/* ────── Filters ────── */}
            <div className={styles.filters}>
                {/* Search */}
                <div className={styles.searchWrap}>
                    <Search size={15} className={styles.searchIcon} />
                    <input
                        id="employee-search"
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search name, EMP #, NIC…"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                <select id="dept-filter" className={styles.filterSelect} value={dept} onChange={e => handleFilter(setDept)(e.target.value)}>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                </select>

                <select id="cat-filter" className={styles.filterSelect} value={cat} onChange={e => handleFilter(setCat)(e.target.value)}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                </select>

                <select id="status-filter" className={styles.filterSelect} value={status} onChange={e => handleFilter(setStatus)(e.target.value)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* ────── Table ────── */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.thCheck}>
                                <input
                                    id="select-all-employees"
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    className={styles.checkbox}
                                />
                            </th>
                            <th className={styles.th}>Emp #</th>
                            <th className={styles.th}>Name</th>
                            <th className={styles.th}>Department</th>
                            <th className={styles.th}>Designation</th>
                            <th className={styles.th}>Category</th>
                            <th className={styles.th}>Basic Salary</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Alerts</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length === 0 ? (
                            <tr>
                                <td colSpan={10} className={styles.empty}>No employees match your filters.</td>
                            </tr>
                        ) : pageData.map(emp => (
                            <tr key={emp.id} className={`${styles.row} ${selected.has(emp.id) ? styles.rowSelected : ''}`}>
                                <td className={styles.tdCheck}>
                                    <input
                                        id={`select-emp-${emp.id}`}
                                        type="checkbox"
                                        checked={selected.has(emp.id)}
                                        onChange={() => toggleOne(emp.id)}
                                        className={styles.checkbox}
                                    />
                                </td>
                                <td className={`${styles.td} ${styles.tdEmpNo}`}>{emp.empNo}</td>
                                <td className={`${styles.td} ${styles.tdName}`}>
                                    <div className={styles.nameCell}>
                                        <span className={styles.avatar}>
                                            {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </span>
                                        <div>
                                            <span className={styles.name}>{emp.fullName}</span>
                                            <span className={styles.nic}>{emp.nic}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.td}>
                                    <span className={styles.dept}>{emp.dept}</span>
                                    <span className={styles.section}>{emp.section}</span>
                                </td>
                                <td className={styles.td}>{emp.designation}</td>
                                <td className={styles.td}>
                                    <Badge variant={CAT_VARIANT[emp.category]}>{emp.category}</Badge>
                                </td>
                                <td className={`${styles.td} ${styles.tdSalary}`}>{formatCurrency(emp.basic)}</td>
                                <td className={styles.td}>
                                    <Badge variant={STATUS_VARIANT[emp.status]} dot>{emp.status}</Badge>
                                </td>
                                <td className={styles.td}>
                                    <div className={styles.alerts}>
                                        {emp.alerts.includes('probation') && <span className={styles.alertBadge} title="Probation ending soon"><Clock size={13} /> Probation</span>}
                                        {emp.alerts.includes('retirement') && <span className={`${styles.alertBadge} ${styles.alertRetirement}`} title="Retirement age"><AlertTriangle size={13} /> Retirement</span>}
                                        {emp.alerts.includes('minwage') && <span className={`${styles.alertBadge} ${styles.alertMinwage}`} title="Below minimum wage"><AlertTriangle size={13} /> Min Wage</span>}
                                    </div>
                                </td>
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        <button id={`view-emp-${emp.id}`} className={styles.actionBtn} title="View" onClick={() => onView?.(emp)}><Eye size={15} /></button>
                                        <button id={`edit-emp-${emp.id}`} className={styles.actionBtn} title="Edit" onClick={() => onEdit?.(emp)}><Edit2 size={15} /></button>
                                        <button id={`del-emp-${emp.id}`} className={`${styles.actionBtn} ${styles.actionDelete}`} title="Delete"><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ────── Pagination ────── */}
            <div className={styles.pagination}>
                <span className={styles.pageInfo}>
                    Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className={styles.pageBtns}>
                    <button id="prev-page" className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            id={`page-${p}`}
                            key={p}
                            className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                            onClick={() => setPage(p)}
                        >{p}</button>
                    ))}
                    <button id="next-page" className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            </div>

        </div>
    );
}
