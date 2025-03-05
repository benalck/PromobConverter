
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface HeroHeaderProps {
  className?: string;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ className }) => {
  const scrollToConverter = () => {
    const converterSection = document.getElementById('converter-section');
    if (converterSection) {
      converterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center px-6 py-24 md:py-32",
      className
    )}>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-950 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      
      <span className="inline-block animate-fade-in rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
        XML to XLSX Converter
      </span>
      
      <h1 className="animate-fade-in text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text">
        Transform XML Files into 
        <span className="block mt-1 text-primary"> Formatted Excel Spreadsheets</span>
      </h1>
      
      <p className="animate-fade-in max-w-2xl text-lg sm:text-xl text-muted-foreground mb-8">
        A simple, elegant solution for converting XML data into structured Excel spreadsheets with precise formatting and seamless organization.
      </p>
      
      <Button 
        onClick={scrollToConverter}
        size="lg" 
        className="animate-fade-in group relative overflow-hidden rounded-full px-8 py-6 transition-all duration-300 ease-out"
      >
        <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
        <span className="relative flex items-center gap-2">
          Get Started 
          <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
        </span>
      </Button>
    </div>
  );
};

export default HeroHeader;
