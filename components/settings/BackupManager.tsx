'use client';

import React, { useState } from 'react';
import { HardDrive, Download, RefreshCw, AlertTriangle, CheckCircle2, Clock, Trash2, Upload, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import styles from './BackupManager.module.css';

/* ─── Types ─────────────────────────────────────────────── */
type BackupStatus = 'Completed' | 'Failed' | 'Running' | 'Scheduled';

interface Backup {
    id: string;
    name: string;
    type: 'Full' | 'Incremental';
    size: string;
    createdAt: string;
    status: BackupStatus;
    includes: string[];
}

/* ─── Mock Data ─────────────────────────────────────────── */
const BACKUPS: Backup[] = [
    { id: 'BK001', name: 'Full Backup — Feb 2026', type: 'Full', size: '24.8 MB', createdAt: '2026-02-19 02:00:00', status: 'Completed', includes: ['Employee Records', 'Payroll Data', 'Leave Records', 'Audit Logs', 'Settings'] },
    { id: 'BK002', name: 'Incremental — Week 7', type: 'Incremental', size: '3.2 MB', createdAt: '2026-02-17 02:00:00', status: 'Completed', includes: ['Employee Updates', 'Leave Changes', 'Deductions'] },
    { id: 'BK003', name: 'Incremental — Week 6', type: 'Incremental', size: '2.9 MB', createdAt: '2026-02-10 02:00:00', status: 'Failed', includes: ['Employee Updates', 'Leave Changes'] },
    { id: 'BK004', name: 'Full Backup — Jan 2026', type: 'Full', size: '22.1 MB', createdAt: '2026-01-31 02:00:00', status: 'Completed', includes: ['Employee Records', 'Payroll Data', 'Leave Records', 'Audit Logs', 'Settings'] },
    { id: 'BK005', name: 'Incremental — Week 5', type: 'Incremental', size: '4.1 MB', createdAt: '2026-02-24 02:00:00', status: 'Scheduled', includes: ['Employee Updates', 'Leave Changes', 'Deductions'] },
];

const STATUS_BADGE: Record<BackupStatus, 'success' | 'danger' | 'info' | 'warning'> = {
    Completed: 'success', Failed: 'danger', Running: 'info', Scheduled: 'warning',
};

const STATUS_ICON: Record<BackupStatus, React.ReactNode> = {
    Completed: <CheckCircle2 size={13} />,
    Failed: <AlertTriangle size={13} />,
    Running: <RefreshCw size={13} />,
    Scheduled: <Clock size={13} />,
};

const fmt = (d: string) => d;

export default function BackupManager() {
    const [runningId, setRunningId] = useState<string | null>(null);
    const [restoring, setRestoring] = useState<string | null>(null);
    const [autoSchedule, setAutoSchedule] = useState(true);
    const [retention, setRetention] = useState('90');

    const handleRunNow = async () => {
        setRunningId('new');
        await new Promise(r => setTimeout(r, 2000));
        setRunningId(null);
    };

    const handleRestore = async (id: string) => {
        setRestoring(id);
        await new Promise(r => setTimeout(r, 1800));
        setRestoring(null);
    };

    const totalSize = '77.1 MB';
    const lastGood = BACKUPS.find(b => b.status === 'Completed');

    return (
        <div className={styles.root}>
            {/* ── Status Cards ── */}
            <div className={styles.statRow}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }}><HardDrive size={20} /></div>
                    <div>
                        <span className={styles.statValue}>{totalSize}</span>
                        <span className={styles.statLabel}>Total Backup Size</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5' }}><Shield size={20} /></div>
                    <div>
                        <span className={styles.statValue}>{BACKUPS.filter(b => b.status === 'Completed').length}</span>
                        <span className={styles.statLabel}>Successful Backups</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning)' }}><Clock size={20} /></div>
                    <div>
                        <span className={styles.statValue}>{lastGood?.createdAt.split(' ')[0] ?? '—'}</span>
                        <span className={styles.statLabel}>Last Successful Backup</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(220,38,38,0.1)', color: 'var(--color-danger)' }}><AlertTriangle size={20} /></div>
                    <div>
                        <span className={styles.statValue}>{BACKUPS.filter(b => b.status === 'Failed').length}</span>
                        <span className={styles.statLabel}>Failed Backups</span>
                    </div>
                </div>
            </div>

            {/* ── Failed Alert ── */}
            {BACKUPS.some(b => b.status === 'Failed') && (
                <div className={styles.alertBanner}>
                    <AlertTriangle size={16} className={styles.alertIcon} />
                    <span><strong>1 backup failed</strong> on 2026-02-10. Check server logs and retry the incremental backup or run a full backup now.</span>
                </div>
            )}

            {/* ── Config ── */}
            <div className={styles.configCard}>
                <h4 className={styles.configTitle}>Backup Configuration</h4>
                <div className={styles.configGrid}>
                    <div className={styles.configField}>
                        <label className={styles.configLabel}>Auto Backup Schedule</label>
                        <div className={styles.toggleRow}>
                            <button id="backup-auto-toggle"
                                className={`${styles.toggle} ${autoSchedule ? styles.toggleOn : ''}`}
                                onClick={() => setAutoSchedule(!autoSchedule)}>
                                <span className={styles.toggleThumb} />
                            </button>
                            <span className={styles.toggleLabel}>{autoSchedule ? 'Enabled — runs at 02:00 daily' : 'Disabled'}</span>
                        </div>
                    </div>
                    <div className={styles.configField}>
                        <label htmlFor="backup-retention" className={styles.configLabel}>Retention Period</label>
                        <select id="backup-retention" className={styles.configSel} value={retention} onChange={e => setRetention(e.target.value)}>
                            {['30', '60', '90', '180', '365'].map(d => <option key={d} value={d}>{d} days</option>)}
                        </select>
                    </div>
                    <div className={styles.configField}>
                        <label className={styles.configLabel}>Backup Storage</label>
                        <span className={styles.configVal}>Supabase Storage · /backups/bondtex</span>
                    </div>
                    <div className={styles.configField}>
                        <label className={styles.configLabel}>Encryption</label>
                        <span className={styles.configVal} style={{ color: 'var(--color-success)' }}><CheckCircle2 size={13} /> AES-256 at rest</span>
                    </div>
                </div>
            </div>

            {/* ── Toolbar ── */}
            <div className={styles.toolbar}>
                <span className={styles.toolbarTitle}>{BACKUPS.length} backup records</span>
                <div className={styles.toolbarRight}>
                    <Button variant="ghost" size="sm" icon={<Upload size={14} />}>Restore from File</Button>
                    <Button
                        id="run-backup-now"
                        variant="primary"
                        size="sm"
                        icon={<RefreshCw size={14} className={runningId === 'new' ? styles.spinning : ''} />}
                        loading={runningId === 'new'}
                        onClick={handleRunNow}
                    >
                        {runningId === 'new' ? 'Running…' : 'Run Backup Now'}
                    </Button>
                </div>
            </div>

            {/* ── Backups List ── */}
            <div className={styles.backupList}>
                {BACKUPS.map(bk => (
                    <div key={bk.id} className={`${styles.backupCard} ${bk.status === 'Failed' ? styles.backupFailed : ''}`}>
                        <div className={styles.backupLeft}>
                            <div className={`${styles.backupIcon} ${bk.type === 'Full' ? styles.backupIconFull : styles.backupIconInc}`}>
                                <HardDrive size={20} />
                            </div>
                            <div>
                                <div className={styles.backupName}>{bk.name}</div>
                                <div className={styles.backupMeta}>{fmt(bk.createdAt)} · {bk.size} · {bk.type}</div>
                                <div className={styles.backupTags}>
                                    {bk.includes.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                                </div>
                            </div>
                        </div>
                        <div className={styles.backupRight}>
                            <Badge variant={STATUS_BADGE[bk.status]}>{STATUS_ICON[bk.status]} {bk.status}</Badge>
                            {bk.status === 'Completed' && (
                                <div className={styles.backupActions}>
                                    <Button id={`restore-${bk.id}`} variant="ghost" size="sm" icon={<Upload size={13} />}
                                        loading={restoring === bk.id} onClick={() => handleRestore(bk.id)}>Restore</Button>
                                    <Button id={`download-${bk.id}`} variant="ghost" size="sm" icon={<Download size={13} />}>Download</Button>
                                    <button id={`del-${bk.id}`} className={styles.delBtn}><Trash2 size={13} /></button>
                                </div>
                            )}
                            {bk.status === 'Failed' && (
                                <Button variant="danger" size="sm" icon={<RefreshCw size={13} />}>Retry</Button>
                            )}
                            {bk.status === 'Scheduled' && (
                                <span className={styles.scheduledLabel}>Scheduled</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
