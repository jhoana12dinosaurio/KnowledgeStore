import { useState } from 'react';

type AlliedCompany = {
  initial: string;
  name: string;
  sector: string;
  description: string;
  benefits: string[];
};

export const AlliedCompanyCard = ({ company }: { company: AlliedCompany }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`lx-allied-logo-card ${isHovered ? 'lx-card-active' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="lx-allied-card-front">
        <div className="lx-allied-logo-circle">{company.initial}</div>
        <h4>{company.name}</h4>
        <span className="lx-allied-sector">{company.sector}</span>
      </div>

      <div className="lx-allied-card-back">
        <h4 className="lx-allied-card-title">{company.name}</h4>
        <p className="lx-allied-card-description">{company.description}</p>
        <div className="lx-allied-card-benefits">
          {company.benefits.map((benefit, idx) => (
            <span key={idx} className="lx-benefit-tag">{benefit}</span>
          ))}
        </div>
        <button className="lx-btn lx-btn-sm lx-btn-brand">Ver más</button>
      </div>
    </div>
  );
};
