import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFilesUploaded: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  bucketName?: string;
  folderPath?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url?: string;
  uploading: boolean;
  progress: number;
  error?: string;
}

const FileUpload = ({ 
  onFilesUploaded, 
  maxFiles = 5, 
  maxSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  bucketName = 'patient-documents',
  folderPath = 'evolutions'
}: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Limite excedido",
        description: `Máximo de ${maxFiles} arquivos permitidos`,
        variant: "destructive"
      });
      return;
    }

    // Validar tamanho dos arquivos
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Arquivo muito grande",
        description: `Arquivos devem ter no máximo ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Adicionar arquivos à lista com status de upload
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      uploading: true,
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Fazer upload de cada arquivo
    const uploadPromises = acceptedFiles.map(async (file, index) => {
      const fileId = newFiles[index].id;
      const fileName = `${folderPath}/${Date.now()}-${file.name}`;

      try {
        // Simular progresso
        const updateProgress = (progress: number) => {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        };

        // Upload para Supabase Storage
        updateProgress(20);
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        updateProgress(80);

        // Obter URL pública
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        updateProgress(100);

        // Marcar como concluído
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            uploading: false, 
            progress: 100,
            url: urlData.publicUrl
          } : f
        ));

        return urlData.publicUrl;
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            uploading: false, 
            error: 'Erro no upload'
          } : f
        ));
        return null;
      }
    });

    // Aguardar todos os uploads
    const uploadedUrls = await Promise.all(uploadPromises);
    const successfulUrls = uploadedUrls.filter(url => url !== null) as string[];
    
    if (successfulUrls.length > 0) {
      onFilesUploaded(successfulUrls);
      toast({
        title: "Upload concluído",
        description: `${successfulUrls.length} arquivo(s) enviado(s) com sucesso`,
      });
    }
  }, [files, maxFiles, maxSize, onFilesUploaded, bucketName, folderPath, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  });

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        } ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        {isDragActive ? (
          <p className="text-sm text-primary">Solte os arquivos aqui...</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              Clique para enviar ou arraste arquivos aqui
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {acceptedTypes.join(', ')} (máx. {maxSize}MB cada, {maxFiles} arquivos)
            </p>
          </div>
        )}
      </div>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Arquivos ({files.length}/{maxFiles})</h4>
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                {file.uploading && (
                  <Progress value={file.progress} className="h-1 mt-1" />
                )}
              </div>
              <div className="flex items-center gap-2">
                {file.uploading ? (
                  <div className="text-xs text-blue-600">
                    {file.progress}%
                  </div>
                ) : file.error ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  disabled={file.uploading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;