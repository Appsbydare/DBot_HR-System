'use client';

import React, { useState } from 'react';
import styles from './Tabs.module.css';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    children: (activeTab: string) => React.ReactNode;
}

export default function Tabs({ tabs, defaultTab, onChange, children }: TabsProps) {
    const [active, setActive] = useState(defaultTab || tabs[0]?.id);

    const handleChange = (id: string) => {
        setActive(id);
        onChange?.(id);
    };

    return (
        <div className={styles.root}>
            <div className={styles.tabList} role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        id={`tab-${tab.id}`}
                        aria-selected={active === tab.id}
                        aria-controls={`tabpanel-${tab.id}`}
                        className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
                        onClick={() => handleChange(tab.id)}
                    >
                        {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
                        <span>{tab.label}</span>
                        {tab.badge !== undefined && (
                            <span className={styles.badge}>{tab.badge}</span>
                        )}
                    </button>
                ))}
            </div>
            <div
                className={styles.panel}
                role="tabpanel"
                id={`tabpanel-${active}`}
                aria-labelledby={`tab-${active}`}
            >
                {children(active)}
            </div>
        </div>
    );
}
