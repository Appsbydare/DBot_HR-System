'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import styles from './AttendanceChart.module.css';

const DATA = [
    { month: 'Aug', rate: 91.2, present: 1130 },
    { month: 'Sep', rate: 93.5, present: 1160 },
    { month: 'Oct', rate: 88.7, present: 1100 },
    { month: 'Nov', rate: 95.1, present: 1180 },
    { month: 'Dec', rate: 90.3, present: 1120 },
    { month: 'Jan', rate: 94.8, present: 1175 },
    { month: 'Feb', rate: 96.2, present: 1192 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className={styles.tooltip}>
                <p className={styles.tooltipLabel}>{label} 2026</p>
                <p className={styles.tooltipValue}>{payload[0].value}% attendance</p>
                <p className={styles.tooltipSub}>{payload[0].payload.present} employees present</p>
            </div>
        );
    }
    return null;
};

export default function AttendanceChart() {
    const latest = DATA[DATA.length - 1];
    const prev = DATA[DATA.length - 2];
    const diff = (latest.rate - prev.rate).toFixed(1);
    const isUp = parseFloat(diff) >= 0;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Attendance Rate</h3>
                    <p className={styles.subtitle}>Last 7 months</p>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statValue}>{latest.rate}%</span>
                    <span className={`${styles.statBadge} ${isUp ? styles.up : styles.down}`}>
                        {isUp ? '↑' : '↓'} {Math.abs(parseFloat(diff))}%
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#E63946" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'Inter' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={[85, 100]}
                        tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'Inter' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1 }} />
                    <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#E63946"
                        strokeWidth={2.5}
                        fill="url(#attendanceGrad)"
                        dot={{ fill: '#E63946', strokeWidth: 0, r: 3 }}
                        activeDot={{ fill: '#E63946', r: 5, strokeWidth: 2, stroke: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
