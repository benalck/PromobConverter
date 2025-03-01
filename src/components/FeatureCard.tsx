
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  className
}) => {
  return (
    <div className={cn(
      "group rounded-xl p-6 bg-white/60 backdrop-blur-md border border-white/20 shadow-glass-sm",
      "hover:shadow-glass transition-all duration-300 ease-out",
      "dark:bg-black/20 dark:border-white/10",
      className
    )}>
      <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary">
        <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
