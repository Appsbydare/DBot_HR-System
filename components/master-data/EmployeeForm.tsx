'use client';

import React, { useState } from 'react';
import { X, User, Briefcase, DollarSign, FileText, Save } from 'lucide-react';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import Input, { Select, Textarea } from '@/components/ui/Input';
import type { Employee } from './EmployeeTable';
import styles from './EmployeeForm.module.css';

interface EmployeeFormProps {
    employee?: Employee;
    onClose: () => void;
    onSave?: (data: Partial<Employee>) => void;
    initialTab?: 'personal' | 'employment' | 'salary' | 'statutory';
}

const FORM_TABS = [
    { id: 'personal', label: 'Personal', icon: <User size={15} /> },
    { id: 'employment', label: 'Employment', icon: <Briefcase size={15} /> },
    { id: 'salary', label: 'Salary', icon: <DollarSign size={15} /> },
    { id: 'statutory', label: 'Statutory', icon: <FileText size={15} /> },
];

export default function EmployeeForm({ employee, onClose, onSave, initialTab = 'personal' }: EmployeeFormProps) {
    const isEdit = !!employee;
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800)); // simulate save
        setSaving(false);
        onSave?.({});
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>

                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
                        {isEdit && <p className={styles.subtitle}>{employee.empNo} · {employee.fullName}</p>}
                    </div>
                    <button id="close-employee-form" className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className={styles.body}>
                    <Tabs tabs={FORM_TABS} defaultTab={initialTab}>
                        {(activeTab) => (
                            <>
                                {/* ──── Personal Info ──── */}
                                {activeTab === 'personal' && (
                                    <div className={styles.tabContent}>
                                        <div className={styles.photoSection}>
                                            <div className={styles.photoPlaceholder}>
                                                <User size={32} />
                                            </div>
                                            <div>
                                                <p className={styles.photoLabel}>Employee Photo</p>
                                                <Button variant="secondary" size="sm">Upload Photo</Button>
                                                <p className={styles.photoHint}>JPG or PNG, max 2MB</p>
                                            </div>
                                        </div>
                                        <div className={styles.formGrid}>
                                            <Input label="Employee Number" id="emp-no" defaultValue={employee?.empNo} placeholder="e.g. BT-013" required />
                                            <Input label="Full Name" id="full-name" defaultValue={employee?.fullName} placeholder="As per NIC" required />
                                            <Input label="NIC Number" id="nic" defaultValue={employee?.nic} placeholder="e.g. 901234567V" required />
                                            <Input label="Date of Birth" id="dob" type="date" required />
                                            <Select label="Gender" id="gender" required>
                                                <option value="">Select gender</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </Select>
                                            <Select label="Marital Status" id="marital-status">
                                                <option value="">Select status</option>
                                                <option>Single</option>
                                                <option>Married</option>
                                                <option>Divorced</option>
                                                <option>Widowed</option>
                                            </Select>
                                            <Input label="Mobile Number" id="mobile" type="tel" placeholder="+94 7X XXX XXXX" required />
                                            <Input label="Email (Optional)" id="email" type="email" placeholder="name@example.com" />
                                            <div className={styles.fullWidth}>
                                                <Textarea label="Permanent Address" id="address" rows={2} placeholder="No, Street, City, Province" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ──── Employment Details ──── */}
                                {activeTab === 'employment' && (
                                    <div className={styles.tabContent}>
                                        <div className={styles.formGrid}>
                                            <Select label="Department" id="dept" required>
                                                <option value="">Select department</option>
                                                {['IT', 'Finance', 'HR', 'Production', 'Logistics', 'Admin'].map(d => <option key={d}>{d}</option>)}
                                            </Select>
                                            <Select label="Section" id="section">
                                                <option value="">Select section</option>
                                                {['Development', 'Accounts', 'Payroll', 'Weaving', 'Dyeing', 'Finishing', 'Warehouse'].map(s => <option key={s}>{s}</option>)}
                                            </Select>
                                            <Input label="Designation" id="designation" placeholder="e.g. Software Developer" required />
                                            <Select label="Category" id="category" required>
                                                <option value="">Select category</option>
                                                <option>Shop & Office</option>
                                                <option>Assistant</option>
                                                <option>Management</option>
                                            </Select>
                                            <Select label="Act Category" id="act-category">
                                                <option value="">Select act</option>
                                                <option>Wages Board</option>
                                                <option>SLEA</option>
                                                <option>N/A</option>
                                            </Select>
                                            <Select label="Employment Status" id="emp-status">
                                                <option>Active</option>
                                                <option>Probation</option>
                                                <option>Terminated</option>
                                                <option>Resigned</option>
                                            </Select>
                                            <Input label="Joined Date" id="join-date" type="date" required />
                                            <Input label="Probation End Date" id="probation-end" type="date" />
                                            <Input label="Supervisor" id="supervisor" placeholder="Supervisor name" />
                                            <Input label="Cost Center" id="cost-center" placeholder="e.g. CC-001" />
                                        </div>
                                    </div>
                                )}

                                {/* ──── Salary Structure ──── */}
                                {activeTab === 'salary' && (
                                    <div className={styles.tabContent}>
                                        <div className={styles.formGrid}>
                                            <Input label="Basic Salary (LKR)" id="basic" type="number" placeholder="0.00" required />
                                            <Input label="Budgetary Allowance (LKR)" id="budgetary" type="number" placeholder="0.00" />
                                            <Input label="Attendance Allowance (LKR)" id="attendance-allow" type="number" placeholder="0.00" />
                                            <Input label="Fixed Allowances (LKR)" id="fixed-allow" type="number" placeholder="0.00" />
                                        </div>
                                        <div className={styles.sectionDivider}>
                                            <span>Contribution Flags</span>
                                        </div>
                                        <div className={styles.flagsGrid}>
                                            {[
                                                { id: 'epf-flag', label: 'EPF Applicable' },
                                                { id: 'etf-flag', label: 'ETF Applicable' },
                                                { id: 'ot-flag', label: 'OT Applicable' },
                                                { id: 'tax-flag', label: 'Tax Applicable' },
                                                { id: 'nopay-flag', label: 'No-Pay Deduction' },
                                                { id: 'meal-flag', label: 'Meal Allowance' },
                                            ].map(f => (
                                                <label key={f.id} className={styles.flagItem} htmlFor={f.id}>
                                                    <input id={f.id} type="checkbox" className={styles.flagCheck} defaultChecked={f.id.includes('epf') || f.id.includes('etf')} />
                                                    <span>{f.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className={styles.sectionDivider}><span>OT Rates</span></div>
                                        <div className={styles.formGrid}>
                                            <Input label="Normal Day OT Rate (×)" id="ot-normal" type="number" placeholder="1.5" defaultValue="1.5" />
                                            <Input label="Rest Day OT Rate (×)" id="ot-restday" type="number" placeholder="2.0" defaultValue="2.0" />
                                            <Input label="Holiday OT Rate (×)" id="ot-holiday" type="number" placeholder="2.5" defaultValue="2.5" />
                                        </div>
                                    </div>
                                )}

                                {/* ──── Statutory Settings ──── */}
                                {activeTab === 'statutory' && (
                                    <div className={styles.tabContent}>
                                        <div className={styles.sectionDivider}><span>EPF / ETF</span></div>
                                        <div className={styles.formGrid}>
                                            <Input label="EPF Employee %" id="epf-emp" type="number" placeholder="8" defaultValue="8" />
                                            <Input label="EPF Employer %" id="epf-er" type="number" placeholder="12" defaultValue="12" />
                                            <Input label="ETF Employer %" id="etf-rate" type="number" placeholder="3" defaultValue="3" />
                                            <Select label="Payment Frequency" id="freq">
                                                <option>Monthly</option>
                                                <option>Bi-monthly</option>
                                                <option>Weekly</option>
                                            </Select>
                                        </div>
                                        <div className={styles.sectionDivider}><span>Bank Details</span></div>
                                        <div className={styles.formGrid}>
                                            <Input label="Bank Name" id="bank-name" placeholder="e.g. Bank of Ceylon" />
                                            <Input label="Branch" id="bank-branch" placeholder="e.g. Colombo 10" />
                                            <Input label="Account Number" id="bank-acc" placeholder="XXXX XXXX XXXX" />
                                            <Select label="Payment Method" id="pay-method">
                                                <option>Bank Transfer</option>
                                                <option>Cash</option>
                                                <option>Cheque</option>
                                            </Select>
                                        </div>
                                        <div className={styles.sectionDivider}><span>Tax Settings</span></div>
                                        <div className={styles.formGrid}>
                                            <Input label="TIN Number (Optional)" id="tin" placeholder="Tax ID" />
                                            <Input label="APIT Amount (LKR)" id="apit" type="number" placeholder="0.00" />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </Tabs>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" size="md" icon={<Save size={15} />} loading={saving} onClick={handleSave}>
                        {isEdit ? 'Save Changes' : 'Add Employee'}
                    </Button>
                </div>

            </div>
        </div>
    );
}
