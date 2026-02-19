'use client';

import React, { useState } from 'react';
import {
    Shield, Plus, Edit2, Trash2, Check, X,
    Eye, EyeOff, Users, Lock
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './RoleManager.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type Role = 'Admin' | 'HR' | 'Accounts' | 'Supervisor' | 'Viewer';

interface Permission {
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
}

interface RoleConfig {
    role: Role;
    userCount: number;
    color: string;
    description: string;
    permissions: Permission[];
}

interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    lastLogin: string;
    status: 'Active' | 'Inactive';
}

/* ─── Data ───────────────────────────────────────────────── */
const MODULES = ['Dashboard', 'Master Data', 'Leave & Attendance', 'Deductions & Additions', 'Loan Management', 'Pay Process', 'Reports', 'Bank Transfer', 'Settings'];

const ROLE_CONFIGS: RoleConfig[] = [
    {
        role: 'Admin',
        userCount: 2,
        color: '#DC2626',
        description: 'Full system access. Can manage users, roles, and all configuration.',
        permissions: MODULES.map(m => ({ module: m, view: true, create: true, edit: true, delete: true, export: true })),
    },
    {
        role: 'HR',
        userCount: 3,
        color: '#7C3AED',
        description: 'Manages employees, leave, attendance, and HR reports.',
        permissions: MODULES.map(m => ({
            module: m,
            view: true,
            create: ['Master Data', 'Leave & Attendance', 'Deductions & Additions'].includes(m),
            edit: ['Master Data', 'Leave & Attendance', 'Deductions & Additions'].includes(m),
            delete: m === 'Master Data',
            export: ['Reports', 'Master Data'].includes(m),
        })),
    },
    {
        role: 'Accounts',
        userCount: 2,
        color: '#0369A1',
        description: 'Handles payroll, deductions, additions, and financial reports.',
        permissions: MODULES.map(m => ({
            module: m,
            view: !['Settings'].includes(m),
            create: ['Deductions & Additions', 'Loan Management'].includes(m),
            edit: ['Deductions & Additions', 'Loan Management', 'Pay Process'].includes(m),
            delete: false,
            export: ['Reports', 'Bank Transfer'].includes(m),
        })),
    },
    {
        role: 'Supervisor',
        userCount: 5,
        color: '#D97706',
        description: 'Can view team members and approve leave requests.',
        permissions: MODULES.map(m => ({
            module: m,
            view: ['Dashboard', 'Leave & Attendance', 'Master Data'].includes(m),
            create: false,
            edit: m === 'Leave & Attendance',
            delete: false,
            export: false,
        })),
    },
    {
        role: 'Viewer',
        userCount: 1,
        color: '#6B7280',
        description: 'Read-only access to dashboards and reports.',
        permissions: MODULES.map(m => ({
            module: m,
            view: ['Dashboard', 'Reports'].includes(m),
            create: false, edit: false, delete: false, export: false,
        })),
    },
];

const USERS: SystemUser[] = [
    { id: 'U001', name: 'Nimali Jayawardene', email: 'nimali@bondtex.lk', role: 'Admin', lastLogin: '2026-02-19 08:32', status: 'Active' },
    { id: 'U002', name: 'Chamari Atapattu', email: 'chamari@bondtex.lk', role: 'HR', lastLogin: '2026-02-19 09:15', status: 'Active' },
    { id: 'U003', name: 'Gayani Alwis', email: 'gayani@bondtex.lk', role: 'HR', lastLogin: '2026-02-18 17:42', status: 'Active' },
    { id: 'U004', name: 'Kasun Perera', email: 'kasun@bondtex.lk', role: 'Accounts', lastLogin: '2026-02-19 10:01', status: 'Active' },
    { id: 'U005', name: 'Sandya Kumari', email: 'sandya@bondtex.lk', role: 'Supervisor', lastLogin: '2026-02-17 14:20', status: 'Active' },
    { id: 'U006', name: 'Thilak Dissanayake', email: 'thilak@bondtex.lk', role: 'Viewer', lastLogin: '2026-02-15 11:05', status: 'Inactive' },
    { id: 'U007', name: 'Ajith Bandara', email: 'ajith@bondtex.lk', role: 'Supervisor', lastLogin: '2026-02-19 07:50', status: 'Active' },
];

const ROLE_BADGE: Record<Role, 'danger' | 'purple' | 'info' | 'warning' | 'muted'> = {
    Admin: 'danger', HR: 'purple', Accounts: 'info', Supervisor: 'warning', Viewer: 'muted',
};

/* ─── Permission Cell ────────────────────────────────────── */
function PermCell({ value }: { value: boolean }) {
    return value
        ? <span className={styles.permYes}><Check size={13} /></span>
        : <span className={styles.permNo}><X size={13} /></span>;
}

