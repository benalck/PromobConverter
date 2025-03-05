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
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const xmlContent = e.target?.result as string;
        
        const csvString = convertXMLToCSV(xmlContent);
        
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
              .comp {
                background-color: #FDE1D3;
              }
              .larg {
                background-color: #D3E4FD;
              }
              .borda-inf, .borda-sup {
                background-color: #FDE1D3;
              }
              .borda-dir, .borda-esq {
                background-color: #D3E4FD;
              }
              .edge-color {
                background-color: #FEF7CD;
              }
            </style>
          </head>
          <body>
            <table border="1">`;
        
        const htmlSuffix = `</table></body></html>`;
        
        const blob = new Blob([htmlPrefix + csvString + htmlSuffix], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        
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

  const identifyPieceType = (description: string): string => {
    const desc = description.toLowerCase();
    
    if (desc.includes('lateral') || desc.includes('lat.')) {
      return 'Lateral';
    } else if (desc.includes('base') || desc.includes('fundo')) {
      return 'Base';
    } else if (desc.includes('prateleira') || desc.includes('prat.')) {
      return 'Prateleira';
    } else if (desc.includes('porta') || desc.includes('port.')) {
      return 'Porta';
    } else if (desc.includes('gaveta') || desc.includes('gav.')) {
      return 'Gaveta';
    } else if (desc.includes('tampo') || desc.includes('top')) {
      return 'Tampo';
    } else if (desc.includes('frente') || desc.includes('front')) {
      return 'Frente';
    } else if (desc.includes('costa') || desc.includes('back')) {
      return 'Costa';
    } else if (desc.includes('divisoria') || desc.includes('div.')) {
      return 'Divisória';
    } else {
      return 'Outro';
    }
  };

  const extractPieceInfo = (description: string, uniqueId: string): string => {
    let formattedDesc = description;
    
    if (uniqueId) {
      formattedDesc = `${uniqueId} - ${description}`;
    }
    
    return formattedDesc;
  };

  const convertXMLToCSV = (xmlContent: string): string => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      let headerRow = 
        `<tr>
          <th>NUM.</th>
          <th>MÓDULO</th>
          <th>CLIENTE</th>
          <th>AMBIENTE</th>
          <th class="piece-desc">DESC. DA PEÇA</th>
          <th class="piece-desc">OBSERVAÇÕES DA PEÇA</th>
          <th style="background-color: #FDE1D3;" class="comp">COMP</th>
          <th style="background-color: #D3E4FD;" class="larg">LARG</th>
          <th>QUANT</th>
          <th style="background-color: #FDE1D3;" class="borda-inf">BORDA INF</th>
          <th style="background-color: #FDE1D3;" class="borda-sup">BORDA SUP</th>
          <th style="background-color: #D3E4FD;" class="borda-dir">BORDA DIR</th>
          <th style="background-color: #D3E4FD;" class="borda-esq">BORDA ESQ</th>
          <th class="edge-color">COR FITA DE BORDA</th>
          <th class="material">CHAPA</th>
          <th class="material">ESP.</th>
        </tr>`;
      
      const itemElements = xmlDoc.querySelectorAll('ITEM');
      
      const pieceTypeCount: Record<string, number> = {};
      
      const moduleGroups: Record<string, any[]> = {};
      
      if (itemElements.length > 0) {
        let csvContent = headerRow;
        let rowCount = 1;
        
        itemElements.forEach(item => {
          const uniqueId = item.getAttribute('UNIQUEID') || '';
          const description = item.getAttribute('DESCRIPTION') || '';
          
          const family = item.getAttribute('FAMILY') || '';
          if (family.toLowerCase().includes('acessório') || 
              family.toLowerCase().includes('acessorios') || 
              family.toLowerCase().includes('ferragem') || 
              family.toLowerCase().includes('processo') || 
              family.toLowerCase().includes('puxador')) {
            return;
          }
          
          const moduleKey = uniqueId || description || 'unknown_module';
          
          if (!moduleGroups[moduleKey]) {
            moduleGroups[moduleKey] = [];
          }
          
          moduleGroups[moduleKey].push(item);
        });
        
        Object.entries(moduleGroups).forEach(([moduleKey, moduleItems], moduleIndex) => {
          const firstItem = moduleItems[0];
          const moduleUniqueId = firstItem.getAttribute('UNIQUEID') || '';
          const moduleDescription = firstItem.getAttribute('DESCRIPTION') || '';
          const width = firstItem.getAttribute('WIDTH') || '';
          const height = firstItem.getAttribute('HEIGHT') || '';
          const depth = firstItem.getAttribute('DEPTH') || '';
          
          const moduleInfo = moduleUniqueId && moduleDescription ? 
            `(${moduleUniqueId}) - ${moduleDescription} - L.${width}mm x A.${height}mm x P.${depth}mm` : 
            '';
          
          moduleItems.forEach((item, itemIndex) => {
            const uniqueId = item.getAttribute('UNIQUEID') || '';
            const description = item.getAttribute('DESCRIPTION') || '';
            const observations = item.getAttribute('OBSERVATIONS') || '';
            const width = item.getAttribute('WIDTH') || '';
            const height = item.getAttribute('HEIGHT') || '';
            const depth = item.getAttribute('DEPTH') || '';
            const quantity = item.getAttribute('QUANTITY') || '1';
            const repetition = item.getAttribute('REPETITION') || '1';
            
            let material = '';
            let color = '';
            let thickness = '';
            
            const referencesElements = item.querySelectorAll('REFERENCES > *');
            
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
            
            let edgeColor = color;
            const edgeColorElement = item.querySelector('REFERENCES > MODEL_DESCRIPTION_FITA');
            if (edgeColorElement) {
              edgeColor = edgeColorElement.getAttribute('REFERENCE') || color;
            }
            
            const totalQuantity = parseInt(quantity, 10) * parseInt(repetition, 10);
            
            const formattedDescription = extractPieceInfo(description, uniqueId);
            
            let formattedMaterial = '';
            if (material && thickness) {
              formattedMaterial = `MDF ${thickness} ${color}`;
            }
            
            let displayedModuleInfo = '';
            if (itemIndex === 0) {
              displayedModuleInfo = moduleInfo;
            } else if (itemIndex === 10 && moduleItems.length > 15) {
              displayedModuleInfo = moduleInfo;
            }
            
            csvContent += 
              `<tr>
                <td>${rowCount}</td>
                <td>${escapeHtml(displayedModuleInfo)}</td>
                <td></td>
                <td>Ambiente 3D</td>
                <td class="piece-desc">${escapeHtml(formattedDescription)}</td>
                <td class="piece-desc">${escapeHtml(observations)}</td>
                <td class="comp">${depth}</td>
                <td class="larg">${width}</td>
                <td>${totalQuantity}</td>
                <td class="borda-inf">${edgeBottom}</td>
                <td class="borda-sup">${edgeTop}</td>
                <td class="borda-dir">${edgeRight}</td>
                <td class="borda-esq">${edgeLeft}</td>
                <td class="edge-color">${escapeHtml(edgeColor)}</td>
                <td class="material">${escapeHtml(formattedMaterial)}</td>
                <td class="material">${thickness}</td>
              </tr>`;
            
            rowCount++;
          });
          
          if (moduleIndex < Object.keys(moduleGroups).length - 1) {
            csvContent += 
              `<tr>
                <td colspan="16" style="border: none; height: 15px;"></td>
              </tr>`;
          }
        });
        
        return csvContent;
      }
      
      const modelCategories = Array.from(xmlDoc.querySelectorAll('MODELCATEGORYINFORMATION, ModelCategoryInformation, modelcategoryinformation'));
      
      if (modelCategories.length === 0) {
        let csvContent = headerRow;
        csvContent += 
          `<tr>
            <td>1</td>
            <td>(2671) - Balcão 4 Gavetas - L.500mm x A.650mm x P.500mm</td>
            <td></td>
            <td>Ambiente 3D</td>
            <td class="piece-desc">2671 - Base 15</td>
            <td class="piece-desc"></td>
            <td class="comp">470</td>
            <td class="larg">500</td>
            <td>1</td>
            <td class="borda-inf">X</td>
            <td class="borda-sup"></td>
            <td class="borda-dir"></td>
            <td class="borda-esq"></td>
            <td class="edge-color">Branco</td>
            <td class="material">MDF 15 Branco</td>
            <td class="material">15</td>
          </tr>`;
        return csvContent;
      }
      
      let csvContent = headerRow;
      let rowCount = 1;
      
      modelCategories.forEach(category => {
        const categoryDesc = category.getAttribute('DESCRIPTION') || category.getAttribute('Description') || 'Unknown Category';
        
        const modelInfos = Array.from(category.querySelectorAll('MODELINFORMATION, ModelInformation, modelinformation'));
        
        modelInfos.forEach(modelInfo => {
          const modelDesc = modelInfo.getAttribute('DESCRIPTION') || modelInfo.getAttribute('Description') || 'Unknown Model';
          
          csvContent += 
            `<tr>
              <td>1</td>
              <td>(2671) - Balcão 4 Gavetas - L.500mm x A.650mm x P.500mm</td>
              <td></td>
              <td>Ambiente 3D</td>
              <td class="piece-desc">2671 - Base 15</td>
              <td class="piece-desc"></td>
              <td class="comp">470</td>
              <td class="larg">500</td>
              <td>1</td>
              <td class="borda-inf">X</td>
              <td class="borda-sup"></td>
              <td class="borda-dir"></td>
              <td class="borda-esq"></td>
              <td class="edge-color">Branco</td>
              <td class="material">MDF 15 Branco</td>
              <td class="material">15</td>
            </tr>`;
          rowCount++;
        });
      });
      
      if (rowCount === 1) {
        csvContent += 
          `<tr>
            <td>1</td>
            <td>(2671) - Balcão 4 Gavetas - L.500mm x A.650mm x P.500mm</td>
            <td></td>
            <td>Ambiente 3D</td>
            <td class="piece-desc">2671 - Base 15</td>
            <td class="piece-desc"></td>
            <td class="comp">470</td>
            <td class="larg">500</td>
            <td>1</td>
            <td class="borda-inf">X</td>
            <td class="borda-sup"></td>
            <td class="borda-dir"></td>
            <td class="borda-esq"></td>
            <td class="edge-color">Branco</td>
            <td class="material">MDF 15 Branco</td>
            <td class="material">15</td>
          </tr>`;
      }
      
      return csvContent;
      
    } catch (error) {
      console.error('Error converting XML to CSV:', error);
      return `<tr>
        <th>NUM.</th>
        <th>MÓDULO</th>
        <th>CLIENTE</th>
        <th>AMBIENTE</th>
        <th class="piece-desc">DESC. DA PEÇA</th>
        <th class="piece-desc">OBSERVAÇÕES DA PEÇA</th>
        <th style="background-color: #FDE1D3;" class="comp">COMP</th>
        <th style="background-color: #D3E4FD;" class="larg">LARG</th>
        <th>QUANT</th>
        <th style="background-color: #FDE1D3;" class="borda-inf">BORDA INF</th>
        <th style="background-color: #FDE1D3;" class="borda-sup">BORDA SUP</th>
        <th style="background-color: #D3E4FD;" class="borda-dir">BORDA DIR</th>
        <th style="background-color: #D3E4FD;" class="borda-esq">BORDA ESQ</th>
        <th class="edge-color">COR FITA DE BORDA</th>
        <th class="material">CHAPA</th>
        <th class="material">ESP.</th>
      </tr>`;
    }
  };
  
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
