'use client';

import React, { useState } from 'react';
import { Printer, Download, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './PayslipTemplate.module.css';

/* ─── Data ───────────────────────────────────────────────── */
const EMPLOYEES = [
    { id: 'BT-001', name: 'Kasun Perera', nameSi: 'කසුන් පෙරේරා', dept: 'IT', designation: 'Software Developer', epfNo: 'EPF001234', nic: '901234567V' },
    { id: 'BT-002', name: 'Chamari Atapattu', nameSi: 'චාමරී අතාපත්තු', dept: 'Finance', designation: 'Regional Manager', epfNo: 'EPF002345', nic: '885432198V' },
    { id: 'BT-003', name: 'Ajith Bandara', nameSi: 'අජිත් බන්ඩාර', dept: 'Production', designation: 'Machinist', epfNo: 'EPF003456', nic: '760987654V' },
    { id: 'BT-005', name: 'Ruwan Fernando', nameSi: 'රුවන් ප්‍රනාන්දු', dept: 'Production', designation: 'Production Operator', epfNo: 'EPF005678', nic: '870564321V' },
    { id: 'BT-009', name: 'Thilak Dissanayake', nameSi: 'තිලක් දිසානායක', dept: 'Logistics', designation: 'Warehouse Supervisor', epfNo: 'EPF009012', nic: '780345678V' },
];

const PAYSLIP_DATA: Record<string, {
    basic: number; budgetary: number; attendance: number; otNormal: number; otRest: number; incentive: number;
    epfEmp: number; loanDed: number; noPay: number; lateDed: number; advance: number;
    epfEr: number; etf: number;
    bankName: string; branch: string; accNo: string;
    workingDays: number; presentDays: number; absences: number;
}> = {
    'BT-001': { basic: 85000, budgetary: 5000, attendance: 3000, otNormal: 7083, otRest: 0, incentive: 5000, epfEmp: 6800, loanDed: 5000, noPay: 0, lateDed: 0, advance: 0, epfEr: 10200, etf: 2550, bankName: 'Bank of Ceylon', branch: 'Colombo 10', accNo: '1234567890', workingDays: 26, presentDays: 26, absences: 0 },
    'BT-002': { basic: 120000, budgetary: 8000, attendance: 5000, otNormal: 0, otRest: 0, incentive: 0, epfEmp: 9600, loanDed: 0, noPay: 0, lateDed: 0, advance: 0, epfEr: 14400, etf: 3600, bankName: 'Commercial Bank', branch: 'Maradana', accNo: '9876543210', workingDays: 26, presentDays: 25, absences: 1 },
    'BT-003': { basic: 42000, budgetary: 2500, attendance: 2000, otNormal: 2625, otRest: 3500, incentive: 0, epfEmp: 3360, loanDed: 0, noPay: 2800, lateDed: 0, advance: 0, epfEr: 5040, etf: 1260, bankName: "People's Bank", branch: 'Kandy', accNo: '5678901234', workingDays: 26, presentDays: 24, absences: 2 },
    'BT-005': { basic: 38000, budgetary: 2000, attendance: 1500, otNormal: 2375, otRest: 0, incentive: 0, epfEmp: 3040, loanDed: 0, noPay: 0, lateDed: 400, advance: 0, epfEr: 4560, etf: 1140, bankName: 'NSB', branch: 'Gampaha', accNo: '6677889900', workingDays: 26, presentDays: 25, absences: 1 },
    'BT-009': { basic: 58000, budgetary: 3500, attendance: 2500, otNormal: 0, otRest: 0, incentive: 3000, epfEmp: 4640, loanDed: 0, noPay: 0, lateDed: 0, advance: 0, epfEr: 6960, etf: 1740, bankName: 'Sampath Bank', branch: 'Colombo 07', accNo: '1357924680', workingDays: 26, presentDays: 26, absences: 0 },
};

const MONTHS = ['2026-02', '2026-01', '2025-12'];
const fmt = (n: number) => n.toLocaleString('en-LK');

const fmtMonthLabel = (m: string, si: boolean) => {
    const d = new Date(m + '-01');
    if (si) {
        const siMonths = ['ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි', 'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'];
        return `${siMonths[d.getMonth()]} ${d.getFullYear()}`;
    }
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

export default function PayslipTemplate() {
    const [empId, setEmpId] = useState('BT-001');
    const [month, setMonth] = useState('2026-02');
    const [sinhala, setSinhala] = useState(false);

    const emp = EMPLOYEES.find(e => e.id === empId)!;
    const data = PAYSLIP_DATA[empId]!;

    const grossEarnings = data.basic + data.budgetary + data.attendance + data.otNormal + data.otRest + data.incentive;
    const totalDed = data.epfEmp + data.loanDed + data.noPay + data.lateDed + data.advance;
    const netPay = grossEarnings - totalDed;

    const si = sinhala;

    return (
        <div className={styles.root}>
            {/* ── Controls ── */}
            <div className={styles.controls}>
                <div className={styles.controlLeft}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>{si ? 'සේවකයා' : 'Employee'}</label>
                        <select id="payslip-emp" className={styles.fieldSel} value={empId} onChange={e => setEmpId(e.target.value)}>
                            {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.id} — {e.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>{si ? 'මාසය' : 'Month'}</label>
                        <select id="payslip-month" className={styles.fieldSel} value={month} onChange={e => setMonth(e.target.value)}>
                            {MONTHS.map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <div className={styles.controlRight}>
                    <button id="payslip-lang-toggle" className={`${styles.langToggle} ${si ? styles.langSinhala : ''}`}
                        onClick={() => setSinhala(!si)}>
                        <Globe size={14} /> {si ? 'Switch to English' : 'සිංහලෙන් බලන්න'}
                    </button>
                    <Button variant="ghost" size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>Print</Button>
                    <Button variant="primary" size="sm" icon={<Download size={14} />}>Download PDF</Button>
                </div>
            </div>

            {/* ── Payslip ── */}
            <div className={`${styles.payslip} ${si ? styles.payslipSi : ''}`} id="payslip-preview">

                {/* Header */}
                <div className={styles.slipHeader}>
                    <div className={styles.companyInfo}>
                        <h1 className={styles.companyName}>Synexa (PVT) LTD</h1>
                        {si && <p className={styles.companyNameSi}>බොන්ඩ්ටෙක්ස් (පෞද්ගලික) සමාගම</p>}
                        <p className={styles.companyAddr}>No. 45, Industrial Zone, Seeduwa, Sri Lanka</p>
                    </div>
                    <div className={styles.slipTitle}>
                        <h2 className={styles.slipTitleText}>{si ? 'වැටුප් ලිපිය' : 'PAY SLIP'}</h2>
                        <p className={styles.slipMonth}>{fmtMonthLabel(month, si)}</p>
                    </div>
                </div>

                <div className={styles.divider} />

                {/* Employee Info */}
                <div className={styles.empInfo}>
                    <div className={styles.empInfoGrid}>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>{si ? 'සේවක අංකය' : 'Employee No.'}</span><span className={styles.infoValue}>{emp.id}</span></div>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>{si ? 'නම' : 'Name'}</span><span className={styles.infoValue}>{si ? emp.nameSi : emp.name}</span></div>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>{si ? 'දෙපාර්තමේන්තුව' : 'Department'}</span><span className={styles.infoValue}>{emp.dept}</span></div>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>{si ? 'තනතුර' : 'Designation'}</span><span className={styles.infoValue}>{emp.designation}</span></div>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>{si ? 'ජා.හැ.අංකය' : 'NIC'}</span><span className={styles.infoValue}>{emp.nic}</span></div>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>EPF No.</span><span className={styles.infoValue}>{emp.epfNo}</span></div>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>{si ? 'වැඩ කළ දින' : 'Working Days'}</span><span className={styles.infoValue}>{data.workingDays}</span></div>
                        <div className={styles.infoItem}><span className={styles.infoLabel}>{si ? 'පවතිනු ලැබූ දින' : 'Present Days'}</span><span className={styles.infoValue}>{data.presentDays}</span></div>
                    </div>
                </div>

                {/* Earnings & Deductions */}
                <div className={styles.payTable}>
                    {/* Earnings */}
                    <div className={styles.paySection}>
                        <div className={styles.paySectionHeader}>{si ? 'ආදායම්' : 'Earnings'}</div>
                        {[
                            { label: si ? 'මූලික වැටුප' : 'Basic Salary', value: data.basic, show: true },
                            { label: si ? 'අයවැය දීමනාව' : 'Budgetary Allowance', value: data.budgetary, show: data.budgetary > 0 },
                            { label: si ? 'පැමිණීම් දීමනාව' : 'Attendance Allowance', value: data.attendance, show: data.attendance > 0 },
                            { label: si ? 'සාමාන්‍ය OT (1.5×)' : 'OT — Normal (1.5×)', value: data.otNormal, show: data.otNormal > 0 },
                            { label: si ? 'නිවාඩු OT (2.0×)' : 'OT — Rest Day (2.0×)', value: data.otRest, show: data.otRest > 0 },
                            { label: si ? 'දිරිගැන්වීම' : 'Incentive', value: data.incentive, show: data.incentive > 0 },
                        ].filter(x => x.show).map(x => (
                            <div key={x.label} className={styles.payRow}>
                                <span className={styles.payLabel}>{x.label}</span>
                                <span className={styles.payAmount}>{fmt(x.value)}</span>
                            </div>
                        ))}
                        <div className={styles.payTotal}>
                            <span>{si ? 'මුළු ආදායම' : 'Gross Earnings'}</span>
                            <span>LKR {fmt(grossEarnings)}</span>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className={styles.paySection}>
                        <div className={styles.paySectionHeader}>{si ? 'අඩු කිරීම්' : 'Deductions'}</div>
                        {[
                            { label: si ? 'EPF (සේවක 8%)' : 'EPF — Employee 8%', value: data.epfEmp, show: data.epfEmp > 0 },
                            { label: si ? 'ණය වාරිකය' : 'Loan Installment', value: data.loanDed, show: data.loanDed > 0 },
                            { label: si ? 'නොගෙවීම' : 'No Pay', value: data.noPay, show: data.noPay > 0 },
                            { label: si ? 'ප්‍රමාද දඩය' : 'Late Penalty', value: data.lateDed, show: data.lateDed > 0 },
                            { label: si ? 'අත්තිකාරම් ආපසු' : 'Advance Recovery', value: data.advance, show: data.advance > 0 },
                        ].filter(x => x.show).map(x => (
                            <div key={x.label} className={styles.payRow}>
                                <span className={styles.payLabel}>{x.label}</span>
                                <span className={`${styles.payAmount} ${styles.dedAmount}`}>{fmt(x.value)}</span>
                            </div>
                        ))}
                        {totalDed === 0 && <div className={styles.payEmpty}>{si ? 'අඩු කිරීම් නොමැත' : 'No deductions'}</div>}
                        <div className={styles.payTotal}>
                            <span>{si ? 'මුළු අඩු කිරීම්' : 'Total Deductions'}</span>
                            <span className={styles.dedTotal}>LKR {fmt(totalDed)}</span>
                        </div>
                    </div>
                </div>

                {/* Net Pay Banner */}
                <div className={styles.netBanner}>
                    <span className={styles.netLabel}>{si ? 'ශුද්ධ ගෙවීම' : 'NET PAY'}</span>
                    <span className={styles.netAmount}>LKR {fmt(netPay)}</span>
                </div>

                {/* Employer Contributions */}
                <div className={styles.employerRow}>
                    <span className={styles.employerLabel}>{si ? 'සේවායෝජක EPF (12%)' : 'Employer EPF 12%'}</span>
                    <span className={styles.employerVal}>{fmt(data.epfEr)}</span>
                    <span className={styles.employerSep} />
                    <span className={styles.employerLabel}>{si ? 'සේවායෝජක ETF (3%)' : 'Employer ETF 3%'}</span>
                    <span className={styles.employerVal}>{fmt(data.etf)}</span>
                </div>

                {/* Bank */}
                <div className={styles.bankRow}>
                    <span className={styles.bankLabel}>{si ? 'බැංකු ගිණුම' : 'Bank'}</span>
                    <span className={styles.bankVal}>{data.bankName} · {data.branch} · Acc: {data.accNo}</span>
                </div>

                {/* Footer */}
                <div className={styles.slipFooter}>
                    <p>{si ? 'මෙය පරිගණකයෙන් ජනනය කරන ලද ලිපිය වන අතර අත්සන් අවශ්‍ය නොවේ.' : 'This is a computer-generated payslip and does not require a signature.'}</p>
                    <p>© 2026 Synexa (Pvt) Ltd · Powered by Synexa HR System</p>
                </div>
            </div>
        </div>
    );
}
