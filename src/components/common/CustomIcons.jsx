import React from 'react';

// Custom, bespoke, playful SVG icons designed from scratch
export const PiggyIcon = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect width="48" height="48" rx="14" fill="#FF5C8D" />
    <polygon points="12,14 16,8 20,13" fill="#FF85AA" stroke="#991B1B" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="28,13 32,8 36,14" fill="#FF85AA" stroke="#991B1B" strokeWidth="1.5" strokeLinejoin="round"/>
    <ellipse cx="24" cy="26" rx="14" ry="12" fill="#FFA5BE" stroke="#991B1B" strokeWidth="2"/>
    <ellipse cx="24" cy="14" rx="5" ry="2" fill="#D97706" />
    <circle cx="24" cy="11" r="5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    <text x="24" y="14" fontSize="6" fontWeight="900" textAnchor="middle" fill="#92400E" fontFamily="sans-serif">₹</text>
    <ellipse cx="24" cy="28" rx="6" ry="4.5" fill="#FF5C8D" stroke="#991B1B" strokeWidth="1.5"/>
    <circle cx="22" cy="28" r="1.2" fill="#7F1D1D" />
    <circle cx="26" cy="28" r="1.2" fill="#7F1D1D" />
    <path d="M16 23 Q18 20 20 23" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M28 23 Q30 20 32 23" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="15" cy="27" r="2.5" fill="#FF2A6D" opacity="0.6"/>
    <circle cx="33" cy="27" r="2.5" fill="#FF2A6D" opacity="0.6"/>
  </svg>
);

export const PizzaSliceIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M6 8 C12 6 20 6 26 8 L16 28 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M5 8 C11 5 21 5 27 8 C27.5 9.5 26.5 11 25 11 C20 9 12 9 7 11 C5.5 11 4.5 9.5 5 8 Z" fill="#D97706" />
    <circle cx="14" cy="13" r="2" fill="#DC2626" />
    <circle cx="18" cy="18" r="2.2" fill="#DC2626" />
    <circle cx="13" cy="21" r="1.5" fill="#DC2626" />
    <circle cx="17" cy="12" r="1" fill="#10B981" />
    <circle cx="13" cy="17" r="1" fill="#10B981" />
  </svg>
);

export const RocketIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M16 4 C21 8 23 15 21 21 L11 21 C9 15 11 8 16 4 Z" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1.8"/>
    <path d="M11 16 L6 20 L10 23 L11 21" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5"/>
    <path d="M21 16 L26 20 L22 23 L21 21" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5"/>
    <circle cx="16" cy="12" r="3" fill="#BFDBFE" stroke="#1E40AF" strokeWidth="1.5"/>
    <polygon points="13,22 19,22 16,28" fill="#F59E0B" />
    <polygon points="14,22 18,22 16,26" fill="#FBBF24" />
  </svg>
);

export const CottageIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <polygon points="16,5 5,14 27,14" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="1.8" strokeLinejoin="round"/>
    <rect x="8" y="14" width="16" height="13" rx="3" fill="#C4B5FD" stroke="#5B21B6" strokeWidth="1.8"/>
    <rect x="13" y="19" width="6" height="8" rx="2" fill="#6D28D9" />
    <circle cx="17.5" cy="23" r="0.8" fill="#FBBF24" />
    <rect x="21" y="8" width="3" height="5" fill="#7C3AED" />
  </svg>
);

export const PopcornIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M9 13 L11 27 L21 27 L23 13 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M13 13 L14 27 M19 13 L18 27" stroke="#FFFFFF" strokeWidth="2"/>
    <circle cx="12" cy="11" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2"/>
    <circle cx="16" cy="9" r="3.2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2"/>
    <circle cx="20" cy="11" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2"/>
    <circle cx="14" cy="7" r="2.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2"/>
    <circle cx="18" cy="7" r="2.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2"/>
  </svg>
);

export const ShoppingBagIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="7" y="11" width="18" height="16" rx="4" fill="#10B981" stroke="#047857" strokeWidth="1.8"/>
    <path d="M12 11 V8 C12 5.8 13.8 4 16 4 C18.2 4 20 5.8 20 8 V11" stroke="#047857" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="18" r="3" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2"/>
  </svg>
);

export const LightningIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <polygon points="18,3 8,17 15,17 14,29 24,15 17,15" fill="#FBBF24" stroke="#B45309" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

export const CoinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" fill="#F59E0B" stroke="#B45309" strokeWidth="2"/>
    <circle cx="16" cy="16" r="9" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
    <text x="16" y="21" fontSize="13" fontWeight="900" textAnchor="middle" fill="#78350F" fontFamily="'Fredoka', sans-serif">₹</text>
  </svg>
);

export const HandshakeHeartIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="13" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
    <path d="M11 18 L14 21 L21 14" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 8 C20.5 6 18 7 18 8.5 C18 7 15.5 6 14 8 C12.5 10 16 13 16 13 C16 13 19.5 10 22 8 Z" fill="#EF4444" transform="scale(0.6) translate(11, -2)"/>
  </svg>
);
