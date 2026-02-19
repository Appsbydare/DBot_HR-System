'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, AlertTriangle, CheckCircle2, Fingerprint, ChevronDown, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './AttendanceUploadModal.module.css';

/* ─── Types ─────────────────────────────────────────────── */
interface ParsedRecord {
    empNo: string;
    empName: string;
    date: string;
    timeIn: string;
    timeOut: string;
    hours: number;
    status: 'OK' | 'Missing Out' | 'Unknown Emp' | 'Duplicate';
}

/* ─── Sample parsed data (simulates parsing the uploaded file) ─ */
const SAMPLE_PARSED: ParsedRecord[] = [
    { empNo: 'BT-001', empName: 'Kasun Perera', date: '2026-02-19', timeIn: '08:02', timeOut: '17:05', hours: 9.0, status: 'OK' },
    { empNo: 'BT-002', empName: 'Chamari Atapattu', date: '2026-02-19', timeIn: '07:55', timeOut: '17:10', hours: 9.2, status: 'OK' },
    { empNo: 'BT-003', empName: 'Ajith Bandara', date: '2026-02-19', timeIn: '08:15', timeOut: '', hours: 0, status: 'Missing Out' },
    { empNo: 'BT-004', empName: 'Nimali Jayawardene', date: '2026-02-19', timeIn: '08:00', timeOut: '17:00', hours: 9.0, status: 'OK' },
    { empNo: 'BT-005', empName: 'Ruwan Fernando', date: '2026-02-19', timeIn: '08:30', timeOut: '17:20', hours: 8.8, status: 'OK' },
    { empNo: 'BT-006', empName: 'Sandya Kumari', date: '2026-02-19', timeIn: '08:05', timeOut: '17:02', hours: 9.0, status: 'OK' },
    { empNo: 'BT-007', empName: 'Pradeep Silva', date: '2026-02-19', timeIn: '09:10', timeOut: '17:45', hours: 8.6, status: 'OK' },
    { empNo: 'BT-009', empName: '(Unknown)', date: '2026-02-19', timeIn: '08:20', timeOut: '17:00', hours: 8.7, status: 'Unknown Emp' },
    { empNo: 'BT-001', empName: 'Kasun Perera', date: '2026-02-19', timeIn: '08:02', timeOut: '17:05', hours: 9.0, status: 'Duplicate' },
];

const STATUS_STYLE: Record<ParsedRecord['status'], { color: string; bg: string }> = {
    'OK': { color: '#10B981', bg: '#ECFDF5' },
    'Missing Out': { color: '#F59E0B', bg: '#FEF3C7' },
    'Unknown Emp': { color: '#EF4444', bg: '#FEE2E2' },
    'Duplicate': { color: '#8B5CF6', bg: '#EDE9FE' },
};

const ACCEPTED_TYPES = ['.dat', '.txt', '.csv', '.xlsx', '.xls'];

type UploadStep = 'idle' | 'selected' | 'parsing' | 'preview' | 'importing' | 'done';
type ScannerFormat = 'ZKTeco (.dat)' | 'Generic CSV' | 'Fingertec (.txt)' | 'Suprema (.xlsx)';
const SCANNER_FORMATS: ScannerFormat[] = ['ZKTeco (.dat)', 'Generic CSV', 'Fingertec (.txt)', 'Suprema (.xlsx)'];

interface Props { onClose: () => void; }

