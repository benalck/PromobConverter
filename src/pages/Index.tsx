
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
              <h2 className="text-3xl font-bold tracking-tight mb-4">Conversão Simples, Resultados Perfeitos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nossa interface intuitiva torna a transformação de dados XML em planilhas Excel formatadas simples e eficiente.
              </p>
            </div>
            
            <div className="section-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={FileJson}
                title="Processamento XML"
                description="Analise estruturas XML complexas com extração precisa de elementos e atributos."
              />
              
              <FeatureCard 
                icon={FileSpreadsheet}
                title="Formatação Excel"
                description="Gere planilhas Excel perfeitamente formatadas com layouts de colunas personalizados."
              />
              
              <FeatureCard 
                icon={Upload}
                title="Arrastar e Soltar"
                description="Simplesmente arraste e solte seus arquivos XML para conversão instantânea."
              />
              
              <FeatureCard 
                icon={Download}
                title="Download com Um Clique"
                description="Baixe seus arquivos XLSX convertidos instantaneamente com um único clique."
              />
              
              <FeatureCard 
                icon={CheckCircle}
                title="Integridade de Dados"
                description="Mantenha a integridade completa dos dados durante todo o processo de conversão."
              />
              
              <FeatureCard 
                icon={Settings}
                title="Personalizável"
                description="Configure mapeamentos de colunas e formatação para atender às suas necessidades específicas."
              />
            </div>
          </div>
        </section>
        
        {/* Converter Section */}
        <section id="converter-section" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container px-6 mx-auto">
            <div className="section-fade-in mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Converta Seus Arquivos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Carregue seu arquivo XML, especifique suas preferências e baixe a planilha Excel formatada.
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
