interface SectionHeaderProps {
  title: string;
  highlight?: string;
  description: string;
}

export function SectionHeader({ title, highlight, description }: SectionHeaderProps) {
  return (
    <div className="ev-section-header">
      <h2>{title} {highlight && <span>{highlight}</span>}</h2>
      <p>{description}</p>
    </div>
  );
}
