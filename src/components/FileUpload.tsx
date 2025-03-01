
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileCode2, FileX, FileCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes: string;
  fileType: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  acceptedFileTypes,
  fileType 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'XML' && fileExtension !== 'xml') {
        toast({
          title: "Invalid file type",
          description: "Please upload an XML file.",
          variant: "destructive"
        });
        return;
      }
      
      handleFileSelect(droppedFile);
    }
  }, [fileType, onFileSelect, toast]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    onFileSelect(selectedFile);
    
    toast({
      title: "File selected",
      description: `${selectedFile.name} ready for conversion.`,
      variant: "default"
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "File removed",
      description: "Upload a new file to continue.",
      variant: "default"
    });
  };

  return (
    <div className="w-full mb-8 animate-fade-in">
      <div 
        className={`file-drop-area ${isDragging ? 'active' : ''} ${file ? 'bg-secondary/50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileInputChange}
        />
        
        {!file ? (
          <div className="flex flex-col items-center justify-center py-4">
            <FileCode2 className="h-12 w-12 text-muted-foreground mb-4 animate-pulse-subtle" />
            <h3 className="text-lg font-medium mb-2">Upload your {fileType} file</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your file here, or click the button below
            </p>
            <Button 
              onClick={handleButtonClick}
              className="group relative overflow-hidden rounded-full px-6 transition-all duration-300 ease-out hover:pl-10"
            >
              <span className="absolute left-0 top-0 h-full w-0 rounded-full bg-white/20 transition-all duration-300 group-hover:w-full"></span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <Upload className="h-4 w-4" />
              </span>
              <span className="relative z-10">Select File</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <FileCheck className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">{file.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleRemoveFile}
                className="flex items-center gap-2"
              >
                <FileX className="h-4 w-4" />
                Remove
              </Button>
              <Button
                onClick={handleButtonClick}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Change File
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
