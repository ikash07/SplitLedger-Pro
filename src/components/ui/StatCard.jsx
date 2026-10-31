import React from 'react';
import styles from './StatCard.module.css';

const TONE_MAP = {
  neutral: { icon: styles.neutralIcon, value: styles.neutralText },
  brand: { icon: styles.brandIcon, value: styles.brandText },
  positive: { icon: styles.positiveIcon, value: styles.positiveText },
  negative: { icon: styles.negativeIcon, value: styles.negativeText },
};

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  tone = 'neutral',
}) {
  const toneClasses = TONE_MAP[tone] || TONE_MAP.neutral;

  return (
    <div className={styles.statCard}>
      <div className={styles.topRow}>
        <span className={styles.label}>{label}</span>
        {Icon ? (
          <span className={`${styles.iconBox} ${toneClasses.icon}`}>
            <Icon size={18} strokeWidth={2} />
          </span>
        ) : null}
      </div>
      <div>
        <div className={`${styles.value} ${toneClasses.value} tabular-nums`}>
          {value}
        </div>
        {subtext ? <p className={styles.subtext}>{subtext}</p> : null}
      </div>
    </div>
  );
}
