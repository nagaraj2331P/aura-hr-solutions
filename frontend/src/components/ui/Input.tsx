import React, { forwardRef } from 'react';
import { cn } from '@/utils';
import { InputProps } from '@/types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-secondary-700">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm placeholder-secondary-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed',
            error && 'border-error-300 focus:ring-error-500 focus:border-error-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
