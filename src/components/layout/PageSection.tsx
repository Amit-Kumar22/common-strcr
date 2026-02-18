import { ReactNode } from 'react';
import { cn } from '@/utils';

interface PageSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Reusable page section component with consistent styling
 * Provides header area with title, subtitle, and optional action
 */
export function PageSection({ 
  children, 
  title, 
  subtitle, 
  action, 
  className 
}: PageSectionProps) {
  return (
    <section className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
            {action && (
              <div className="ml-4 flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

interface CardSectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Simple card wrapper for content sections
 */
export function CardSection({ children, className, padding = 'md' }: CardSectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-sm border border-gray-200',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}