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
                                            <div className={styles.fullWidth}>
                                                <Select label="Company ID" id="company-id" required>
                                                    <option value="">Select company</option>
                                                    <option value="001">001 – Head Office</option>
                                                    <option value="002">002 – Branch A</option>
                                                    <option value="003">003 – Branch B</option>
                                                    <option value="004">004 – Factory</option>
                                                    <option value="005">005 – Warehouse Unit</option>
                                                </Select>
                                            </div>
                                            <Input label="Employee Number" id="emp-no" defaultValue={employee?.empNo} placeholder="e.g. BT-013" required />
                                            <Input label="Full Name (As per NIC)" id="full-name" defaultValue={employee?.fullName} placeholder="e.g. Kasun Perera" required />
                                            <Input label="Name With Initials" id="name-initials" placeholder="e.g. K. Perera" required />
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
                                        <div className={styles.sectionDivider}><span>Emergency Contact</span></div>
                                        <div className={styles.formGrid}>
                                            <Input label="Emergency Contact Name" id="emergency-name" placeholder="Full name" />
                                            <Select label="Relationship" id="emergency-relation">
                                                <option value="">Select relationship</option>
                                                <option>Spouse</option>
                                                <option>Parent</option>
                                                <option>Sibling</option>
                                                <option>Child</option>
                                                <option>Friend</option>
                                                <option>Other</option>
                                            </Select>
                                            <Input label="Emergency Contact Number" id="emergency-phone" type="tel" placeholder="+94 7X XXX XXXX" />
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
                                            <Select label="Employment Category" id="emp-category" required>
                                                <option value="">Select category</option>
                                                <option value="permanent">Permanent</option>
                                                <option value="probation">Probation</option>
                                                <option value="casual">Casual</option>
                                                <option value="trainee">Trainee</option>
                                            </Select>
                                            <Select label="Act Category" id="act-category" required>
                                                <option value="">Select act category</option>
                                                <option value="wb-worker">Wages Board Employee (Worker)</option>
                                                <option value="wb-staff">Wages Board Employee (Staff)</option>
                                                <option value="shop-office">Shop &amp; Office Employee</option>
                                            </Select>
                                            <Select label="Employment Status" id="emp-status">
                                                <option value="active">Active</option>
                                                <option value="terminated">Terminated</option>
                                                <option value="resigned">Resigned</option>
                                                <option value="retired">Retired</option>
                                            </Select>
                                            <Input label="Join Date" id="join-date" type="date" required />
                                            <Input label="Confirmation Date" id="confirmation-date" type="date" />
                                            <Input label="Retirement Date" id="retirement-date" type="date" />
                                            <Input label="Contract Expiry Date" id="contract-expiry" type="date" />
                                            <Input label="Supervisor Name / EPF No." id="supervisor" placeholder="Name or EPF number" />
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
                                            <Input label="Other Fixed Allowances (LKR)" id="fixed-allow" type="number" placeholder="0.00" />
                                        </div>
                                        <div className={styles.sectionDivider}>
                                            <span>Payroll Flags</span>
                                        </div>
                                        <div className={styles.flagsGrid}>
                                            {[
                                                { id: 'epf-flag', label: 'EPF Applicable', defaultOn: true },
                                                { id: 'etf-flag', label: 'ETF Applicable', defaultOn: true },
                                                { id: 'ot-flag', label: 'OT Applicable', defaultOn: false },
                                                { id: 'tax-flag', label: 'Tax Applicable', defaultOn: false },
                                                { id: 'nopay-flag', label: 'No-Pay Deduction', defaultOn: false },
                                                { id: 'meal-flag', label: 'Meal Allowance', defaultOn: false },
                                                { id: 'bankpaid-flag', label: 'Bank Paid', defaultOn: true },
                                                { id: 'payenable-flag', label: 'Pay Enable', defaultOn: true },
                                            ].map(f => (
                                                <label key={f.id} className={styles.flagItem} htmlFor={f.id}>
                                                    <input id={f.id} type="checkbox" className={styles.flagCheck} defaultChecked={f.defaultOn} />
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
                                        <div className={styles.sectionDivider}><span>EPF / ETF (Statutory Rates)</span></div>
                                        <div className={styles.formGrid}>
                                            <Input label="EPF Employee Contribution" id="epf-emp" type="number" defaultValue="8" readOnly hint="Fixed at 8%" />
                                            <Input label="EPF Employer Contribution" id="epf-er" type="number" defaultValue="12" readOnly hint="Fixed at 12%" />
                                            <Input label="ETF Employer Contribution" id="etf-rate" type="number" defaultValue="3" readOnly hint="Fixed at 3%" />
                                            <Select label="Payroll Frequency" id="freq">
                                                <option value="monthly">Monthly</option>
                                                <option value="weekly">Weekly</option>
                                            </Select>
                                        </div>
                                        <div className={styles.sectionDivider}><span>Bank Account Details</span></div>
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
                                            <Input label="Cost Center" id="cost-center" placeholder="e.g. CC-001" />
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
