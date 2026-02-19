import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    required?: boolean;
}

export default function Input({
    label,
    error,
    hint,
    icon,
    iconPosition = 'left',
    required,
    id,
    className = '',
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={`${styles.inputWrap} ${error ? styles.hasError : ''}`}>
                {icon && iconPosition === 'left' && (
                    <span className={`${styles.iconWrap} ${styles.iconLeft}`}>{icon}</span>
                )}
                <input
                    id={inputId}
                    className={[
                        styles.input,
                        icon && iconPosition === 'left' ? styles.paddingLeft : '',
                        icon && iconPosition === 'right' ? styles.paddingRight : '',
                        className,
                    ].join(' ')}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    {...props}
                />
                {icon && iconPosition === 'right' && (
                    <span className={`${styles.iconWrap} ${styles.iconRight}`}>{icon}</span>
                )}
            </div>
            {error && (
                <p id={`${inputId}-error`} className={styles.error} role="alert">{error}</p>
            )}
            {!error && hint && (
                <p id={`${inputId}-hint`} className={styles.hint}>{hint}</p>
            )}
        </div>
    );
}

/* ─── Select variant ────────────────────────────────────── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
}

export function Select({ label, error, hint, required, id, children, ...props }: SelectProps) {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={`${styles.inputWrap} ${error ? styles.hasError : ''}`}>
                <select id={selectId} className={`${styles.input} ${styles.select}`} {...props}>
                    {children}
                </select>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {!error && hint && <p className={styles.hint}>{hint}</p>}
        </div>
    );
}

/* ─── Textarea variant ───────────────────────────────────── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
}

export function Textarea({ label, error, hint, required, id, ...props }: TextareaProps) {
    const taId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className={styles.wrapper}>
            {label && (
                <label htmlFor={taId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={`${styles.inputWrap} ${error ? styles.hasError : ''}`}>
                <textarea id={taId} className={`${styles.input} ${styles.textarea}`} {...props} />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {!error && hint && <p className={styles.hint}>{hint}</p>}
        </div>
    );
}
