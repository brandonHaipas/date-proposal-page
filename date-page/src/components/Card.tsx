interface CardProps {
  children: preact.ComponentChildren;
  align?: 'end' | 'center';
}

export function Card({ children, align = 'end' }: CardProps) {
  return (
    <div className={`scene scene-${align}`}>
      <div className="card">{children}</div>
    </div>
  );
}