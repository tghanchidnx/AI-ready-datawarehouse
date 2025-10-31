
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-brand-secondary border border-brand-border rounded-lg shadow-md ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-brand-border">
          <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
