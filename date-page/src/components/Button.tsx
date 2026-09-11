interface ButtonProps {
  onClick: () => void;
  variant?: 'ember' | 'ash';
  children: preact.ComponentChildren;
}

export function Button({ onClick, variant = 'ember', children }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}