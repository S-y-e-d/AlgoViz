type ButtonProps = {
  text?: string;
  icon?: React.ReactNode; 
  onClick?: () => void;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({ text, icon, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={className || ""}
    >
      {icon && <span>{icon}</span>} 
      {text && <span>{text}</span>}
    </button>
  );
};