export default function AttendanceUploadModal({ onClose }: Props) {
    const [step, setStep] = useState<UploadStep>('idle');
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [format, setFormat] = useState<ScannerFormat>('ZKTeco (.dat)');
    const [showFormat, setShowFormat] = useState(false);
    const [parsed, setParsed] = useState<ParsedRecord[]>([]);
    const [skipErrors, setSkipErrors] = useState(true);
    const [importedCount, setImportedCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ─── Drag handlers ── */
    const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true); }, []);
    const onDragLeave = useCallback(() => setDragging(false), []);
    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) selectFile(f);
    }, []);

    const selectFile = (f: File) => {
        setFile(f);
        setStep('selected');
    };

    /* ─── Parse (simulated) ── */
    const handleParse = async () => {
        setStep('parsing');
        await new Promise(r => setTimeout(r, 1400));
        setParsed(SAMPLE_PARSED);
        setStep('preview');
    };

    /* ─── Import ── */
    const handleImport = async () => {
        setStep('importing');
        const validRows = skipErrors
            ? parsed.filter(r => r.status === 'OK')
            : parsed.filter(r => r.status !== 'Duplicate');
        await new Promise(r => setTimeout(r, 1600));
        setImportedCount(validRows.length);
        setStep('done');
    };

    /* ─── Stats from parsed ── */
    const counts = {
        ok: parsed.filter(r => r.status === 'OK').length,
        missing: parsed.filter(r => r.status === 'Missing Out').length,
        unknown: parsed.filter(r => r.status === 'Unknown Emp').length,
        dup: parsed.filter(r => r.status === 'Duplicate').length,
    };

    const canImport = step === 'preview' && (counts.ok > 0 || (!skipErrors && counts.missing > 0));

    return (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>

                {/* ── Modal Header ── */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.headerIcon}><Fingerprint size={20} /></div>
                        <div>
                            <h3 className={styles.title}>Import Fingerprint Attendance</h3>
                            <p className={styles.subtitle}>Upload a scanner data file to auto-populate the attendance grid.</p>
                        </div>
                    </div>
                    <button id="close-upload-modal" className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
                </div>

                {/* ── Step indicator ── */}
                <div className={styles.stepBar}>
                    {(['Upload', 'Parse', 'Review', 'Import'] as const).map((s, i) => {
                        const active = ['idle', 'selected'].includes(step) ? 0 : step === 'parsing' ? 1 : step === 'preview' ? 2 : 3;
                        return (
                            <React.Fragment key={s}>
                                {i > 0 && <div className={`${styles.stepLine} ${active >= i ? styles.stepLineDone : ''}`} />}
                                <div className={`${styles.stepDot} ${active === i ? styles.stepDotActive : active > i ? styles.stepDotDone : ''}`}>
                                    {active > i ? <CheckCircle2 size={14} /> : i + 1}
                                </div>
                                <span className={`${styles.stepLabel} ${active === i ? styles.stepLabelActive : ''}`}>{s}</span>
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className={styles.body}>

                    {/* ════ STEP 1 — Upload ════ */}
                    {(step === 'idle' || step === 'selected') && (
                        <div className={styles.uploadSection}>
                            {/* Format selector */}
                            <div className={styles.formatRow}>
                                <label className={styles.formatLabel}>Scanner / File Format</label>
                                <div className={styles.formatDropdown}>
                                    <button id="format-picker" className={styles.formatBtn} onClick={() => setShowFormat(!showFormat)}>
                                        <Fingerprint size={14} /> {format} <ChevronDown size={13} />
                                    </button>
                                    {showFormat && (
                                        <div className={styles.formatMenu}>
                                            {SCANNER_FORMATS.map(f => (
                                                <button key={f} className={`${styles.formatOption} ${format === f ? styles.formatOptionActive : ''}`}
                                                    onClick={() => { setFormat(f); setShowFormat(false); }}>
                                                    {f}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Drop zone */}
                            <div
                                id="att-dropzone"
                                className={`${styles.dropZone} ${dragging ? styles.dropZoneDragging : ''} ${file ? styles.dropZoneHasFile : ''}`}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="att-file-input"
                                    accept={ACCEPTED_TYPES.join(',')}
                                    className={styles.hiddenInput}
                                    onChange={e => { const f = e.target.files?.[0]; if (f) selectFile(f); }}
                                />
                                {file ? (
                                    <div className={styles.fileInfo}>
                                        <div className={styles.fileIcon}><FileText size={32} /></div>
                                        <div className={styles.fileName}>{file.name}</div>
                                        <div className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB · {format}</div>
                                        <button id="change-file" className={styles.changeFile}
                                            onClick={e => { e.stopPropagation(); setFile(null); setStep('idle'); }}>
                                            Change file
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.dropPrompt}>
                                        <div className={styles.dropIcon}><Upload size={36} /></div>
                                        <p className={styles.dropTitle}>Drag & drop your scanner file here</p>
                                        <p className={styles.dropSub}>or click to browse · Accepts {ACCEPTED_TYPES.join(', ')}</p>
                                    </div>
                                )}
                            </div>

                            {/* Format hint */}
                            <div className={styles.hintBox}>
                                <Info size={13} className={styles.hintIcon} />
                                <p className={styles.hintText}>
                                    <strong>ZKTeco (.dat):</strong> Standard attendance log format exported from ZKTeco software.
                                    Each row should contain: <code>DeviceID, EmpID, Date, Time, Event</code>.
                                    Ensure the file covers a single month for accurate import.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ════ STEP 2 — Parsing ════ */}
                    {step === 'parsing' && (
                        <div className={styles.parsingSection}>
                            <div className={styles.parsingSpinner} />
                            <p className={styles.parsingTitle}>Parsing file…</p>
                            <p className={styles.parsingSub}>Reading attendance records from <strong>{file?.name}</strong></p>
                        </div>
                    )}

                    {/* ════ STEP 3 — Preview ════ */}
                    {step === 'preview' && (
                        <div className={styles.previewSection}>
                            {/* Summary pills */}
                            <div className={styles.parseSummary}>
                                <div className={styles.parseChip} style={{ background: '#ECFDF5', color: '#10B981' }}>
                                    <CheckCircle2 size={13} /> {counts.ok} Ready
                                </div>
                                <div className={styles.parseChip} style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                                    <AlertTriangle size={13} /> {counts.missing} Missing Out
                                </div>
                                <div className={styles.parseChip} style={{ background: '#FEE2E2', color: '#EF4444' }}>
                                    <X size={13} /> {counts.unknown} Unknown Emp
                                </div>
                                <div className={styles.parseChip} style={{ background: '#EDE9FE', color: '#8B5CF6' }}>
                                    ⟳ {counts.dup} Duplicate
                                </div>
                            </div>

                            {/* Skip errors toggle */}
                            <label className={styles.skipToggle}>
                                <input id="skip-errors-toggle" type="checkbox" checked={skipErrors} onChange={e => setSkipErrors(e.target.checked)} />
                                <span>Import only "OK" records — skip warnings and errors</span>
                            </label>

                            {/* Preview table */}
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th className={styles.th}>Emp No</th>
                                            <th className={styles.th}>Name</th>
                                            <th className={styles.th}>Date</th>
                                            <th className={styles.th}>Time In</th>
                                            <th className={styles.th}>Time Out</th>
                                            <th className={styles.th}>Hours</th>
                                            <th className={styles.th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsed.map((r, i) => {
                                            const ss = STATUS_STYLE[r.status];
                                            const shouldSkip = skipErrors && r.status !== 'OK';
                                            return (
                                                <tr key={i} className={`${styles.row} ${shouldSkip ? styles.rowSkipped : ''}`}>
                                                    <td className={`${styles.td} ${styles.mono}`}>{r.empNo}</td>
                                                    <td className={styles.td}>{r.empName}</td>
                                                    <td className={`${styles.td} ${styles.mono}`}>{r.date}</td>
                                                    <td className={`${styles.td} ${styles.mono}`}>{r.timeIn || '—'}</td>
                                                    <td className={`${styles.td} ${styles.mono}`}>{r.timeOut || <span className={styles.missingOut}>—</span>}</td>
                                                    <td className={`${styles.td} ${styles.mono}`}>{r.hours > 0 ? r.hours.toFixed(1) + 'h' : '—'}</td>
                                                    <td className={styles.td}>
                                                        <span className={styles.statusBadge} style={{ background: ss.bg, color: ss.color }}>
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ════ STEP 4 — Importing ════ */}
                    {step === 'importing' && (
                        <div className={styles.parsingSection}>
                            <div className={styles.parsingSpinner} />
                            <p className={styles.parsingTitle}>Importing records…</p>
                            <p className={styles.parsingSub}>Writing attendance data to the grid. Please wait.</p>
                        </div>
                    )}

                    {/* ════ DONE ════ */}
                    {step === 'done' && (
                        <div className={styles.doneSection}>
                            <div className={styles.doneIcon}><CheckCircle2 size={52} /></div>
                            <h4 className={styles.doneTitle}>Import Complete!</h4>
                            <p className={styles.doneSub}>
                                <strong>{importedCount}</strong> attendance records have been imported into the grid for <strong>February 2026</strong>.
                            </p>
                            <div className={styles.doneMeta}>
                                <span>Source: {file?.name}</span>
                                <span>Format: {format}</span>
                                <span>Imported at: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={styles.doneNote}>
                                <Info size={13} /> Review the attendance grid to verify the imported data and make any manual corrections if needed.
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className={styles.footer}>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        {step === 'done' ? 'Close' : 'Cancel'}
                    </Button>
                    <div className={styles.footerRight}>
                        {step === 'selected' && (
                            <Button id="parse-file-btn" variant="primary" size="sm" icon={<FileText size={14} />} onClick={handleParse}>
                                Parse File
                            </Button>
                        )}
                        {step === 'preview' && (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => { setStep('selected'); setParsed([]); }}>← Back</Button>
                                <Button
                                    id="import-attendance-btn"
                                    variant="primary"
                                    size="sm"
                                    icon={<Upload size={14} />}
                                    disabled={!canImport}
                                    onClick={handleImport}
                                >
                                    Import {skipErrors ? counts.ok : counts.ok + counts.missing} Records
                                </Button>
                            </>
                        )}
                        {step === 'done' && (
                            <Button id="view-grid-btn" variant="success" size="sm" icon={<CheckCircle2 size={14} />} onClick={onClose}>
                                View Attendance Grid
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
