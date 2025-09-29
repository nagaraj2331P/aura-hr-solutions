import React from 'react';
import { cn } from '@/utils';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = true 
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-secondary-200 shadow-sm',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
