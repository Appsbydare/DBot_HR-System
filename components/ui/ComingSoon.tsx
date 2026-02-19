import React from 'react';
import { Construction } from 'lucide-react';
import styles from './ComingSoon.module.css';

interface ComingSoonProps {
    title: string;
    description?: string;
    phase?: number;
}

export default function ComingSoon({ title, description, phase }: ComingSoonProps) {
    return (
        <div className={styles.wrap}>
            <div className={styles.icon}>
                <Construction size={40} strokeWidth={1.5} />
            </div>
            <h1 className={styles.title}>{title}</h1>
            {description && <p className={styles.desc}>{description}</p>}
            {phase && (
                <div className={styles.phase}>
                    🗓️ Planned for Phase {phase} of development
                </div>
            )}
        </div>
    );
}
