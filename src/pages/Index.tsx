
import React from 'react';
import HeroHeader from '@/components/HeroHeader';
import ConverterForm from '@/components/ConverterForm';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import { FileJson, FileSpreadsheet, Upload, Download, CheckCircle, Settings } from 'lucide-react';

const Index = () => {
  // Animation handler for sections
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.section-fade-in');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroHeader />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
          <div className="container px-6 mx-auto">
            <div className="section-fade-in mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Effortless Conversion, Perfect Results</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our intuitive interface makes transforming XML data to formatted Excel spreadsheets simple and efficient.
              </p>
            </div>
            
            <div className="section-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={FileJson}
                title="XML Processing"
                description="Parse complex XML structures with precise element and attribute extraction."
              />
              
              <FeatureCard 
                icon={FileSpreadsheet}
                title="Excel Formatting"
                description="Generate perfectly formatted Excel spreadsheets with customized column layouts."
              />
              
              <FeatureCard 
                icon={Upload}
                title="Drag & Drop"
                description="Simply drag and drop your XML files for instant conversion."
              />
              
              <FeatureCard 
                icon={Download}
                title="One-Click Download"
                description="Download your converted XLSX files instantly with a single click."
              />
              
              <FeatureCard 
                icon={CheckCircle}
                title="Data Integrity"
                description="Maintain complete data integrity throughout the conversion process."
              />
              
              <FeatureCard 
                icon={Settings}
                title="Customizable"
                description="Configure column mappings and formatting to suit your specific needs."
              />
            </div>
          </div>
        </section>
        
        {/* Converter Section */}
        <section id="converter-section" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container px-6 mx-auto">
            <div className="section-fade-in mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Convert Your Files</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload your XML file, specify your preferences, and download the formatted Excel spreadsheet.
              </p>
            </div>
            
            <div className="section-fade-in">
              <ConverterForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
