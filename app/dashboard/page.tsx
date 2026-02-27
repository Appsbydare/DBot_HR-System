import React from 'react';
import { Users, Umbrella, UserPlus, AlertCircle } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import WorkforceChart from '@/components/dashboard/WorkforceChart';
import UpcomingLeaves from '@/components/dashboard/UpcomingLeaves';
import QuickActions from '@/components/dashboard/QuickActions';
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import PayrollSummary from '@/components/dashboard/PayrollSummary';
import styles from './page.module.css';

export const metadata = {
    title: 'Dashboard — Synexa HR System',
    description: 'HR System Dashboard Overview for Synexa.',
};

export default function DashboardPage() {
    return (
        <div className={styles.page}>

            {/* ────── Page Header ────── */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>Dashboard Overview</h1>
                    <p className={styles.pageSubtitle}>Welcome back, Gayani! Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className={styles.liveBadge}>
                    <span className={styles.badgeDot} />
                    <span>Live · Feb 19, 2026</span>
                </div>
            </div>

            {/* ────── Row 1: Stat Cards ────── */}
            <div className={styles.statGrid}>
                <StatCard
                    label="Total Employees"
                    value="1,240"
                    icon={<Users size={22} />}
                    trend={{ value: '+5%', direction: 'up', label: 'vs last month' }}
                    color="default"
                />
                <StatCard
                    label="On Leave Today"
                    value="12"
                    icon={<Umbrella size={22} />}
                    sub="4 Pending Approval"
                    color="orange"
                />
                <StatCard
                    label="New Hires"
                    value="45"
                    icon={<UserPlus size={22} />}
                    trend={{ value: '+12%', direction: 'up', label: 'this quarter' }}
                    color="purple"
                />
                <StatCard
                    label="Compliance Alerts"
                    value="3"
                    icon={<AlertCircle size={22} />}
                    sub="Action Required"
                    color="blue"
                />
            </div>

            {/* ────── Row 2: Workforce Chart + Upcoming Leaves ────── */}
            <div className={styles.row2}>
                <WorkforceChart />
                <UpcomingLeaves />
            </div>

            {/* ────── Row 3: [Attendance + Payroll stacked] | [Recent Activity] ────── */}
            <div className={styles.row3}>
                {/* Left column — two cards stacked */}
                <div className={styles.row3Left}>
                    <AttendanceChart />
                    <PayrollSummary />
                </div>

                {/* Right column — activity fills full height */}
                <div className={styles.row3Right}>
                    <RecentActivity />
                </div>
            </div>

            {/* ────── Quick Actions ────── */}
            <QuickActions />

        </div>
    );
}
