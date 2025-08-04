import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  X,
  Loader2
} from "lucide-react";
import { showSuccess, showError } from '@/utils/notifications'; // Import new notification utility
import { usePermissions } from "@/contexts/usePermissions";

interface ImportPatientProps {
  onImportComplete: () => void;
}

export const ImportPatientModal = ({ onImportComplete }: ImportPatientProps) => {
  const { hasPermission } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é arquivo Excel
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        '.xlsx',
        '.xls'
      ];
      
      const isValidFile = allowedTypes.some(type => 
        file.type === type || file.name.toLowerCase().endsWith(type)
      );

      if (isValidFile) {
        setSelectedFile(file);
        setImportResults(null);
      } else {
        showError("Arquivo inválido", "Por favor, selecione um arquivo Excel (.xlsx ou .xls).");
      }
    }
  };

  const downloadTemplate = () => {
    // Simular download do template
    const templateData = `Nome Completo,Data Nascimento,Responsável,Telefone,Email,Diagnóstico,Convênio,Observações
João Silva Santos,15/03/2011,Maria Silva,(11) 99999-1111,maria@email.com,TEA,Particular,Paciente com evolução positiva
Ana Costa Oliveira,22/07/2013,José Costa,(11) 88888-2222,jose@email.com,TDAH,Unimed,Necessita acompanhamento intensivo`;

    const blob = new Blob([templateData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_importacao_pacientes.csv';
    link.click();
  };

  const processImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    
    // Simular processamento do arquivo
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simular resultados de importação
    const mockResults = {
      successful: 8,
      failed: 2,
      errors: [
        "Linha 3: Data de nascimento inválida",
        "Linha 7: Telefone já cadastrado no sistema"
      ]
    };

    setImportResults(mockResults);
    setIsImporting(false);

    showSuccess("Importação concluída", `${mockResults.successful} pacientes importados com sucesso, ${mockResults.failed} com erro.`);

    if (mockResults.successful > 0) {
      onImportComplete();
    }
  };

  const resetModal = () => {
    setSelectedFile(null);
    setImportResults(null);
    setIsOpen(false);
  };

  if (!hasPermission('pacientes', 'create')) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar Pacientes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importação em Massa de Pacientes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instruções */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Faça o download do template, preencha com os dados dos pacientes e faça o upload do arquivo.
              Formatos aceitos: .xlsx, .xls
            </AlertDescription>
          </Alert>

          {/* Download Template */}
          <div className="p-4 border border-medical-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">1. Baixar Template</h4>
                <p className="text-sm text-muted-foreground">
                  Template com as colunas obrigatórias e formato correto
                </p>
              </div>
              <Button onClick={downloadTemplate} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>

          {/* Upload Arquivo */}
          <div className="p-4 border border-medical-border rounded-lg">
            <h4 className="font-medium mb-3">2. Selecionar Arquivo Preenchido</h4>
            
            <div className="border-2 border-dashed border-medical-border rounded-lg p-6 text-center">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              
              {selectedFile ? (
                <div className="space-y-2">
                  <p className="font-medium text-success">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedFile(null)}
                    className="gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Clique para selecionar ou arraste o arquivo aqui
                  </p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="max-w-xs mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resultados da Importação */}
          {importResults && (
            <div className="p-4 border border-medical-border rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Resultados da Importação
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-2xl font-bold text-success">{importResults.successful}</p>
                  <p className="text-sm text-muted-foreground">Importados</p>
                </div>
                <div className="text-center p-3 bg-destructive/10 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">{importResults.failed}</p>
                  <p className="text-sm text-muted-foreground">Com Erro</p>
                </div>
              </div>

              {importResults.errors.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 text-destructive">Erros encontrados:</h5>
                  <ul className="space-y-1 text-sm">
                    {importResults.errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3">
            {!importResults ? (
              <>
                <Button 
                  onClick={processImport} 
                  disabled={!selectedFile || isImporting}
                  className="flex-1 gap-2"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Iniciar Importação
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={resetModal} className="flex-1">
                Nova Importação
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};