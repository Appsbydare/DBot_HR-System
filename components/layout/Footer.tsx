import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p className={styles.copy}>
                © 2026{' '}
                <a href="https://thedbot.com" target="_blank" rel="noreferrer" className={styles.brand}>
                    theDBot LLC
                </a>
                . All rights reserved.
            </p>
            <div className={styles.links}>
                <a href="/privacy" className={styles.link}>Privacy Policy</a>
                <span className={styles.sep}>·</span>
                <a href="/terms" className={styles.link}>Terms of Service</a>
                <span className={styles.sep}>·</span>
                <a href="/help" className={styles.link}>Visit Website</a>
            </div>
        </footer>
    );
}
