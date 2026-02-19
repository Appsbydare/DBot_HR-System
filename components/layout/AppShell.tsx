'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Footer from '@/components/layout/Footer';

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const saved = localStorage.getItem('bondtex-theme') as 'light' | 'dark' | null;
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute('data-theme', saved);
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('bondtex-theme', next);
    };

    return (
        <div className="app-shell">
            <Sidebar />
            <div className="app-main">
                <TopBar theme={theme} onThemeToggle={toggleTheme} />
                <main className="app-content animate-fade-in">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
