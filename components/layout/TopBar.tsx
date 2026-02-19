'use client';

import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, MessageSquare } from 'lucide-react';
import styles from './TopBar.module.css';

interface TopBarProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

export default function TopBar({ theme, onThemeToggle }: TopBarProps) {
    const [searchFocused, setSearchFocused] = useState(false);
    const [notifCount] = useState(4);

    return (
        <header className={styles.topbar}>
            {/* Page Breadcrumb Title — injected via CSS from layout */}
            <div className={styles.leftSection}>
                <div className={`${styles.searchWrapper} ${searchFocused ? styles.searchFocused : ''}`}>
                    <Search size={15} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search employees, reports..."
                        className={styles.searchInput}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        id="topbar-search"
                    />
                    <kbd className={styles.searchKbd}>⌘K</kbd>
                </div>
            </div>

            <div className={styles.rightSection}>
                {/* Dark Mode Toggle */}
                <button
                    className={styles.iconBtn}
                    onClick={onThemeToggle}
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    id="theme-toggle-btn"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications */}
                <button className={styles.iconBtn} aria-label="Notifications" id="notifications-btn">
                    <Bell size={18} />
                    {notifCount > 0 && (
                        <span className={styles.badge}>{notifCount}</span>
                    )}
                </button>

                {/* Messages */}
                <button className={styles.iconBtn} aria-label="Messages" id="messages-btn">
                    <MessageSquare size={18} />
                </button>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Quick Info */}
                <div className={styles.dateTime}>
                    <span className={styles.dateLabel}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
        </header>
    );
}
