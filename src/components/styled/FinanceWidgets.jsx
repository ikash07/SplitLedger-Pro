import styled from 'styled-components';

/* ==========================================================================
   STYLING APPROACH 3: CSS-in-JS with styled-components
   Demonstrates dynamic prop-interpolated component styling using transient
   props ($active, $tone, $highlight, $pct) for stateful financial widgets.
   ========================================================================== */

export const SplitModeTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  padding: 4px;
  background-color: var(--bg-subtle);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
`;

export const SplitModeTab = styled.button`
  padding: 8px 10px;
  border-radius: 6px;
  border: none;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: ${(props) =>
    props.$active ? 'var(--bg-surface)' : 'transparent'};
  color: ${(props) =>
    props.$active ? 'var(--brand-primary)' : 'var(--text-secondary)'};
  box-shadow: ${(props) => (props.$active ? 'var(--shadow-xs)' : 'none')};

  &:hover {
    color: ${(props) =>
    props.$active ? 'var(--brand-primary)' : 'var(--text-primary)'};
  }
`;

export const ParticipantPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.14s ease;
  border: 1px solid
    ${(props) =>
    props.$selected ? 'var(--brand-primary)' : 'var(--border-subtle)'};
  background-color: ${(props) =>
    props.$selected ? '#f0fdfa' : 'var(--bg-surface)'};
  color: ${(props) =>
    props.$selected ? 'var(--brand-primary)' : 'var(--text-secondary)'};

  &:hover {
    border-color: var(--brand-primary);
  }
`;

export const SettlementTicket = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background-color: ${(props) =>
    props.$involvesActive ? '#fcfdfd' : 'var(--bg-surface)'};
  border: 1px solid
    ${(props) =>
    props.$involvesActive
      ? 'var(--brand-soft-border)'
      : 'var(--border-subtle)'};
  border-left: 4px solid
    ${(props) => {
    if (props.$direction === 'incoming') return 'var(--positive-ink)';
    if (props.$direction === 'outgoing') return 'var(--negative-ink)';
    return '#94a3b8';
  }};
  box-shadow: var(--shadow-xs);
  transition: transform 0.14s ease, box-shadow 0.14s ease;

  &:hover {
    box-shadow: var(--shadow-sm);
  }
`;

export const NetBalanceBanner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: var(--radius-lg);
  margin-bottom: 20px;
  border: 1px solid
    ${(props) => {
    if (props.$net > 0.01) return 'var(--positive-border)';
    if (props.$net < -0.01) return 'var(--negative-border)';
    return 'var(--border-subtle)';
  }};
  background: ${(props) => {
    if (props.$net > 0.01)
      return 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 70%)';
    if (props.$net < -0.01)
      return 'linear-gradient(135deg, #fff1f2 0%, #ffffff 70%)';
    return 'linear-gradient(135deg, #f8fafc 0%, #ffffff 70%)';
  }};
`;

export const MeterTrack = styled.div`
  width: 100%;
  height: ${(props) => props.$height || '8px'};
  background-color: var(--bg-subtle);
  border-radius: var(--radius-pill);
  overflow: hidden;
`;

export const MeterFill = styled.div`
  height: 100%;
  width: ${(props) =>
    `${Math.min(100, Math.max(0, Number(props.$pct) || 0))}%`};
  background-color: ${(props) => props.$color || 'var(--brand-primary)'};
  border-radius: var(--radius-pill);
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
`;

export const ToastFloatingBanner = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border-radius: var(--radius-md);
  background-color: ${(props) =>
    props.$tone === 'neutral' ? '#1e293b' : '#0f766e'};
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    bottom: 80px;
    left: 16px;
    right: 16px;
    justify-content: center;
  }
`;
