'use client';

import React, { useState } from 'react';
import EmployeeTable, { type Employee } from '@/components/master-data/EmployeeTable';
import EmployeeForm from '@/components/master-data/EmployeeForm';
import styles from './page.module.css';

export default function PersonalInfoPage() {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Employee | undefined>(undefined);

    const handleAdd = () => { setEditing(undefined); setShowForm(true); };
    const handleEdit = (emp: Employee) => { setEditing(emp); setShowForm(true); };
    const handleClose = () => { setShowForm(false); setEditing(undefined); };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Employee Personal Information</h1>
                    <p className={styles.pageSubtitle}>
                        Manage employee master records — personal, contact, and identification details.
                    </p>
                </div>
            </div>

            <div className={styles.card}>
                <EmployeeTable
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onView={handleEdit}
                />
            </div>

            {showForm && (
                <EmployeeForm
                    employee={editing}
                    onClose={handleClose}
                    onSave={() => {
                        // TODO: refresh table from Supabase
                        handleClose();
                    }}
                />
            )}
        </div>
    );
}
