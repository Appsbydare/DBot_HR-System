'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import styles from './WorkforceChart.module.css';
import Link from 'next/link';

const DATA = [
    { name: 'Shop & Office', value: 558, percent: 45 },
    { name: 'Assistant', value: 372, percent: 30 },
    { name: 'Management', value: 310, percent: 25 },
];

const COLORS = ['#E63946', '#94A3B8', '#10B981'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        const d = payload[0];
        return (
            <div className={styles.tooltip}>
                <span className={styles.tooltipDot} style={{ background: d.payload.fill }} />
                <strong>{d.name}</strong>: {d.value.toLocaleString()} ({d.payload.percent}%)
            </div>
        );
    }
    return null;
};

export default function WorkforceChart() {
    const total = DATA.reduce((s, d) => s + d.value, 0);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>Workforce Distribution</h3>
                <Link href="/reports/mandatory" className={styles.viewLink}>View Report →</Link>
            </div>

            <div className={styles.body}>
                {/* Chart */}
                <div className={styles.chartWrap}>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={95}
                                paddingAngle={3}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {DATA.map((entry, i) => (
                                    <Cell key={entry.name} fill={COLORS[i]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Label */}
                    <div className={styles.centerLabel}>
                        <span className={styles.centerValue}>{total.toLocaleString()}</span>
                        <span className={styles.centerText}>TOTAL</span>
                    </div>
                </div>

                {/* Legend */}
                <div className={styles.legend}>
                    {DATA.map((d, i) => (
                        <div key={d.name} className={styles.legendItem}>
                            <span className={styles.legendDot} style={{ background: COLORS[i] }} />
                            <div className={styles.legendMeta}>
                                <span className={styles.legendName}>{d.name}</span>
                                <span className={styles.legendPercent}>{d.percent}% ({d.value.toLocaleString()})</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
