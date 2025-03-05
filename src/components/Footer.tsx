
import React from 'react';
import { cn } from '@/lib/utils';
import { Github, Twitter, Heart } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("py-10 border-t", className)}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Conversor de XML para XLSX. Todos os direitos reservados.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <div className="text-sm text-muted-foreground flex items-center">
              <span>Feito com</span>
              <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse-subtle" />
              <span>por Lovable</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
