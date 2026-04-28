import type { CSSProperties } from 'react';
import type { Membership } from '../types';

interface MembershipCardProps {
  membership: Membership;
  onAction?: (membershipId: string) => void;
}

export function MembershipCard({ membership, onAction }: MembershipCardProps) {
  return (
    <div
      className={`ev-membership-card ${membership.highlighted ? 'highlighted' : ''}`}
      style={{ '--accent-color': membership.color } as CSSProperties}
    >
      {membership.highlighted && <span className="ev-membership-popular">Más popular</span>}
      <div className="ev-membership-header">
        <h3>{membership.name}</h3>
        <div className="ev-membership-price">
          <span className="ev-price-amount">{membership.price}</span>
          {membership.period && <span className="ev-price-period">{membership.period}</span>}
        </div>
        <p className="ev-membership-desc">{membership.description}</p>
      </div>
      <ul className="ev-membership-features">
        {membership.features.map((feature) => (
          <li key={feature}>
            <svg viewBox="0 0 24 24" fill="var(--accent-color)" width="18" height="18">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`ev-membership-btn ${membership.highlighted ? 'primary' : ''}`} onClick={() => onAction?.(membership.id)}>
        {membership.buttonText}
      </button>
    </div>
  );
}
