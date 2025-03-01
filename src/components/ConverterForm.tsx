
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from './FileUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ConverterFormProps {
  className?: string;
}

const ConverterForm: React.FC<ConverterFormProps> = ({ className }) => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [outputFileName, setOutputFileName] = useState('modelos_converted');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!xmlFile) {
      toast({
        title: "No file selected",
        description: "Please upload an XML file to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);

    // In a real implementation, we would call an API to convert the file
    // For now, we'll simulate a delay and show a success message
    
    setTimeout(() => {
      setIsConverting(false);
      
      // In a browser environment, we would trigger a download
      // This is simulated for demonstration purposes
      toast({
        title: "Conversion complete",
        description: "Your file has been converted successfully.",
        variant: "default"
      });
      
      // Simulate file download trigger
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${outputFileName}.xlsx`;
      link.click();
      
    }, 1500);
  };

  return (
    <Card className={cn("w-full max-w-3xl mx-auto shadow-glass-sm hover:shadow-glass transition-all duration-300", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl tracking-tight">XML to XLSX Converter</CardTitle>
        <CardDescription className="text-lg">
          Convert your XML files to formatted Excel spreadsheets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <FileUpload 
            onFileSelect={(file) => setXmlFile(file)} 
            acceptedFileTypes=".xml"
            fileType="XML"
          />
          
          <div className="space-y-2">
            <Label htmlFor="outputFileName">Output File Name</Label>
            <Input 
              id="outputFileName"
              value={outputFileName} 
              onChange={(e) => setOutputFileName(e.target.value)}
              className="transition-all duration-300 focus-visible:ring-offset-2"
              placeholder="Enter file name without extension"
            />
          </div>

          <Button 
            onClick={handleConvert}
            disabled={!xmlFile || isConverting}
            className="w-full py-6 text-base font-medium transition-all duration-300 group relative overflow-hidden"
            size="lg"
          >
            <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
            <span className="relative flex items-center justify-center gap-2">
              {isConverting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <FileDown className="h-5 w-5" />
                  <span>Convert and Download</span>
                  <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </>
              )}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConverterForm;