/* ─── Add User Modal ─────────────────────────────────────── */
function AddUserModal({ onClose }: { onClose: () => void }) {
    const [saving, setSaving] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const handleSave = async () => { setSaving(true); await new Promise(r => setTimeout(r, 700)); setSaving(false); onClose(); };

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>Add System User</h3>
                    <button id="close-user-modal" className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.formGrid}>
                        <div className={styles.formField}>
                            <label htmlFor="user-name">Full Name</label>
                            <input id="user-name" type="text" className={styles.formInput} placeholder="e.g. Nimali Perera" />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="user-email">Email Address</label>
                            <input id="user-email" type="email" className={styles.formInput} placeholder="user@bondtex.lk" />
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="user-role">System Role</label>
                            <select id="user-role" className={styles.formSelect}>
                                {(['Admin', 'HR', 'Accounts', 'Supervisor', 'Viewer'] as Role[]).map(r => <option key={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className={styles.formField}>
                            <label htmlFor="user-pw">Temporary Password</label>
                            <div className={styles.pwWrap}>
                                <input id="user-pw" type={showPw ? 'text' : 'password'} className={styles.formInput} placeholder="Min. 8 characters" />
                                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(!showPw)}>
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} loading={saving} onClick={handleSave}>Create User</Button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function RoleManager() {
    const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
    const [activeRole, setActiveRole] = useState<Role>('Admin');
    const [showModal, setShowModal] = useState(false);

    const roleConfig = ROLE_CONFIGS.find(r => r.role === activeRole)!;

    return (
        <div className={styles.root}>
            {/* ── Tab Bar ── */}
            <div className={styles.tabRow}>
                <div className={styles.tabBar}>
                    {(['roles', 'users'] as const).map(t => (
                        <button key={t} id={`rbac-tab-${t}`}
                            className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(t)}>
                            {t === 'roles' ? <><Shield size={14} /> Role Permissions</> : <><Users size={14} /> System Users</>}
                        </button>
                    ))}
                </div>
                {activeTab === 'users' && (
                    <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => setShowModal(true)}>Add User</Button>
                )}
            </div>

            {/* ─────────── ROLES TAB ─────────── */}
            {activeTab === 'roles' && (
                <div className={styles.rolesLayout}>
                    {/* Role Sidebar */}
                    <div className={styles.roleSidebar}>
                        {ROLE_CONFIGS.map(rc => (
                            <div key={rc.role}
                                id={`role-item-${rc.role}`}
                                className={`${styles.roleItem} ${activeRole === rc.role ? styles.roleItemActive : ''}`}
                                onClick={() => setActiveRole(rc.role)}
                                style={{ borderLeftColor: activeRole === rc.role ? rc.color : 'transparent' }}>
                                <div className={styles.roleItemTop}>
                                    <span className={styles.roleItemName}>{rc.role}</span>
                                    <span className={styles.roleItemCount} style={{ background: rc.color + '18', color: rc.color }}>{rc.userCount}</span>
                                </div>
                                <p className={styles.roleItemDesc}>{rc.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Permission Matrix */}
                    <div className={styles.permMatrix}>
                        <div className={styles.permHeader}>
                            <div className={styles.permHeaderLeft}>
                                <span className={styles.permRole} style={{ color: roleConfig.color }}>{roleConfig.role}</span>
                                <span className={styles.permDesc}>{roleConfig.description}</span>
                            </div>
                            <Button variant="ghost" size="sm" icon={<Edit2 size={14} />}>Edit Permissions</Button>
                        </div>
                        <div className={styles.tableWrap}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th className={styles.th}>Module</th>
                                        <th className={`${styles.th} ${styles.thCenter}`}>View</th>
                                        <th className={`${styles.th} ${styles.thCenter}`}>Create</th>
                                        <th className={`${styles.th} ${styles.thCenter}`}>Edit</th>
                                        <th className={`${styles.th} ${styles.thCenter}`}>Delete</th>
                                        <th className={`${styles.th} ${styles.thCenter}`}>Export</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roleConfig.permissions.map(p => (
                                        <tr key={p.module} className={styles.row}>
                                            <td className={styles.td}><span className={styles.moduleName}>{p.module}</span></td>
                                            <td className={`${styles.td} ${styles.tdCenter}`}><PermCell value={p.view} /></td>
                                            <td className={`${styles.td} ${styles.tdCenter}`}><PermCell value={p.create} /></td>
                                            <td className={`${styles.td} ${styles.tdCenter}`}><PermCell value={p.edit} /></td>
                                            <td className={`${styles.td} ${styles.tdCenter}`}><PermCell value={p.delete} /></td>
                                            <td className={`${styles.td} ${styles.tdCenter}`}><PermCell value={p.export} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────────── USERS TAB ─────────── */}
            {activeTab === 'users' && (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>User</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Role</th>
                                <th className={styles.th}>Last Login</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {USERS.map(u => (
                                <tr key={u.id} className={styles.row}>
                                    <td className={styles.td}>
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>{u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                            <span className={styles.empName}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td className={styles.td}><span className={styles.emailCell}>{u.email}</span></td>
                                    <td className={styles.td}><Badge variant={ROLE_BADGE[u.role]} dot>{u.role}</Badge></td>
                                    <td className={styles.td}><span className={styles.mono}>{u.lastLogin}</span></td>
                                    <td className={styles.td}><Badge variant={u.status === 'Active' ? 'success' : 'muted'} dot>{u.status}</Badge></td>
                                    <td className={styles.td}>
                                        <div className={styles.rowActions}>
                                            <button id={`edit-user-${u.id}`} className={styles.actionBtn} title="Edit role"><Edit2 size={14} /></button>
                                            <button id={`lock-user-${u.id}`} className={styles.actionBtn} title="Lock account"><Lock size={14} /></button>
                                            <button id={`del-user-${u.id}`} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && <AddUserModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
