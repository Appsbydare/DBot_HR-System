'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Clock,
  MinusCircle,
  DollarSign,
  FileText,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  UserCircle,
  MoreVertical,
} from 'lucide-react';
import styles from './Sidebar.module.css';

// ─── Nav Tree ──────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const MAIN_MENU: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Master Data',
    icon: <Users size={18} />,
    children: [
      { label: 'Employee Personal Info', href: '/master-data/personal-info' },
      { label: 'Employment Details', href: '/master-data/employment-details' },
      { label: 'Salary Structure Setup', href: '/master-data/salary-structure' },
      { label: 'Statutory Settings', href: '/master-data/statutory-settings' },
      { label: 'Compliance Controls', href: '/master-data/compliance' },
    ],
  },
  {
    label: 'Leave & Attendance',
    icon: <Clock size={18} />,
    children: [
      { label: 'Leave Management', href: '/leave-attendance/leave-management' },
      { label: 'Attendance', href: '/leave-attendance/attendance' },
      { label: 'Shift Management', href: '/leave-attendance/shifts' },
    ],
  },
  {
    label: 'Deductions & Additions',
    icon: <MinusCircle size={18} />,
    children: [
      { label: 'Deductions', href: '/deductions-additions/deductions' },
      { label: 'Additions', href: '/deductions-additions/additions' },
      { label: 'Loan Management', href: '/deductions-additions/loans' },
    ],
  },
  {
    label: 'Pay Process',
    icon: <DollarSign size={18} />,
    children: [
      { label: 'Payroll Calculation', href: '/pay-process/payroll-calculation' },
      { label: 'Payroll Flow', href: '/pay-process/payroll-flow' },
    ],
  },
  {
    label: 'Reports & Bank Transfer',
    icon: <FileText size={18} />,
    children: [
      { label: 'Mandatory Reports', href: '/reports/mandatory' },
      { label: 'Statutory Reports', href: '/reports/statutory' },
      { label: 'Payslips', href: '/reports/payslips' },
      { label: 'Bank Transfer', href: '/reports/bank-transfer' },
    ],
  },
];

const PREFERENCES_MENU: NavItem[] = [
  {
    label: 'Settings',
    icon: <Settings size={18} />,
    children: [
      { label: 'Role & Access Control', href: '/settings/access-control' },
      { label: 'Audit Log', href: '/settings/audit-log' },
      { label: 'Backup System', href: '/settings/backup' },
      { label: 'Payroll Period Lock', href: '/settings/payroll-lock' },
    ],
  },
  {
    label: 'Help Center',
    href: '/help',
    icon: <HelpCircle size={18} />,
  },
];

// ─── NavGroup ──────────────────────────────────────────────────────────────
interface NavGroupProps {
  item: NavItem;
  pathname: string;
}

function NavGroup({ item, pathname }: NavGroupProps) {
  const isDirectActive = item.href && (pathname === item.href || pathname.startsWith(item.href + '/'));
  const hasActiveChild = item.children?.some(
    c => c.href && (pathname === c.href || pathname.startsWith(c.href + '/'))
  );
  const [open, setOpen] = useState(!!hasActiveChild);

  if (!item.children) {
    // Simple link
    return (
      <Link
        href={item.href ?? '#'}
        className={`${styles.navItem} ${isDirectActive ? styles.navItemActive : ''}`}
      >
        <span className={styles.navIcon}>{item.icon}</span>
        <span className={styles.navLabel}>{item.label}</span>
      </Link>
    );
  }

  // Accordion group
  return (
    <div className={styles.navGroup}>
      <button
        className={`${styles.navItem} ${styles.navGroupToggle} ${hasActiveChild ? styles.navItemParentActive : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
      >
        <span className={styles.navIcon}>{item.icon}</span>
        <span className={styles.navLabel}>{item.label}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {open && (
        <div className={styles.subMenu}>
          {item.children.map(child => {
            const childActive = child.href && (pathname === child.href || pathname.startsWith(child.href + '/'));
            return (
              <Link
                key={child.href}
                href={child.href ?? '#'}
                className={`${styles.subItem} ${childActive ? styles.subItemActive : ''}`}
              >
                <span className={styles.subDot} />
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo — swaps between light and dark variants via CSS */}
      <div className={styles.logoArea}>
        {/* Light mode logo */}
        <Image
          src="/synexa-logo.png"
          alt="Synexa"
          width={240}
          height={84}
          className={styles.logoLight}
          style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: 'auto' }}
          priority
        />
        {/* Dark mode logo — will be inverted via CSS filter */}
        <Image
          src="/synexa-logo.png"
          alt="Synexa"
          width={240}
          height={84}
          className={styles.logoDark}
          style={{ objectFit: 'contain', objectPosition: 'center', width: '100%', height: 'auto' }}
          priority
        />
        <p className={styles.logoSub}>HR System</p>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>

        {/* Main Menu Section */}
        <div className={styles.sectionLabel}>MAIN MENU</div>
        {MAIN_MENU.map(item => (
          <NavGroup key={item.label} item={item} pathname={pathname} />
        ))}

        {/* Preferences Section */}
        <div className={`${styles.sectionLabel} ${styles.sectionLabelSpaced}`}>PREFERENCES</div>
        {PREFERENCES_MENU.map(item => (
          <NavGroup key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* User Profile Strip */}
      <div className={styles.userStrip}>
        <div className={styles.userAvatar}>
          <UserCircle size={36} strokeWidth={1.5} />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Gayani Sadeepa</span>
          <span className={styles.userRole}>HR Manager</span>
        </div>
        <button className={styles.userMenu} aria-label="User options">
          <MoreVertical size={16} />
        </button>
      </div>
    </aside>
  );
}
