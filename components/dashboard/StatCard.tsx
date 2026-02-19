import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        direction: 'up' | 'down';
        label: string;
    };
    sub?: string;
    color?: 'default' | 'blue' | 'orange' | 'purple';
}

export default function StatCard({ label, value, icon, trend, sub, color = 'default' }: StatCardProps) {
    return (
        <div className={`${styles.card} ${styles[`card_${color}`]}`}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.value}>{value}</span>
                </div>
                <div className={`${styles.iconWrap} ${styles[`iconWrap_${color}`]}`}>
                    {icon}
                </div>
            </div>

            <div className={styles.footer}>
                {trend && (
                    <span className={`${styles.trend} ${trend.direction === 'up' ? styles.trendUp : styles.trendDown}`}>
                        {trend.direction === 'up'
                            ? <TrendingUp size={12} />
                            : <TrendingDown size={12} />
                        }
                        {trend.value}
                    </span>
                )}
                {sub && <span className={styles.sub}>{sub}</span>}
                {trend && <span className={styles.trendLabel}>{trend.label}</span>}
            </div>
        </div>
    );
}
