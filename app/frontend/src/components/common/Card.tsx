import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'accent' | 'glass';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200/80 shadow-xs',
    muted: 'bg-slate-50/80 border-slate-200/80',
    accent: 'bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border-blue-100 shadow-xs',
    glass: 'bg-white/80 backdrop-blur-md border-white/60 shadow-sm',
  };

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={`rounded-2xl border ${variantStyles[variant]} ${hoverStyle} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`px-6 py-5 border-b border-slate-100/90 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3
    className={`text-base sm:text-lg font-bold text-slate-900 tracking-tight ${className}`.trim()}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`mt-1 text-sm text-slate-500 leading-normal ${className}`.trim()} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-6 ${className}`.trim()} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`px-6 py-4 bg-slate-50/60 border-t border-slate-100/80 rounded-b-2xl ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
);
