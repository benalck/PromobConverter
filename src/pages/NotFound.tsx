
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-gray-950 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
      
      <div className="w-full max-w-md text-center animate-fade-in">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="h-1 w-16 bg-primary mx-auto my-6 rounded-full"></div>
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          asChild
          size="lg" 
          className="group relative overflow-hidden rounded-full px-8 py-6 transition-all duration-300 ease-out"
        >
          <a href="/">
            <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            <span className="relative flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Return to Home
            </span>
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
