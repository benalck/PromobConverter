
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

  const handleConvert = () => {
    if (!xmlFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, faça upload de um arquivo XML para converter.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    
    // Read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const xmlContent = e.target?.result as string;
        
        // Convert XML to CSV
        const csvString = convertXMLToCSV(xmlContent);
        
        // Create a Blob with HTML formatting for Excel
        const htmlPrefix = 
          `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <!--[if gte mso 9]>
            <xml>
              <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                  <x:ExcelWorksheet>
                    <x:Name>Planilha</x:Name>
                    <x:WorksheetOptions>
                      <x:DisplayGridlines/>
                    </x:WorksheetOptions>
                  </x:ExcelWorksheet>
                </x:ExcelWorksheets>
              </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
              table, td, th {
                border: 1px solid #000000;
                border-collapse: collapse;
                padding: 5px;
                text-align: center;
              }
              th {
                background-color: #f0f0f0;
                font-weight: bold;
              }
              .piece-desc {
                background-color: #E5DEFF;
              }
              .material {
                background-color: #FDE1D3;
              }
              .edges {
                background-color: #F2FCE2;
              }
              .edge-color {
                background-color: #FEF7CD;
              }
              .dimensions {
                background-color: #D3E4FD;
              }
            </style>
          </head>
          <body>
            <table border="1">`;
        
        const htmlSuffix = `</table></body></html>`;
        
        // Create a Blob with the HTML content
        const blob = new Blob([htmlPrefix + csvString + htmlSuffix], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        
        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${outputFileName}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsConverting(false);
        toast({
          title: "Conversão concluída",
          description: "Seu arquivo foi convertido com sucesso.",
          variant: "default"
        });
      } catch (error) {
        console.error("Error converting file:", error);
        setIsConverting(false);
        toast({
          title: "Erro na conversão",
          description: "Ocorreu um erro ao converter o arquivo XML.",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = () => {
      setIsConverting(false);
      toast({
        title: "Erro na leitura",
        description: "Não foi possível ler o arquivo XML.",
        variant: "destructive"
      });
    };
    
    reader.readAsText(xmlFile);
  };
  
  const convertXMLToCSV = (xmlContent: string): string => {
    try {
      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      // Prepare the HTML table content, starting with headers
      let csvContent = 
        `<tr>
          <th>NUM.</th>
          <th>MÓDULO</th>
          <th>CLIENTE</th>
          <th>AMBIENTE</th>
          <th class="piece-desc">DESC. DA PEÇA</th>
          <th class="piece-desc">OBSERVAÇÕES DA PEÇA</th>
          <th class="dimensions">COMP</th>
          <th class="dimensions">LARG</th>
          <th>QUANT</th>
          <th class="edges">BORDA INF</th>
          <th class="edges">BORDA SUP</th>
          <th class="edges">BORDA DIR</th>
          <th class="edges">BORDA ESQ</th>
          <th class="edge-color">COR FITA DE BORDA</th>
          <th class="material">CHAPA</th>
          <th class="material">ESP.</th>
        </tr>`;
      
      // First try to parse ITEM tags (new format)
      const itemElements = xmlDoc.querySelectorAll('ITEM');
      
      if (itemElements.length > 0) {
        let rowCount = 1;
        
        itemElements.forEach(item => {
          const id = item.getAttribute('ID') || '';
          const description = item.getAttribute('DESCRIPTION') || '';
          const observations = item.getAttribute('OBSERVATIONS') || '';
          const width = item.getAttribute('WIDTH') || '';
          const depth = item.getAttribute('DEPTH') || '';
          const quantity = item.getAttribute('QUANTITY') || '1';
          const family = item.getAttribute('FAMILY') || '';
          
          // Get material and color from references
          let material = '';
          let color = '';
          let thickness = '';
          
          // Try to find REFERENCES section inside the ITEM
          const referencesElements = item.querySelectorAll('REFERENCES > COMPLETE, REFERENCES > MATERIAL, REFERENCES > MODEL, REFERENCES > MODEL_DESCRIPTION, REFERENCES > THICKNESS');
          
          referencesElements.forEach(ref => {
            const tagName = ref.tagName;
            const referenceValue = ref.getAttribute('REFERENCE') || '';
            
            if (tagName === 'MATERIAL') {
              material = referenceValue;
            } else if (tagName === 'MODEL' || tagName === 'MODEL_DESCRIPTION') {
              color = referenceValue;
            } else if (tagName === 'THICKNESS') {
              thickness = referenceValue;
            }
          });
          
          // Get edge banding information - using X instead of "Sim" and empty string instead of "Não"
          let edgeBottom = '';
          let edgeTop = '';
          let edgeRight = '';
          let edgeLeft = '';
          
          const edgeElements = item.querySelectorAll('REFERENCES > FITA_BORDA_1, REFERENCES > FITA_BORDA_2, REFERENCES > FITA_BORDA_3, REFERENCES > FITA_BORDA_4');
          
          edgeElements.forEach(edge => {
            const tagName = edge.tagName;
            const value = edge.getAttribute('REFERENCE') || '0';
            
            if (tagName === 'FITA_BORDA_1') {
              edgeBottom = value === '1' ? 'X' : '';
            } else if (tagName === 'FITA_BORDA_2') {
              edgeTop = value === '1' ? 'X' : '';
            } else if (tagName === 'FITA_BORDA_3') {
              edgeRight = value === '1' ? 'X' : '';
            } else if (tagName === 'FITA_BORDA_4') {
              edgeLeft = value === '1' ? 'X' : '';
            }
          });
          
          // Get edge band color
          let edgeColor = color; // Default to the same color as the piece
          const edgeColorElement = item.querySelector('REFERENCES > MODEL_DESCRIPTION_FITA');
          if (edgeColorElement) {
            edgeColor = edgeColorElement.getAttribute('REFERENCE') || color;
          }
          
          // Add row to HTML table
          csvContent += 
            `<tr>
              <td>${rowCount}</td>
              <td>${escapeHtml(family)}</td>
              <td>Cliente</td>
              <td>Ambiente</td>
              <td class="piece-desc">${escapeHtml(description)}</td>
              <td class="piece-desc">${escapeHtml(observations)}</td>
              <td class="dimensions">${depth}</td>
              <td class="dimensions">${width}</td>
              <td>${quantity}</td>
              <td class="edges">${edgeBottom}</td>
              <td class="edges">${edgeTop}</td>
              <td class="edges">${edgeRight}</td>
              <td class="edges">${edgeLeft}</td>
              <td class="edge-color">${escapeHtml(edgeColor)}</td>
              <td class="material">${escapeHtml(material)}</td>
              <td class="material">${thickness}</td>
            </tr>`;
          
          rowCount++;
        });
        
        return csvContent;
      }
      
      // If no ITEM tags, try the previous format with model categories
      const modelCategories = Array.from(xmlDoc.querySelectorAll('MODELCATEGORYINFORMATION, ModelCategoryInformation, modelcategoryinformation'));
      
      if (modelCategories.length === 0) {
        // If no categories found, create a simple sample row
        csvContent += 
          `<tr>
            <td>1</td>
            <td>Cozinhas</td>
            <td>Cliente Exemplo</td>
            <td>Exemplo</td>
            <td class="piece-desc">Exemplo Peça</td>
            <td class="piece-desc">Observações Exemplo</td>
            <td class="dimensions">100</td>
            <td class="dimensions">50</td>
            <td>2</td>
            <td class="edges">X</td>
            <td class="edges"></td>
            <td class="edges">X</td>
            <td class="edges"></td>
            <td class="edge-color">Branco</td>
            <td class="material">Chapa Exemplo</td>
            <td class="material">Espessura Exemplo</td>
          </tr>`;
        return csvContent;
      }
      
      let rowCount = 1;
      
      modelCategories.forEach(category => {
        const categoryDesc = category.getAttribute('DESCRIPTION') || category.getAttribute('Description') || 'Unknown Category';
        
        // Find all model information elements within this category
        const modelInfos = Array.from(category.querySelectorAll('MODELINFORMATION, ModelInformation, modelinformation'));
        
        modelInfos.forEach(modelInfo => {
          const modelDesc = modelInfo.getAttribute('DESCRIPTION') || modelInfo.getAttribute('Description') || 'Unknown Model';
          
          // Add row to HTML table
          csvContent += 
            `<tr>
              <td>${rowCount}</td>
              <td>Cozinhas</td>
              <td>Cliente Exemplo</td>
              <td>${escapeHtml(categoryDesc)}</td>
              <td class="piece-desc">${escapeHtml(modelDesc)}</td>
              <td class="piece-desc">Observações Exemplo</td>
              <td class="dimensions">100</td>
              <td class="dimensions">50</td>
              <td>2</td>
              <td class="edges">X</td>
              <td class="edges"></td>
              <td class="edges">X</td>
              <td class="edges"></td>
              <td class="edge-color">Branco</td>
              <td class="material">Chapa Exemplo</td>
              <td class="material">Espessura Exemplo</td>
            </tr>`;
          rowCount++;
        });
      });
      
      if (rowCount === 1) {
        // Add a sample row if no data was found
        csvContent += 
          `<tr>
            <td>1</td>
            <td>Cozinhas</td>
            <td>Cliente Exemplo</td>
            <td>Exemplo</td>
            <td class="piece-desc">Exemplo Peça</td>
            <td class="piece-desc">Observações Exemplo</td>
            <td class="dimensions">100</td>
            <td class="dimensions">50</td>
            <td>2</td>
            <td class="edges">X</td>
            <td class="edges"></td>
            <td class="edges">X</td>
            <td class="edges"></td>
            <td class="edge-color">Branco</td>
            <td class="material">Chapa Exemplo</td>
            <td class="material">Espessura Exemplo</td>
          </tr>`;
      }
      
      return csvContent;
      
    } catch (error) {
      console.error('Error converting XML to CSV:', error);
      // Return a basic CSV with just headers if there's an error
      return `<tr>
        <th>NUM.</th>
        <th>MÓDULO</th>
        <th>CLIENTE</th>
        <th>AMBIENTE</th>
        <th class="piece-desc">DESC. DA PEÇA</th>
        <th class="piece-desc">OBSERVAÇÕES DA PEÇA</th>
        <th class="dimensions">COMP</th>
        <th class="dimensions">LARG</th>
        <th>QUANT</th>
        <th class="edges">BORDA INF</th>
        <th class="edges">BORDA SUP</th>
        <th class="edges">BORDA DIR</th>
        <th class="edges">BORDA ESQ</th>
        <th class="edge-color">COR FITA DE BORDA</th>
        <th class="material">CHAPA</th>
        <th class="material">ESP.</th>
      </tr>`;
    }
  };
  
  // Helper function to escape HTML special characters
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <Card className={cn("w-full max-w-3xl mx-auto shadow-glass-sm hover:shadow-glass transition-all duration-300", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl tracking-tight">XML para XLSX Conversor</CardTitle>
        <CardDescription className="text-lg">
          Converta seus arquivos XML para planilhas Excel formatadas
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
            <Label htmlFor="outputFileName">Nome do Arquivo de Saída</Label>
            <Input 
              id="outputFileName"
              value={outputFileName} 
              onChange={(e) => setOutputFileName(e.target.value)}
              className="transition-all duration-300 focus-visible:ring-offset-2"
              placeholder="Digite o nome do arquivo sem extensão"
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
                  <span>Convertendo...</span>
                </>
              ) : (
                <>
                  <FileDown className="h-5 w-5" />
                  <span>Converter e Baixar</span>
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

